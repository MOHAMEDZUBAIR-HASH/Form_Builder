const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dynamic_form_builder';
  
  // Detect if user forgot to replace MongoDB Atlas placeholder <db_password>
  if (uri.includes('<db_password>') || uri.includes('<password>')) {
    console.error('\n⚠️ [Database Error] Your MONGODB_URI in backend/.env still contains the placeholder "<db_password>".');
    console.error('👉 Please replace "<db_password>" with your actual MongoDB Atlas database password.');
    console.error('👉 Or, to use your local MongoDB, set: MONGODB_URI=mongodb://127.0.0.1:27017/dynamic_form_builder\n');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n[Database Connection Error] ${error.message}`);
    console.error('👉 Check your IP whitelist in MongoDB Atlas (Network Access -> Allow Access from Anywhere 0.0.0.0/0) and ensure credentials are correct.\n');
  }
};

module.exports = connectDB;
