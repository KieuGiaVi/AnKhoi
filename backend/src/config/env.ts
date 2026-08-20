import dotenv from 'dotenv';

dotenv.config();

export const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`[Config Error]: Missing required environment variable ${key}`);
  }
  return value;
};

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/hcare_db',
  get jwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret && process.env.NODE_ENV !== 'test') {
      throw new Error('[FATAL]: JWT_SECRET is not set in environment variables! Server cannot start.');
    }
    return secret || 'test-jwt-secret-key-123456';
  },
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
};
