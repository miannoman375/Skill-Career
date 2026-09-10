const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Uploaded files ko publicly accessible banayein
app.use('/uploads', express.static('uploads'));

// Zaroori folders khud ban jayen agar na hon
const imagesDir = path.join('uploads', 'track section', 'images');
const videosDir = path.join('uploads', 'track section', 'vedios');
fs.mkdirSync(imagesDir, { recursive: true });
fs.mkdirSync(videosDir, { recursive: true });

// File storage settings — image aur video apne apne folder mein jayen
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isVideo = file.mimetype.startsWith('video/');
    cb(null, isVideo ? videosDir : imagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Upload endpoint — yahan file upload hogi
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const isVideo = req.file.mimetype.startsWith('video/');
  const folder = isVideo ? 'track section/vedios' : 'track section/images';
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${folder}/${req.file.filename}`;
  res.json({ url: fileUrl });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB error:', err));

app.use('/api/hero', require('./routes/hero'));
app.use('/api/footer', require('./routes/footer'));
app.use('/api/page-headings', require('./routes/pageHeadings'));
app.use('/api/tracks', require('./routes/tracks'));
app.use('/api/segments', require('./routes/segments'));
app.use('/api/webinars', require('./routes/webinars'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/steps', require('./routes/steps'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/myths', require('./routes/myths'));
app.use('/api/success-stories', require('./routes/successStories'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/adminAuth'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => {
  res.send('Backend is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));