// Script to manage vehicles in the database
// Usage: node scripts/manage-vehicles.js

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

// Function to list all vehicles and return them
const listAllVehicles = async () => {
  try {
    const vehicles = await Vehicle.find({}).sort({ createdAt: -1 });
    
    if (vehicles.length === 0) {
      console.log('No vehicles found in the database');
      return [];
    }
    
    console.log(`Found ${vehicles.length} vehicles:`);
    vehicles.forEach((vehicle, index) => {
      console.log(`${index + 1}. ${vehicle.year} ${vehicle.make} ${vehicle.model} - $${vehicle.price}`);
    });
    
    return vehicles;
  } catch (error) {
    console.error('Error listing vehicles:', error);
    return [];
  }
};

// Function to remove a specific vehicle by ID
const removeVehicleById = async (id) => {
  try {
    const result = await Vehicle.findByIdAndDelete(id);
    if (result) {
      console.log(`Successfully removed vehicle: ${result.year} ${result.make} ${result.model}`);
      return true;
    } else {
      console.log('Vehicle not found');
      return false;
    }
  } catch (error) {
    console.error('Error removing vehicle:', error);
    return false;
  }
};

// Function to show vehicle details
const showVehicleDetails = (vehicle) => {
  console.log('\n=== Vehicle Details ===');
  console.log(`ID: ${vehicle._id}`);
  console.log(`Type: ${vehicle.type}`);
  console.log(`Make: ${vehicle.make}`);
  console.log(`Model: ${vehicle.model}`);
  console.log(`Year: ${vehicle.year}`);
  console.log(`Price: $${vehicle.price}`);
  console.log(`Mileage: ${vehicle.mileage || 'N/A'}`);
  console.log(`Color: ${vehicle.color || 'N/A'}`);
  console.log(`VIN: ${vehicle.vin || 'N/A'}`);
  console.log(`Description: ${vehicle.description || 'N/A'}`);
  console.log(`Features: ${vehicle.features?.length ? vehicle.features.join(', ') : 'None'}`);
  console.log(`Images: ${vehicle.images?.length || 0} images`);
  console.log(`Featured: ${vehicle.featured ? 'Yes' : 'No'}`);
  console.log(`Sold: ${vehicle.sold ? 'Yes' : 'No'}`);
  console.log(`Created: ${vehicle.createdAt}`);
  console.log(`Last Updated: ${vehicle.updatedAt}`);
};

// Display the main menu
const showMainMenu = () => {
  console.log('\n=== Vehicle Management Menu ===');
  console.log('1. List all vehicles');
  console.log('2. View vehicle details');
  console.log('3. Delete specific vehicle');
  console.log('4. Delete ALL vehicles (dangerous)');
  console.log('5. Exit');
  rl.question('\nEnter your choice (1-5): ', handleMenuChoice);
};

// Handle menu choices
const handleMenuChoice = async (choice) => {
  switch (choice) {
    case '1': // List all vehicles
      await listAllVehicles();
      showMainMenu();
      break;
      
    case '2': // View vehicle details
      const allVehiclesForView = await listAllVehicles();
      if (allVehiclesForView.length > 0) {
        rl.question('\nEnter vehicle number to view details: ', (index) => {
          const vehicleIndex = parseInt(index) - 1;
          if (vehicleIndex >= 0 && vehicleIndex < allVehiclesForView.length) {
            showVehicleDetails(allVehiclesForView[vehicleIndex]);
          } else {
            console.log('Invalid vehicle number');
          }
          showMainMenu();
        });
      } else {
        showMainMenu();
      }
      break;
      
    case '3': // Delete specific vehicle
      const allVehiclesForDelete = await listAllVehicles();
      if (allVehiclesForDelete.length > 0) {
        rl.question('\nEnter vehicle number to delete: ', async (index) => {
          const vehicleIndex = parseInt(index) - 1;
          if (vehicleIndex >= 0 && vehicleIndex < allVehiclesForDelete.length) {
            const vehicle = allVehiclesForDelete[vehicleIndex];
            rl.question(`Are you sure you want to delete "${vehicle.year} ${vehicle.make} ${vehicle.model}"? (yes/no): `, async (confirm) => {
              if (confirm.toLowerCase() === 'yes') {
                await removeVehicleById(vehicle._id);
              } else {
                console.log('Deletion cancelled');
              }
              showMainMenu();
            });
          } else {
            console.log('Invalid vehicle number');
            showMainMenu();
          }
        });
      } else {
        showMainMenu();
      }
      break;
      
    case '4': // Delete ALL vehicles
      rl.question('Are you SURE you want to delete ALL vehicles? This cannot be undone! (yes/no): ', (answer) => {
        if (answer.toLowerCase() === 'yes') {
          rl.question('Type "DELETE ALL" to confirm: ', async (confirmation) => {
            if (confirmation === 'DELETE ALL') {
              const result = await Vehicle.deleteMany({});
              console.log(`Successfully removed ${result.deletedCount} vehicles from the database`);
            } else {
              console.log('Operation cancelled');
            }
            showMainMenu();
          });
        } else {
          console.log('Operation cancelled');
          showMainMenu();
        }
      });
      break;
      
    case '5': // Exit
      console.log('Goodbye!');
      mongoose.disconnect();
      rl.close();
      break;
      
    default:
      console.log('Invalid choice. Please try again.');
      showMainMenu();
      break;
  }
};

// Main execution
const main = async () => {
  const connected = await connectToDatabase();
  if (!connected) {
    rl.close();
    process.exit(1);
  }
  
  console.log('\nWelcome to the Vehicle Management System!\n');
  showMainMenu();
};

// Run the script
main(); 