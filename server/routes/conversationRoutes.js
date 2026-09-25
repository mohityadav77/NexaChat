import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createConversation, deleteConversation, findConversation, listConversations, updateConversation } from '../store.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (request, response) => response.json({ conversations: await listConversations(request.app, request.user.id) }));

router.post('/', async (request, response) => {
  const conversation = await createConversation(request.app, request.user.id, { title: request.body.title || 'New conversation', preview: '', timestamp: 'Now', group: 'Recent', messages: [] });
  response.status(201).json({ conversation });
});

router.patch('/:id', async (request, response) => {
  const conversation = await findConversation(request.app, request.user.id, request.params.id);
  if (!conversation) return response.status(404).json({ error: 'Conversation not found.' });
  const allowed = ['title', 'preview', 'timestamp', 'group', 'messages'];
  const updates = Object.fromEntries(Object.entries(request.body).filter(([key]) => allowed.includes(key)));
  response.json({ conversation: await updateConversation(request.app, conversation, updates) });
});

router.delete('/:id', async (request, response) => {
  const conversation = await findConversation(request.app, request.user.id, request.params.id);
  if (!conversation) return response.status(404).json({ error: 'Conversation not found.' });
  await deleteConversation(request.app, conversation);
  response.status(204).end();
});

export default router;
