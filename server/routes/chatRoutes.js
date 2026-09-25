import { Router } from 'express';
import { createAssistantReply } from '../services/assistantService.js';

const router = Router();
router.post('/', async (request, response) => {
  const latestUserMessage = [...(request.body.messages || [])].reverse().find(({ role }) => role === 'user');
  if (!latestUserMessage?.content?.trim()) return response.status(400).json({ error: 'A user message is required.' });
  await new Promise((resolve) => setTimeout(resolve, 450));
  response.json({ message: createAssistantReply(latestUserMessage.content.trim()) });
});

export default router;
