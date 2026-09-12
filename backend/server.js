const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { authRequired } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json({ limit: '12mb' }));

// Uploaded files ko publicly accessible banayein
app.use('/uploads', express.static('uploads'));

// Zaroori folders khud ban jayen agar na hon
const imagesDir = path.join('uploads', 'track section', 'images');
const videosDir = path.join('uploads', 'track section', 'vedios');
const tmpDir = path.join(videosDir, '.tmp');
fs.mkdirSync(imagesDir, { recursive: true });
fs.mkdirSync(videosDir, { recursive: true });
fs.mkdirSync(tmpDir, { recursive: true });

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

// Sirf image/video files allow hain — koi random file nahi
function uploadFileFilter(req, file, cb) {
  const ok = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');
  if (!ok) {
    return cb(new Error('Only image and video files are allowed'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024, files: 1 },
  fileFilter: uploadFileFilter,
});

// ============================================================
// AUTH GUARD — hamesha ke liye: sirf admin token wale hi
// content ko edit/delete/upload kar sakte hain. Reading (GET)
// aur visitor submissions public rehte hain.
// ============================================================
app.use('/api', (req, res, next) => {
  if (req.method === 'GET') return next();
  const publicPost =
    req.path === '/auth/login' ||
    req.path === '/auth/signup' ||
    req.path === '/admin/login' ||
    req.path === '/success-stories'; // visitor story submission
  if (publicPost) return next();
  return authRequired(req, res, next);
});

// Upload endpoint — yahan file upload hogi (image ya chhoti video)
app.post('/api/upload', authRequired, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const isVideo = req.file.mimetype.startsWith('video/');
  const folder = isVideo ? 'track section/vedios' : 'track section/images';
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${folder}/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Badi videos ka chunked upload — file 2MB ke chunks mein bhej kar
// backend yahan pada-pada jodta hai. Ye hosting ke request-size limit
// (jaise nginx/render ka 1-10MB) ko bypass kar deta hai aur progress bhi
// frontend ko dikhta hai.
const chunkStorage = multer.memoryStorage();
const uploadChunk = multer({
  storage: chunkStorage,
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: uploadFileFilter,
});

app.post('/api/upload/video', authRequired, uploadChunk.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No chunk received' });
  }
  try {
    const uploadId = String(req.body.uploadId || '');
    const index = Number(req.body.index);
    const total = Number(req.body.total);
    const originalname = String(req.body.originalname || 'video.mp4');

    if (!uploadId || isNaN(index) || isNaN(total) || total < 1) {
      return res.status(400).json({ message: 'Invalid chunk metadata' });
    }

    const workDir = path.join(tmpDir, uploadId);
    fs.mkdirSync(workDir, { recursive: true });
    fs.writeFileSync(path.join(workDir, String(index)), req.file.buffer);

    // Abhi baaki chunks baaki hain — bas accept kar lo
    if (index + 1 < total) {
      return res.json({ ok: true, received: index + 1, total });
    }

    // Aakhri chunk aa gaya — sab chunks jod kar final file banao
    const ext = path.extname(originalname) || '.mp4';
    const uniqueName = String(uploadId) + ext;
    const finalPath = path.join(videosDir, uniqueName);
    for (let i = 0; i < total; i++) {
      fs.appendFileSync(finalPath, fs.readFileSync(path.join(workDir, String(i))));
    }
    fs.rmSync(workDir, { recursive: true, force: true });

    const folder = 'track section/vedios';
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${folder}/${uniqueName}`;
    res.json({ ok: true, url: fileUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Multer errors (size limit, wrong file type) ko clean JSON banao
app.use((err, req, res, next) => {
  if (err) {
    const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).json({ message: err.message || 'Upload failed' });
  }
  next();
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