import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database (best effort on startup, logs error if DB connection fails)
  try {
    await connectDB();
  } catch (err) {
    console.warn('[Server]: Database connection skipped or failed, continuing server startup...');
  }

  app.listen(PORT, () => {
    console.log(`[Server]: HCare+ Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();
