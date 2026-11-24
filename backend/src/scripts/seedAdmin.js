require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dynamic_form_builder';

  if (uri.includes('<db_password>') || uri.includes('<password>')) {
    console.error('\n⚠️ [Seed Error] Your MONGODB_URI in backend/.env contains "<db_password>".');
    console.error('👉 Please replace "<db_password>" with your real MongoDB Atlas password,');
    console.error('👉 or set MONGODB_URI=mongodb://127.0.0.1:27017/dynamic_form_builder to use your local MongoDB.\n');
    process.exit(1);
  }

  try {
    console.log(`[Seed] Connecting to MongoDB...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed] Connected to MongoDB successfully.');

    const adminEmail = 'admin@dynamicforms.com';
    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      console.log(`[Seed] Admin user already exists: ${adminEmail}`);
      process.exit(0);
    }

    const admin = await User.create({

      email: adminEmail,
      password: 'password123',
      role: 'admin',
    });

    console.log(`\n✅ Default Admin created successfully!`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password: password123\n`);
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ [Seed Error] ${error.message}`);
    console.error('👉 If using MongoDB Atlas, make sure your IP is whitelisted (Network Access -> 0.0.0.0/0) and password is correct.\n');
    process.exit(1);
  }
};

seedAdmin();
