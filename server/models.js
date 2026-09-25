import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  time: { type: String, required: true },
  bookmarked: Boolean,
  liked: Boolean,
  disliked: Boolean,
}, { _id: false });

export const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true }));

export const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  preview: String,
  timestamp: String,
  group: String,
  messages: [messageSchema],
}, { timestamps: true }));
