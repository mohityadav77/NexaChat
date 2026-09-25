import test from 'node:test';
import assert from 'node:assert/strict';
import { createAssistantReply } from '../server/services/assistantService.js';

test('assistant service returns a closure explanation with a code sample', () => {
  const reply = createAssistantReply('Explain closures in JavaScript');
  assert.match(reply, /closure/i);
  assert.match(reply, /createCounter/);
});

test('assistant service keeps unknown prompts useful', () => {
  const reply = createAssistantReply('How should I plan a study session?');
  assert.match(reply, /study session/);
  assert.match(reply, /state/i);
});
