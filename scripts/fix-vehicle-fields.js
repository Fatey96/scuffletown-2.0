/**
 * Script to fix the field name mismatch in the vehicles collection
 * This script will:
 * 1. Update all vehicles where isFeatured exists to use featured instead
 * 2. Update all vehicles where isSold exists to use sold instead
 * 3. Remove the legacy isFeatured and isSold fields
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    // Get the MongoDB URI from environment or use a default for local development
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dealership';
    console.log('Connecting to MongoDB using URI:', mongoUri.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:****@'));
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Migration function
const fixVehicleFields = async () => {
  const db = mongoose.connection;
  const vehiclesCollection = db.collection('vehicles');
  
  console.log('Starting migration to fix vehicle fields...');
  
  // 1. Find vehicles with isFeatured field
  const vehiclesWithIsFeatured = await vehiclesCollection.find({
    isFeatured: { $exists: true }
  }).toArray();
  
  console.log(`Found ${vehiclesWithIsFeatured.length} vehicles with isFeatured field`);
  
  // 2. Update these vehicles to use featured instead
  for (const vehicle of vehiclesWithIsFeatured) {
    console.log(`Updating vehicle ${vehicle._id}: isFeatured (${vehicle.isFeatured}) -> featured (${vehicle.isFeatured})`);
    
    await vehiclesCollection.updateOne(
      { _id: vehicle._id },
      { 
        $set: { featured: vehicle.isFeatured },
        $unset: { isFeatured: "" }
      }
    );
  }
  
  // 3. Find vehicles with isSold field
  const vehiclesWithIsSold = await vehiclesCollection.find({
    isSold: { $exists: true }
  }).toArray();
  
  console.log(`Found ${vehiclesWithIsSold.length} vehicles with isSold field`);
  
  // 4. Update these vehicles to use sold instead
  for (const vehicle of vehiclesWithIsSold) {
    console.log(`Updating vehicle ${vehicle._id}: isSold (${vehicle.isSold}) -> sold (${vehicle.isSold})`);
    
    await vehiclesCollection.updateOne(
      { _id: vehicle._id },
      { 
        $set: { sold: vehicle.isSold },
        $unset: { isSold: "" }
      }
    );
  }
  
  console.log('Migration completed successfully!');
};

// Run the migration
const runMigration = async () => {
  try {
    await connectToDatabase();
    await fixVehicleFields();
    console.log('All done!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigration(); 