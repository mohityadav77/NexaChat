import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { connectDatabase } from './db.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';

const app = express();
app.use(cors({ origin: config.clientOrigin }));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (request, response) => response.json({ ok: true, persistence: request.app.locals.dbReady ? 'mongodb' : 'memory' }));
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/conversations', conversationRoutes);
app.use((error, request, response, next) => { console.error(error); response.status(500).json({ error: 'Unexpected server error.' }); });

const dbReady = await connectDatabase();
app.locals.dbReady = dbReady;
app.listen(config.port, () => console.log(`NexaChat API listening on http://localhost:${config.port}`));

export default app;
