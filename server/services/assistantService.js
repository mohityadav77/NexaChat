export function createAssistantReply(prompt) {
  const normalizedPrompt = prompt.toLowerCase();
  if (normalizedPrompt.includes('closure')) return 'A closure is a function bundled with references to the variables around it.\n\n```js\nfunction createCounter() {\n  let count = 0;\n  return () => ++count;\n}\n```\n\nThe returned function closes over `count`, so each call can update the same private value.';
  if (normalizedPrompt.includes('react')) return 'A useful React debugging loop is: reproduce the issue, identify which state or prop changed, then verify the component boundary where the incorrect value enters. Start with the smallest observable change before reaching for memoization.';
  if (normalizedPrompt.includes('interview')) return 'For a frontend interview, explain the product from the user’s point of view first. Then walk through component boundaries, state ownership, async request states, persistence, accessibility, and the tradeoffs you made.';
  return `A practical way to think about “${prompt}” is to break it into the user outcome, the state that represents it, and the events that move the UI between states.`;
}
