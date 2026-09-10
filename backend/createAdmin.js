const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const Admin = require('./models/Admin');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = 'mahnoor@skillcareer.com';   // apna email yahan daal sakte hain
  const password = 'Mahnoor@1122';             // apna password yahan daal sakte hain

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log('Admin already exists');
    process.exit();
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = new Admin({ email, password: hashedPassword });
  await admin.save();

  console.log('Admin created successfully!');
  console.log('Email:', email);
  console.log('Password:', password);
  process.exit();
}

createAdmin();