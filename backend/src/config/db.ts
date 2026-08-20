import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/hcare_db';
    await mongoose.connect(mongoUri);
    console.log(`[Database]: Connected to MongoDB successfully (${mongoUri})`);
  } catch (error) {
    console.error('[Database]: Failed to connect to MongoDB', error);
    process.exit(1);
  }
};
