import mongoose from 'mongoose';
import { config } from './config.js';

export async function connectDatabase() {
  if (!config.mongoUri) {
    console.log('MongoDB URI not configured; using in-memory persistence.');
    return false;
  }
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected.');
    return true;
  } catch (error) {
    console.warn(`MongoDB unavailable; using in-memory persistence. ${error.message}`);
    return false;
  }
}
