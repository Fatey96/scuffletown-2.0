/**
 * Script to create an admin user in the database
 * 
 * Run with: node dealership-website/scripts/createAdmin.js
 * Or navigate to the dealership-website directory and run: node scripts/createAdmin.js
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// Try to load environment variables from .env.local if dotenv is available
try {
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
} catch (e) {
  console.log('dotenv module not found, continuing without it');
}

// MongoDB connection URI - should match your application's connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dealership';

// If MONGODB_URI is not set, alert the user
if (!MONGODB_URI) {
  console.error('\x1b[31mError: MONGODB_URI is not set!\x1b[0m');
  console.log('Please set MONGODB_URI in your environment or .env.local file');
  console.log('Example: MONGODB_URI=mongodb://localhost:27017/dealership');
  process.exit(1);
}

// Admin user details
// In production, you should use environment variables for these values
const adminDetails = {
  name: 'Admin User',
  email: 'owner.scuffletown2.0@gmail.com', // Change to your preferred admin email
  role: 'admin',
};

// Generate a strong random password
function generateSecurePassword(length = 16) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
  let password = '';
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % charset.length;
    password += charset[randomIndex];
  }
  
  return password;
}

async function createAdminUser() {
  let client;
  let generatedPassword = '';
  
  try {
    console.log('Connecting to MongoDB at:', MONGODB_URI);
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: adminDetails.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists.');
      
      // Option to reset password
      const resetPassword = process.argv.includes('--reset-password');
      
      if (resetPassword) {
        generatedPassword = generateSecurePassword();
        const passwordHash = await bcrypt.hash(generatedPassword, 10);
        
        await usersCollection.updateOne(
          { email: adminDetails.email },
          { $set: { password: passwordHash } }
        );
        
        console.log('Admin password has been reset.');
      } else {
        console.log('Use --reset-password flag to reset the admin password.');
        return;
      }
    } else {
      // Create new admin user
      generatedPassword = generateSecurePassword();
      const passwordHash = await bcrypt.hash(generatedPassword, 10);
      
      const newAdmin = {
        ...adminDetails,
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await usersCollection.insertOne(newAdmin);
      console.log('Admin user created successfully.');
    }
    
    // Display the credentials
    console.log('\n===== ADMIN CREDENTIALS =====');
    console.log(`Email: ${adminDetails.email}`);
    console.log(`Password: ${generatedPassword}`);
    console.log('=============================');
    console.log('\nIMPORTANT: Save these credentials securely. This password will not be shown again.');
    
  } catch (error) {
    console.error('\x1b[31mError creating admin user:\x1b[0m', error);
    console.log('\nPossible issues:');
    console.log('1. MongoDB is not running or not accessible');
    console.log('2. MONGODB_URI environment variable is not set correctly');
    console.log('3. Required packages are not installed (run: npm install mongodb bcryptjs dotenv)');
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

createAdminUser(); 