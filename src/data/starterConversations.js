export const starterConversations = [
  {
    id: 'frontend-system-design',
    title: 'Frontend system design',
    preview: 'The key is to make the state transitions...',
    timestamp: '2m ago',
    group: 'Recent',
    messages: [
      { id: 'system-1', role: 'user', content: 'How should I structure a frontend system design interview answer?', time: '10:42 AM' },
      { id: 'system-2', role: 'assistant', content: 'Start with the user journey, then map the UI into stateful and presentational pieces. The key is to make the state transitions explicit before discussing implementation details.', time: '10:42 AM', bookmarked: true },
    ],
  },
  {
    id: 'react-performance',
    title: 'React performance patterns',
    preview: 'useMemo is most useful when...',
    timestamp: 'Yesterday',
    group: 'Recent',
    messages: [
      { id: 'performance-1', role: 'user', content: 'When should I use useMemo in a React application?', time: 'Yesterday, 4:18 PM' },
      { id: 'performance-2', role: 'assistant', content: 'Use `useMemo` when a calculation is meaningfully expensive or when a stable derived value helps a memoized child avoid unnecessary work. For a small `filter()` over a short list, clarity usually wins over memoization.', time: 'Yesterday, 4:18 PM' },
    ],
  },
  {
    id: 'portfolio-review',
    title: 'Portfolio review notes',
    preview: 'The strongest projects lead with...',
    timestamp: 'Mon',
    group: 'Recent',
    messages: [
      { id: 'portfolio-1', role: 'user', content: 'What makes a frontend portfolio project memorable?', time: 'Monday, 11:06 AM' },
      { id: 'portfolio-2', role: 'assistant', content: 'The strongest projects lead with a clear user problem, show thoughtful interaction details, and explain the tradeoffs behind the implementation. A polished finish helps, but the reasoning is what makes the work credible.', time: 'Monday, 11:06 AM' },
    ],
  },
  {
    id: 'career-planning',
    title: 'Career planning',
    preview: 'A focused learning loop could look like...',
    timestamp: 'Sep 18',
    group: 'Earlier',
    messages: [
      { id: 'career-1', role: 'assistant', content: 'A focused learning loop could look like this: learn one concept, use it in a small product feature, then explain the tradeoffs in writing. That cycle turns knowledge into interview-ready confidence.', time: 'Sep 18, 2:30 PM' },
    ],
  },
];
