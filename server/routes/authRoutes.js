import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { comparePassword, createUser, findUserByEmail, publicUser } from '../store.js';

const router = Router();
const tokenFor = (user) => jwt.sign({ id: user.id || user._id.toString(), email: user.email }, config.jwtSecret, { expiresIn: '7d' });

router.post('/register', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 6) return response.status(400).json({ error: 'Name, email, and a 6-character password are required.' });
    if (await findUserByEmail(request.app, email)) return response.status(409).json({ error: 'An account with that email already exists.' });
    const user = await createUser(request.app, { name: name.trim(), email: email.trim(), password });
    response.status(201).json({ user: publicUser(user), token: tokenFor(user) });
  } catch (error) { response.status(500).json({ error: error.message }); }
});

router.post('/login', async (request, response) => {
  try {
    const { email, password } = request.body;
    const user = await findUserByEmail(request.app, email || '');
    if (!user || !(await comparePassword(password || '', user))) return response.status(401).json({ error: 'Email or password is incorrect.' });
    response.json({ user: publicUser(user), token: tokenFor(user) });
  } catch (error) { response.status(500).json({ error: error.message }); }
});

export default router;
