const mongoose = require('mongoose');
const User = require('./schemas/user');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Conectare la MongoDB
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectat la MongoDB');

    // Șterge user-ul vechi dacă există
    await User.deleteOne({ email: 'admin@natalia.md' });

    // Creează user admin
    const adminUser = new User({
      email: 'admin@natalia.md',
      password: 'Admin123!#',
      role: 'admin'
    });

    await adminUser.save();

    console.log('✅ User admin creat cu succes!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email: admin@natalia.md');
    console.log('Parolă: Admin123!#');
    console.log('Role: admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    process.exit(1);
  }
};

createAdmin();
