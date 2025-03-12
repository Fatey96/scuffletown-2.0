// Script to remove all placeholder vehicles from the database
// Usage: node scripts/clear-vehicles.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    return false;
  }
};

// Define Vehicle Schema
const VehicleSchema = new mongoose.Schema({
  type: String,
  make: String,
  model: String,
  year: Number,
  price: Number,
  mileage: Number,
  color: String,
  vin: String,
  description: String,
  features: [String],
  images: [String],
  featured: Boolean,
  sold: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema);

// Function to remove all vehicles
const removeAllVehicles = async () => {
  try {
    const result = await Vehicle.deleteMany({});
    console.log(`Successfully removed ${result.deletedCount} vehicles from the database`);
  } catch (error) {
    console.error('Error removing vehicles:', error);
  }
};

// Function to list all vehicles
const listAllVehicles = async () => {
  try {
    const vehicles = await Vehicle.find({}).sort({ createdAt: -1 });
    
    if (vehicles.length === 0) {
      console.log('No vehicles found in the database');
      return;
    }
    
    console.log(`Found ${vehicles.length} vehicles:`);
    vehicles.forEach((vehicle, index) => {
      console.log(`${index + 1}. ${vehicle.year} ${vehicle.make} ${vehicle.model} - $${vehicle.price}`);
    });
  } catch (error) {
    console.error('Error listing vehicles:', error);
  }
};

// Main execution
const main = async () => {
  const connected = await connectToDatabase();
  if (!connected) {
    rl.close();
    process.exit(1);
  }
  
  console.log('\n=== Vehicle Database Management ===\n');
  await listAllVehicles();
  
  rl.question('\nDo you want to remove ALL vehicles from the database? (yes/no): ', async (answer) => {
    if (answer.toLowerCase() === 'yes') {
      rl.question('Are you ABSOLUTELY SURE? This cannot be undone! Type "DELETE ALL" to confirm: ', async (confirmation) => {
        if (confirmation === 'DELETE ALL') {
          await removeAllVehicles();
          console.log('All vehicles have been removed from the database.');
        } else {
          console.log('Operation cancelled.');
        }
        
        // Close connections and exit
        mongoose.disconnect();
        rl.close();
      });
    } else {
      console.log('Operation cancelled.');
      mongoose.disconnect();
      rl.close();
    }
  });
};

// Run the script
main(); 