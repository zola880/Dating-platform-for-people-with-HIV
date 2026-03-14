import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Check if the URI is defined in the environment variables
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Modern Mongoose handles most options automatically, 
      // but adding a timeout helps identify connection issues faster.
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;