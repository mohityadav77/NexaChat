import bcrypt from 'bcryptjs';
import { Conversation, User } from './models.js';

const memory = { users: [], conversations: [] };

export function memoryStore() { return memory; }

export async function findUserByEmail(app, email) {
  if (app.locals.dbReady) return User.findOne({ email: email.toLowerCase() });
  return memory.users.find((user) => user.email === email.toLowerCase());
}

export async function findUserById(app, id) {
  if (app.locals.dbReady) return User.findById(id);
  return memory.users.find((user) => user.id === id);
}

export async function createUser(app, { name, email, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  if (app.locals.dbReady) return User.create({ name, email: email.toLowerCase(), passwordHash });
  const user = { id: `user-${Date.now()}`, name, email: email.toLowerCase(), passwordHash };
  memory.users.push(user);
  return user;
}

export function publicUser(user) { return { id: user.id || user._id.toString(), name: user.name, email: user.email }; }
export async function comparePassword(password, user) { return bcrypt.compare(password, user.passwordHash); }

export async function listConversations(app, userId) {
  if (app.locals.dbReady) return Conversation.find({ userId }).sort({ updatedAt: -1 }).lean();
  return memory.conversations.filter((conversation) => conversation.userId === userId).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function createConversation(app, userId, data) {
  if (app.locals.dbReady) return Conversation.create({ userId, ...data });
  const conversation = { id: `conversation-${Date.now()}`, userId, updatedAt: Date.now(), ...data };
  memory.conversations.unshift(conversation);
  return conversation;
}

export async function findConversation(app, userId, conversationId) {
  if (app.locals.dbReady) return Conversation.findOne({ _id: conversationId, userId });
  return memory.conversations.find(({ id, userId: ownerId }) => id === conversationId && ownerId === userId);
}

export async function updateConversation(app, conversation, data) {
  if (app.locals.dbReady) { Object.assign(conversation, data); return conversation.save(); }
  Object.assign(conversation, data, { updatedAt: Date.now() });
  return conversation;
}

export async function deleteConversation(app, conversation) {
  if (app.locals.dbReady) return conversation.deleteOne();
  const index = memory.conversations.indexOf(conversation);
  if (index >= 0) memory.conversations.splice(index, 1);
}
