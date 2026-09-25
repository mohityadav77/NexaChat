const apiBaseUrl = import.meta.env.VITE_API_URL || '';

const sleep = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

const createMockReply = (prompt) => {
  const normalizedPrompt = prompt.toLowerCase();

  if (normalizedPrompt.includes('closure')) {
    return 'A closure is a function bundled with references to the variables around it. That lets the function remember values after its outer function has finished.\n\n```js\nfunction createCounter() {\n  let count = 0;\n  return () => ++count;\n}\n```\n\nHere, the returned function closes over `count`, so each call can update the same private value.';
  }

  if (normalizedPrompt.includes('react') || normalizedPrompt.includes('component')) {
    return 'A useful React debugging loop is: reproduce the issue, identify which state or prop changed, then verify the component boundary where the incorrect value enters. Start with the smallest observable change before reaching for memoization.';
  }

  if (normalizedPrompt.includes('interview')) {
    return 'For a frontend interview, explain the product from the user’s point of view first. Then walk through component boundaries, state ownership, async request states, persistence, accessibility, and the tradeoffs you made. Interviewers learn more from your reasoning than from a long list of technologies.';
  }

  return `Here is a practical way to think about “${prompt}”: break the problem into a small user outcome, the state required to represent it, and the events that move the UI between states. Then validate the edge cases before adding abstraction.`;
};

export async function getAssistantReply({ messages, conversationId }) {
  const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user');

  if (!latestUserMessage) throw new Error('A user message is required.');
  if (latestUserMessage.content.trim().toLowerCase() === '/error') throw new Error('The mock provider was asked to simulate a failure.');

  if (apiBaseUrl) {
    try {
      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, conversationId }),
      });

      if (!response.ok) throw new Error('The AI service returned an error.');
      const data = await response.json();
      return data.message;
    } catch (error) {
      if (import.meta.env.VITE_ALLOW_MOCK_FALLBACK !== 'true') throw error;
    }
  }

  await sleep(650);
  return createMockReply(latestUserMessage.content.trim());
}
