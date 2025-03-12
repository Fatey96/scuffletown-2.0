import mongoose from 'mongoose';

interface Connection {
  isConnected?: number;
}

const connection: Connection = {};

async function dbConnect(): Promise<typeof mongoose | undefined> {
  if (connection.isConnected) {
    return;
  }

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable'
    );
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    
    connection.isConnected = db.connections[0].readyState;
    
    console.log('MongoDB connected successfully');
    
    return mongoose;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export default dbConnect; 