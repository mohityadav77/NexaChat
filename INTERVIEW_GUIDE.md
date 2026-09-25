# NexaChat Interview Guide

This guide is based on the actual implementation in this repository. The best interview answers should describe the user problem first, then the state transitions and tradeoffs.

## Project explanation

### 30-second explanation

NexaChat is a React and JavaScript AI conversation workspace. It supports multiple local conversations, search, message actions, markdown/code responses, theme preferences, and responsive navigation. I kept the frontend local-first with a mock AI service, then added an optional Express backend with JWT authentication and MongoDB persistence so the app still works when the backend is unavailable.

### 1-minute explanation

The app is composed from a sidebar, chat header, message list, message, empty state, composer, and authentication modal. `App.jsx` owns shared conversation state because those surfaces all need to read or update it. A custom `useLocalStorage` hook persists conversations, selected chat, preferences, and user info. `ThemeContext` owns light/dark mode. `aiService.js` keeps provider logic outside the UI and uses the mock provider unless an API URL is configured. The backend adds REST routes, bcrypt, JWT, and optional Mongoose persistence.

### 2-minute explanation

When a user sends a message, the controlled composer validates it, creates a user message, updates the selected conversation, and calls the service layer with `async/await`. The UI immediately renders the user message and a loading state. The service either calls `/api/chat` or waits for a deterministic mock response. Success appends an assistant message; failure renders a retryable error banner. Conversations are serialized to localStorage through an effect, so refreshes preserve the workspace. Message search is a derived `filter()` result, while actions update only the matching message with immutable array/object copies. The backend is intentionally optional: the same frontend can stay useful in offline mode.

### Detailed technical explanation

The application uses a unidirectional data flow. `App` owns conversation data and passes values plus event handlers into presentational components. `useMemo` derives the conversation search result, `useCallback` stabilizes the conversation updater, and `useRef` supports auto-scroll in `MessageList`. `ThemeProvider` exposes theme state through Context. The AI boundary is a Promise-returning service, which makes a real provider replaceable without changing the components. Express routes validate input, the auth middleware verifies JWTs, bcrypt hashes passwords, and `store.js` chooses MongoDB or in-memory persistence. This split lets React demonstrate most of the product behavior while the backend demonstrates the basic frontend-to-server relationship.

## React interview questions

### 1. Why does `App.jsx` own conversation state?

- Testing: State ownership and component architecture.
- Strong answer: The sidebar, header, message list, composer, and auth flow all need the same conversation data, so `App` is the smallest common owner. Children stay focused on rendering and dispatching events.
- Follow-up: Would you keep every piece of state there forever?
- Follow-up answer: No. If a concern became independent or widely shared, I would move it into a custom hook or Context. I used Context only for theme because that preference crosses the whole tree.

### 2. What does `useState` do in this project?

- Testing: Local component state and state transitions.
- Strong answer: It stores values that change over time, such as search text, composer text, loading, errors, and the auth modal. Calling a setter schedules a re-render with the new value.
- Follow-up: Why not mutate a conversation directly?
- Follow-up answer: React relies on new references to detect meaningful updates. I return new arrays and objects with spread syntax so the update is predictable.

### 3. Why is the composer a controlled input?

- Testing: Forms and controlled components.
- Strong answer: The textarea value comes from React state and `onChange` writes back to that state. That lets suggested prompts populate it, the send handler read a reliable value, and the UI disable Send for empty text.
- Follow-up: What is the alternative?
- Follow-up answer: An uncontrolled input could be read with a ref, but it would be less convenient for prompt selection and validation.

### 4. Why is `useEffect` used in `useLocalStorage`?

- Testing: Effects, dependency arrays, and browser APIs.
- Strong answer: Writing to localStorage is a side effect because it synchronizes React state with an external browser API. The effect runs after render whenever the storage key or value changes.
- Follow-up: What happens with an empty dependency array?
- Follow-up answer: It would run only after the first render, so later state changes would not persist. Omitting dependencies would run after every render, which is unnecessary here.

### 5. How does the localStorage hook handle corrupted data?

- Testing: Error handling and browser persistence.
- Strong answer: Initialization is wrapped in `try/catch`. If JSON parsing or storage access fails, the hook returns the provided initial value instead of crashing the application.
- Follow-up: What limitation remains?
- Follow-up answer: Storage can still be unavailable or quota-limited, so the write effect also catches errors and lets the app continue in memory.

### 6. Where is `useMemo` useful here?

- Testing: Derived state and performance judgment.
- Strong answer: It memoizes the filtered conversation list, which is derived from conversations and the search term. It prevents repeating the filter work when unrelated state such as the modal changes.
- Follow-up: Would you memoize every calculation?
- Follow-up answer: No. For a tiny calculation, memoization adds complexity. I use it because the result is derived data used on every render and the dependency boundary is clear.

### 7. Why use `useCallback` for `updateConversation`?

- Testing: Function identity and child props.
- Strong answer: The updater is passed into async handlers and message components. `useCallback` keeps its identity stable until the state setter changes, which makes the intent clear and avoids avoidable downstream changes.
- Follow-up: Does `useCallback` guarantee fewer renders?
- Follow-up answer: No. It only stabilizes a function reference. It is useful only when that reference matters to memoization or effect dependencies.

### 8. How is `useRef` used?

- Testing: Refs versus state.
- Strong answer: `MessageList` keeps a ref to a bottom marker and scrolls it into view when message count or loading changes. The ref stores a DOM reference without causing a render.
- Follow-up: Why not store the DOM node in state?
- Follow-up answer: DOM references are imperative details, not UI state. Putting them in state would cause unnecessary renders.

### 9. Why use Context for theme?

- Testing: Context API tradeoffs.
- Strong answer: Theme is a cross-cutting preference used by the root styling and theme button. Context avoids passing theme and toggle props through unrelated components.
- Follow-up: Why not use Context for every conversation update?
- Follow-up answer: Conversation updates are already coordinated in `App`, and Context would make dependencies less explicit. I use the smallest tool that solves the sharing problem.

### 10. What happens when a user sends a message?

- Testing: Event flow and async UI.
- Strong answer: The controlled input is trimmed, a user message is appended immutably, the input clears, loading starts, and `getAssistantReply` is awaited. Success adds the assistant message; failure stores an error and retry payload.
- Follow-up: How do you prevent rapid sends?
- Follow-up answer: The send handler exits while `isLoading` is true and the input/button are disabled.

### 11. How are keys chosen for message lists?

- Testing: React list reconciliation.
- Strong answer: Messages use their stable message id as the key, not the array index. That helps React preserve the right DOM state when messages are added or regenerated.
- Follow-up: Why is an index risky here?
- Follow-up answer: Deleting or replacing messages can shift indexes, causing React to associate the wrong item with an existing DOM node.

### 12. How does conditional rendering appear in the app?

- Testing: UI state modeling.
- Strong answer: The chat renders `EmptyChat` when there are no messages, `MessageList` otherwise, `LoadingMessage` while awaiting AI, an error banner after failures, and an auth modal only when requested.
- Follow-up: Why is this better than hiding everything with CSS?
- Follow-up answer: The DOM reflects the actual state, which is clearer for React, accessibility, and maintenance.

### 13. How do props flow through the message action?

- Testing: Parent-child communication.
- Strong answer: `App` owns the update function, `ChatWindow` passes it to `MessageList`, and `Message` calls it with an id and action name. The child emits intent; the parent changes the source of truth.
- Follow-up: What prevents a child from changing unrelated state?
- Follow-up answer: The child only receives the narrow callback it needs, rather than the entire state setter.

### 14. What makes `MessageInput` reusable?

- Testing: Component design.
- Strong answer: It does not know how conversations or AI work. It receives value, change, submit, and disabled props, so it can be reused with another message provider.
- Follow-up: Should every small element be a component?
- Follow-up answer: No. I extracted pieces with a distinct responsibility or useful state boundary, not arbitrary wrappers.

### 15. How does the custom hook differ from a component?

- Testing: Hook fundamentals.
- Strong answer: `useLocalStorage` contains reusable stateful logic but returns no markup. A component returns UI; a hook lets multiple components or features share behavior.
- Follow-up: What rules must hooks follow?
- Follow-up answer: Call hooks only at the top level of a component or custom hook, not inside conditions or loops.

### 16. What does StrictMode do here?

- Testing: Development behavior.
- Strong answer: `main.jsx` renders the app inside StrictMode. In development React may intentionally re-run certain lifecycle paths to expose unsafe side effects. It does not affect the production build behavior.
- Follow-up: Why is that useful with localStorage?
- Follow-up answer: It helps reveal effects that are not idempotent. The storage write is safe because writing the same serialized value is harmless.

### 17. How is message search implemented?

- Testing: Derived state and filtering.
- Strong answer: The active message array is filtered by a normalized search term. `Message` receives the term and highlights matching text without changing the stored message content.
- Follow-up: What happens when there are no matches?
- Follow-up answer: The UI renders a clear empty result instead of a blank area.

### 18. How is theme persistence implemented?

- Testing: Context plus browser storage.
- Strong answer: `ThemeProvider` uses `useLocalStorage('nexachat-theme', 'light')`, exposes the theme and toggle, and puts the value on a `data-theme` attribute. CSS variables change based on that attribute.
- Follow-up: Why CSS variables?
- Follow-up answer: They keep the color system centralized and let one attribute switch many styles without duplicating component logic.

### 19. How does the app handle an API failure?

- Testing: Async error states.
- Strong answer: The service catches HTTP failures and can fall back to the mock provider. If fallback is disabled or the mock command `/error` is used, the app stores a user-friendly error and renders a retry action.
- Follow-up: Why not leave the user with a console error?
- Follow-up answer: A product UI must make recovery visible and preserve the user’s message so retry is possible.

### 20. How is regeneration different from sending?

- Testing: State modeling.
- Strong answer: Regeneration finds the selected assistant message, takes the preceding conversation messages, and replaces the old assistant response with a fresh result. It does not add a second user message.
- Follow-up: What if there is no preceding user message?
- Follow-up answer: The handler exits without making a request.

### 21. How do message actions persist?

- Testing: Immutable nested updates.
- Strong answer: The app maps over conversations, finds the active conversation, then maps over messages and changes only the matching message’s feedback flag. The localStorage hook persists the resulting object tree.
- Follow-up: What is a possible improvement for a huge message list?
- Follow-up answer: Virtualization or server-side pagination could reduce DOM work, but this project does not need that complexity for normal chat sizes.

### 22. How does mobile navigation work?

- Testing: Responsive UX.
- Strong answer: At the mobile breakpoint the sidebar becomes a fixed drawer translated off-screen. Opening it adds a backdrop, and selecting or closing a conversation hides it.
- Follow-up: Why is a drawer better than shrinking the sidebar?
- Follow-up answer: It preserves chat width and keeps navigation available without competing with the composer.

### 23. How are accessibility requirements handled?

- Testing: Practical accessibility.
- Strong answer: Interactive elements are real buttons and inputs, icon-only controls have aria labels, the dialog uses dialog semantics, focus-visible styles are present, and the message list uses an aria-live region.
- Follow-up: What would you test with a screen reader?
- Follow-up answer: I would verify that navigation labels, current conversation state, error messages, and send control state are announced meaningfully.

### 24. How does the app avoid unnecessary global state?

- Testing: State scope.
- Strong answer: Search text and composer text remain local to `App`, message feedback remains in conversation state, and only theme uses Context. The project avoids a global store because the component tree is small enough to keep updates explicit.
- Follow-up: When would Redux become reasonable?
- Follow-up answer: If many distant features needed complex normalized state, time travel, middleware, or independent domain slices.

### 25. How would you add real streaming responses?

- Testing: Extensibility.
- Strong answer: I would change the service contract to expose an async iterator or streaming callback, add an assistant placeholder message, and update its content incrementally while preserving the same loading/error state boundary.
- Follow-up: What stays unchanged?
- Follow-up answer: The message components and most of the state model could stay the same because they already render message content.

### 26. What is the empty chat state’s role?

- Testing: Product thinking.
- Strong answer: It gives the user a clear first action, communicates what Nexa does, and uses suggested prompts to reduce the blank-page problem. It is a real product state, not just a missing list.
- Follow-up: How do prompt cards demonstrate React?
- Follow-up answer: Each card is a mapped list item with an event handler that updates the controlled composer state.

### 27. Why is the AI provider abstracted?

- Testing: Separation of concerns.
- Strong answer: Components should care about a request and a result, not whether the result came from a mock, Express, or a future AI provider. The service boundary makes changing providers a localized change.
- Follow-up: Where should the real API key live?
- Follow-up answer: On the backend environment, never in the browser bundle or a `VITE_` variable.

### 28. How would you optimize a very large conversation list?

- Testing: Performance reasoning.
- Strong answer: Keep filtering memoized, split conversation state from message state if updates become noisy, and consider list virtualization or pagination. I would measure before adding those abstractions.
- Follow-up: Why not optimize now?
- Follow-up answer: Premature optimization adds cognitive cost; the current list is small and the code is clearer.

### 29. What is the most important edge case in deletion?

- Testing: State consistency.
- Strong answer: Deleting the active or final conversation must leave the app with a valid selected id. The handler selects the next conversation or creates a replacement empty conversation.
- Follow-up: What other state should be reset?
- Follow-up answer: Errors and composer text should be cleared when selecting or creating a chat, so stale UI does not leak across conversations.

### 30. What would you improve next in the React layer?

- Testing: Reflection.
- Strong answer: I would extract a `useChat` hook to separate orchestration from the top-level layout, add focused component tests for send/retry, and introduce a richer markdown parser only if product requirements justify it.
- Follow-up: Why not extract everything immediately?
- Follow-up answer: A hook should represent a cohesive behavior. Extracting every setter too early would hide the state flow that is useful for learning and review.

## JavaScript interview questions

### 1. Why use async/await in `handleSendMessage`?

- Testing: Promise control flow.
- Strong answer: It makes the sequential flow readable: update the user message, await the assistant service, then handle success or failure with `try/catch`.
- Follow-up: Is async/await different from Promises?
- Follow-up answer: No. It is syntax built on Promises; the function still returns a Promise.

### 2. What does `fetch` return?

- Testing: Web APIs and Promises.
- Strong answer: `fetch` returns a Promise for a Response. It does not reject for HTTP 4xx/5xx by itself, so `apiClient` checks `response.ok` before parsing the JSON.
- Follow-up: What does `response.json()` return?
- Follow-up answer: Another Promise that resolves to the parsed JavaScript value.

### 3. How does the mock service simulate async work?

- Testing: Promise creation.
- Strong answer: `sleep` returns a Promise resolved by `setTimeout`, so the UI experiences a realistic loading state without hardcoding responses inside components.
- Follow-up: Why is that useful?
- Follow-up answer: It exercises the same loading/error flow as a real provider.

### 4. What is a closure in this project’s mock response?

- Testing: Core JavaScript.
- Strong answer: In the counter example, the returned function remembers `count` from `createCounter` even after that outer function has finished.
- Follow-up: Where might closures appear in the app code?
- Follow-up answer: Event handlers close over ids, current props, and state setters.

### 5. How is `map()` used?

- Testing: Array transformations.
- Strong answer: It renders conversations and messages, and it immutably updates only the matching conversation or message.
- Follow-up: Does map mutate the original array?
- Follow-up answer: No. It returns a new array, although objects inside must also be copied when changing them.

### 6. How is `filter()` used?

- Testing: Collection querying.
- Strong answer: It filters conversations by title, preview, and message text, and filters messages by the active message search term.
- Follow-up: What does filter return when nothing matches?
- Follow-up answer: An empty array, which the UI renders as a no-results state.

### 7. Where could `find()` be seen?

- Testing: Array lookup.
- Strong answer: The active conversation is found by id, and the backend finds a user or conversation by its owner and id.
- Follow-up: When would you use `findIndex()`?
- Follow-up answer: Regeneration uses the message index to take the messages before an assistant response.

### 8. Why use object spread?

- Testing: Immutable updates.
- Strong answer: `{ ...conversation, title: nextTitle }` keeps existing fields while creating a new object with one changed field.
- Follow-up: Does spread deep clone an object?
- Follow-up answer: No. It is shallow, so nested arrays need their own mapped copies when changed.

### 9. How is destructuring used?

- Testing: Readable data access.
- Strong answer: Component props and array callbacks destructure values such as `{ title, preview, messages }`, making the code concise and explicit.
- Follow-up: What risk does destructuring not solve?
- Follow-up answer: It does not validate data. Optional chaining or input validation is still needed for uncertain values.

### 10. Why normalize search terms?

- Testing: String methods.
- Strong answer: `trim().toLowerCase()` makes search forgiving of leading spaces and casing, so `React`, `react`, and ` React ` behave consistently.
- Follow-up: What about accented text?
- Follow-up answer: A production search could normalize Unicode or use a search index, but that is beyond this small local list.

### 11. What is optional chaining used for?

- Testing: Safe property access.
- Strong answer: The UI reads values such as `user?.name` and `conversation?.messages` without throwing when optional data is absent.
- Follow-up: How does it differ from `&&`?
- Follow-up answer: It directly returns undefined for a missing link and works cleanly with function calls and nested properties.

### 12. What does nullish coalescing solve?

- Testing: Defaults.
- Strong answer: A value like `user?.name ?? 'Arjun Rao'` uses the fallback only for null or undefined, not for valid falsy values such as an empty string.
- Follow-up: Why not always use `||`?
- Follow-up answer: `||` treats all falsy values as absent, which can hide legitimate values like zero.

### 13. What is JSON.stringify used for?

- Testing: Browser persistence.
- Strong answer: localStorage stores strings, so the hook serializes arrays and objects before writing them.
- Follow-up: What is the inverse?
- Follow-up answer: JSON.parse converts the stored string back into JavaScript data.

### 14. What error does JSON.parse throw?

- Testing: Defensive coding.
- Strong answer: It can throw a SyntaxError for malformed JSON. The hook catches it and uses the initial value so corrupted storage does not crash the app.
- Follow-up: Should corrupted storage be deleted?
- Follow-up answer: It can be cleared in a recovery flow, but preserving local data until the user chooses is safer.

### 15. How do modules help this project?

- Testing: ES modules.
- Strong answer: Each service, hook, component, and backend route exports a focused API. Imports make dependencies explicit and prevent one large file from owning everything.
- Follow-up: What does `export default` communicate?
- Follow-up answer: It identifies the primary exported value of a module; named exports are better when a module exposes several related functions.

### 16. Why use `try/catch` around awaits?

- Testing: Async error handling.
- Strong answer: A rejected Promise inside the async function is caught so the UI can store a friendly message and a retry payload.
- Follow-up: What happens if the error is not caught?
- Follow-up answer: It becomes an unhandled rejection or escapes to the caller, leaving the product without a controlled recovery state.

### 17. How does the event loop relate to sending?

- Testing: Async JavaScript.
- Strong answer: The synchronous handler appends the user message, then the awaited service yields control while the browser can render loading. The Promise continuation runs later on the microtask queue.
- Follow-up: Does `await` block the browser thread?
- Follow-up answer: No. It pauses that async function, not the event loop.

### 18. Why are callbacks used in `setState`?

- Testing: Functional state updates.
- Strong answer: `setConversations(current => ...)` receives the latest state, which is safer when multiple updates are queued or asynchronous work completes later.
- Follow-up: Why not close over the current conversations variable?
- Follow-up answer: A closure can hold a stale render value. Functional updates avoid that race.

### 19. How does debounce differ from the current search?

- Testing: Event performance.
- Strong answer: The current local filter runs on each keystroke and is fine for a short list. Debouncing would wait for a pause before filtering and becomes useful for expensive or server-backed search.
- Follow-up: Where would debounce live?
- Follow-up answer: In a custom hook or service boundary, with cleanup to cancel the pending timer.

### 20. What is a Promise rejection in the AI service?

- Testing: Failure paths.
- Strong answer: A missing user message or `/error` command throws, and an HTTP failure is converted to a thrown Error. The caller catches it and renders the retry UI.
- Follow-up: Why throw an Error object?
- Follow-up answer: It carries a message and follows the standard async error flow.

### 21. How do template literals help?

- Testing: String construction.
- Strong answer: They build API URLs and mock response strings with embedded values such as the user prompt without awkward concatenation.
- Follow-up: What security concern remains?
- Follow-up answer: Never interpolate untrusted text into HTML. The React UI renders it as text and code blocks, not raw HTML.

### 22. How does `Object.fromEntries` work in the backend?

- Testing: Object transformation.
- Strong answer: The PATCH route filters request body entries to an allowlist and turns the remaining key/value pairs back into a safe update object.
- Follow-up: Why use an allowlist?
- Follow-up answer: It prevents clients from updating ownership or internal fields accidentally.

### 23. What is the purpose of `slice()` in regeneration?

- Testing: Non-mutating array operations.
- Strong answer: It creates a portion of the message history before the selected assistant response. The original conversation array is not changed by slicing.
- Follow-up: How is the response replacement applied?
- Follow-up answer: A new array is created from the preceding messages plus the new assistant message.

### 24. How does `Date.now()` help here?

- Testing: Simple client ids.
- Strong answer: It creates practical local ids for demo conversations and messages. In production, server/database ids would be authoritative.
- Follow-up: Why can it collide?
- Follow-up answer: Multiple calls in the same millisecond could collide, so a production implementation would use crypto.randomUUID or server ids.

### 25. Why is the backend response validated with `response.ok`?

- Testing: Fetch behavior.
- Strong answer: Fetch only rejects network-level failures. `response.ok` turns HTTP error statuses into the same controlled error path.
- Follow-up: What if JSON parsing fails?
- Follow-up answer: `apiClient` catches parsing failure and falls back to an empty object before creating a useful error.

### 26. How is immutability important for nested arrays?

- Testing: React data updates.
- Strong answer: Updating a nested message requires a new conversation object and a new messages array. That makes the changed references visible to React and preserves prior state snapshots.
- Follow-up: What if you only changed `message.bookmarked`?
- Follow-up answer: React could miss the update or other references could observe an unexpected mutation.

### 27. What is a module boundary in this code?

- Testing: Organization.
- Strong answer: `aiService` exports a provider contract, `apiClient` exports auth requests, and components import only what they need. Boundaries make replacement and testing easier.
- Follow-up: What is the cost?
- Follow-up answer: Too many tiny modules can make navigation harder, so each file should have a cohesive responsibility.

### 28. How does the app use browser APIs?

- Testing: Practical JavaScript.
- Strong answer: It uses localStorage for persistence, navigator.clipboard for copy actions, window.prompt for simple rename input, and scrollIntoView through a ref.
- Follow-up: Why catch clipboard failures?
- Follow-up answer: Clipboard access can be denied or unavailable; copy is a convenience and should not break the chat.

### 29. What is the purpose of `finally` in the send flow?

- Testing: Cleanup.
- Strong answer: `finally` sets loading false whether the request succeeds or fails, ensuring the input and Send button do not remain stuck.
- Follow-up: What else could be cleaned there?
- Follow-up answer: Timers, abort controllers, or temporary optimistic state could be cleaned there in a more advanced version.

### 30. What JavaScript feature would you add for cancellation?

- Testing: Async robustness.
- Strong answer: I would use `AbortController`, pass its signal to fetch, and abort on a new request or component cleanup. The mock provider would need a matching cancellation contract.
- Follow-up: Why is cancellation valuable?
- Follow-up answer: It prevents stale responses from updating state after the user changes conversations or starts another request.

## HTML and CSS interview questions

### 1. Why use semantic `main`, `aside`, `header`, `section`, and `article`?

- Testing: Semantic HTML.
- Strong answer: They describe the structure of a conversation workspace and improve navigation for assistive technology compared with generic divs.
- Follow-up: Do semantic elements replace ARIA?
- Follow-up answer: No. Native semantics come first; ARIA fills gaps such as labels, live regions, and dialog state.

### 2. Why are actions real buttons?

- Testing: Keyboard accessibility.
- Strong answer: Buttons are focusable, operable with Enter/Space, and expose an action role automatically. Clickable divs would require recreating that behavior.
- Follow-up: What should an icon-only button include?
- Follow-up answer: An `aria-label` that explains the action.

### 3. How is the composer a form?

- Testing: HTML forms.
- Strong answer: The textarea and Send button live inside a form, so submit behavior works consistently with button clicks and keyboard input.
- Follow-up: Why prevent the browser’s default submit?
- Follow-up answer: This is a single-page interaction; React handles the state transition instead of navigating or reloading.

### 4. How do CSS variables support themes?

- Testing: CSS architecture.
- Strong answer: Shared tokens such as `--surface`, `--ink`, and `--accent` live on the theme root. The `data-theme` attribute changes their values for all descendants.
- Follow-up: Why not duplicate every dark selector?
- Follow-up answer: Variables keep theme differences centralized and reduce repeated selectors.

### 5. Where is Flexbox used?

- Testing: Layout.
- Strong answer: The app shell, headers, composer toolbar, message metadata, and sidebar footer use Flexbox for one-dimensional alignment.
- Follow-up: When would Grid be better?
- Follow-up answer: Prompt cards and conversation rows use Grid where columns need explicit relationships.

### 6. How is CSS Grid used in prompt cards?

- Testing: Grid.
- Strong answer: The prompt area uses two equal columns on larger screens and changes to one column on small screens.
- Follow-up: What makes the mobile transition responsive?
- Follow-up answer: A media query changes the grid template rather than merely shrinking the desktop cards.

### 7. Why does the sidebar use a fixed mobile drawer?

- Testing: Responsive interaction.
- Strong answer: A fixed drawer can overlay the chat and stay full height while the chat remains usable. Transforming it off-screen gives a simple open/close animation.
- Follow-up: Why add a backdrop?
- Follow-up answer: It communicates modal navigation and gives the user an obvious close target.

### 8. How is overflow handled in the chat?

- Testing: Scrolling.
- Strong answer: The shell uses a constrained viewport, the chat content owns vertical overflow, and the message list owns horizontal overflow only for code blocks.
- Follow-up: What breaks if every ancestor scrolls?
- Follow-up answer: The composer can move unexpectedly and auto-scroll becomes less predictable.

### 9. Why use `min-width: 0` in flex children?

- Testing: Flex overflow details.
- Strong answer: It allows long titles and message content to shrink instead of forcing the flex container wider than the viewport.
- Follow-up: Where is truncation applied?
- Follow-up answer: Conversation titles and previews use overflow hidden with ellipsis.

### 10. What do hover and focus states contribute?

- Testing: Interaction design.
- Strong answer: Hover states communicate clickable surfaces, while focus-visible styles preserve keyboard orientation without showing noisy outlines on every mouse click.
- Follow-up: Why not remove outlines?
- Follow-up answer: Removing them makes keyboard navigation difficult and is an accessibility regression.

### 11. How does the code block avoid breaking the layout?

- Testing: Overflow and typography.
- Strong answer: The code wrapper is overflow-hidden, the pre element scrolls horizontally, and a monospace font preserves code alignment.
- Follow-up: Why not wrap long code lines?
- Follow-up answer: Wrapping can make code harder to read and copy accurately; horizontal scroll is a better default for code.

### 12. How does CSS layering work for the drawer?

- Testing: Positioning and z-index.
- Strong answer: The sidebar has a higher z-index than the backdrop, and the backdrop sits above the chat. The fixed positions create a viewport-level overlay.
- Follow-up: What is a common z-index bug?
- Follow-up answer: Creating stacking contexts with transforms or opacity can make an apparently higher z-index render underneath another context.

### 13. Why use a media query breakpoint?

- Testing: Responsive CSS.
- Strong answer: At 820px the navigation changes from a desktop column to a drawer; at 560px typography, spacing, and prompt layout tighten further.
- Follow-up: Are these device names?
- Follow-up answer: No. They are content-driven breakpoints chosen where the layout stops having enough room.

### 14. How is a modal centered?

- Testing: CSS layout.
- Strong answer: The backdrop is fixed to the viewport and uses Grid `place-items: center`, while the modal has a max width and responsive padding.
- Follow-up: What happens on a short screen?
- Follow-up answer: The backdrop can scroll if needed in a production refinement; the modal’s max width prevents horizontal overflow.

### 15. Why use `clamp()` for the empty heading?

- Testing: Fluid typography.
- Strong answer: `clamp()` lets the heading scale between a readable minimum and maximum based on viewport width, reducing abrupt breakpoint jumps.
- Follow-up: What still happens on mobile?
- Follow-up answer: The mobile media query sets a tighter explicit size and letter spacing for the narrow composition.

### 16. How does `color-mix()` affect browser support?

- Testing: Modern CSS tradeoffs.
- Strong answer: It makes token-based tints concise, but a production app could add fallback colors or use precomputed tokens if supporting older browsers is required.
- Follow-up: Why use it here?
- Follow-up answer: It keeps the theme styling expressive without a design-system dependency.

### 17. How does the layout keep the composer usable?

- Testing: Product-focused CSS.
- Strong answer: The composer is outside the scrollable message content and stays at the bottom of the flex column. The textarea has a max height and the send button remains accessible.
- Follow-up: What would you do for an on-screen mobile keyboard?
- Follow-up answer: I would test safe-area padding and viewport resize behavior on real devices.

### 18. What does `white-space: nowrap` do in conversation metadata?

- Testing: Text layout.
- Strong answer: It keeps timestamps and labels from wrapping into awkward extra rows. Long titles are handled separately with ellipsis.
- Follow-up: When can nowrap be harmful?
- Follow-up answer: On narrow screens it can cause overflow if no truncation or alternate layout is provided.

### 19. How do color choices support hierarchy?

- Testing: UI/UX judgment.
- Strong answer: The ink color is reserved for primary content, muted tokens support metadata, the purple accent marks actions and selected state, and mint communicates online/safe status.
- Follow-up: How should dark mode be checked?
- Follow-up answer: Contrast and semantic meaning need to be verified again; dark mode is not just inverted hex values.

### 20. What would you test visually before shipping?

- Testing: QA mindset.
- Strong answer: I would test long titles, long code, empty and error states, drawer overflow, keyboard focus, dark mode, and the composer with a mobile keyboard. The checklist records these cases for repeatability.
- Follow-up: Would you add a visual regression tool immediately?
- Follow-up answer: For a portfolio project, manual review plus a small automated logic suite is enough initially; a team product could add screenshot regression later.

## Backend interview questions

### 1. Why use Express?

- Testing: Node server fundamentals.
- Strong answer: Express provides routing, middleware, JSON parsing, and a small REST API surface without moving frontend state logic into the backend.
- Follow-up: What does middleware do?
- Follow-up answer: It runs between the request and route handler, for concerns such as CORS, parsing, logging, or authentication.

### 2. What does `express.json()` do?

- Testing: HTTP request parsing.
- Strong answer: It parses JSON request bodies and places the result on `request.body`, with a 1MB limit in this project.
- Follow-up: Why set a limit?
- Follow-up answer: It avoids accepting unexpectedly large payloads and is a basic resource-protection measure.

### 3. Why is CORS configured?

- Testing: Browser/server relationship.
- Strong answer: The Vite frontend and Express backend use different origins during development, so CORS explicitly allows the configured client origin.
- Follow-up: Should production allow `*`?
- Follow-up answer: No. It should allow the actual frontend origin and use appropriate credentials policy.

### 4. What is the purpose of `/api/health`?

- Testing: Operations basics.
- Strong answer: It gives the frontend or deployment platform a cheap liveness signal and reports whether the server is using MongoDB or memory persistence.
- Follow-up: Is liveness the same as readiness?
- Follow-up answer: No. Readiness could additionally require a working database connection.

### 5. Why hash passwords with bcrypt?

- Testing: Authentication basics.
- Strong answer: Passwords should not be stored in plain text. Bcrypt uses a slow salted hash so a database leak does not directly expose passwords.
- Follow-up: Can hashes be decrypted?
- Follow-up answer: No. Login verifies a candidate password against the hash.

### 6. What does JWT authentication do here?

- Testing: Stateless auth.
- Strong answer: Login signs a token containing the user id and email. Protected routes verify the token in middleware and use the decoded id to scope data.
- Follow-up: What is a risk of a simple JWT setup?
- Follow-up answer: Token revocation and secure storage need more production design; this project stores the demo token locally and uses an expiry.

### 7. Which HTTP methods are used?

- Testing: REST conventions.
- Strong answer: GET reads health/conversations, POST creates users/conversations or generates chat, PATCH updates a conversation, and DELETE removes one.
- Follow-up: Why use PATCH for rename?
- Follow-up answer: Rename changes only part of an existing resource, so PATCH communicates a partial update.

### 8. What status codes does auth use?

- Testing: API correctness.
- Strong answer: Register returns 201, login returns 200, invalid credentials return 401, duplicate email returns 409, and invalid input returns 400.
- Follow-up: Why not return 500 for bad credentials?
- Follow-up answer: 500 means a server failure; invalid credentials are a client/authentication result.

### 9. How does the MongoDB fallback work?

- Testing: Persistence design.
- Strong answer: Startup tries `MONGODB_URI`. If it is absent or the connection fails, `app.locals.dbReady` is false and the store uses in-memory arrays.
- Follow-up: What is lost in memory mode?
- Follow-up answer: Data disappears when the server restarts, which is acceptable for local development but not production.

### 10. Why are messages embedded in Conversation?

- Testing: Mongo modeling.
- Strong answer: This app normally loads a conversation and its messages together, and the project is beginner-friendly. Embedding avoids an extra message collection and join-like query.
- Follow-up: When would you separate messages?
- Follow-up answer: Very large conversations, independent message querying, or high-volume writes would justify a separate collection.

### 11. How are conversation owners enforced?

- Testing: Authorization.
- Strong answer: Protected routes get the user id from the verified JWT and query by both conversation id and that user id. The client cannot choose another owner in the allowed patch fields.
- Follow-up: Why use an allowlist for updates?
- Follow-up answer: It prevents clients from changing `userId`, timestamps used for ownership logic, or other internal fields.

### 12. Where should a real AI provider key live?

- Testing: Secrets.
- Strong answer: Only on the server in environment variables. The browser would expose any Vite `VITE_` value to users.
- Follow-up: What would the server service do?
- Follow-up answer: It would call the provider, validate the response, normalize errors, and return a safe assistant message to React.

### 13. Why is the chat route separate from auth routes?

- Testing: Route organization.
- Strong answer: Each route module represents a domain responsibility. That keeps authentication, AI generation, and persistence easier to read and test.
- Follow-up: Could chat require auth?
- Follow-up answer: Yes, for a production account-based experience. This demo keeps it available so local-first use remains simple.

### 14. How would you improve production auth?

- Testing: Practical security.
- Strong answer: Use secure HTTP-only cookies or a carefully designed token strategy, rate-limit login, validate email/password input, rotate secrets, add refresh-token controls, and avoid verbose auth errors.
- Follow-up: Would bcrypt stay?
- Follow-up answer: Yes, or a similarly appropriate password hashing algorithm such as Argon2.

### 15. How would you test the Express API?

- Testing: Backend verification.
- Strong answer: Use request-level tests for health, auth success/failure, authorization, CRUD, and chat validation. Use an isolated test database or memory adapter so tests do not change real data.
- Follow-up: What is already automated?
- Follow-up answer: The repository includes provider logic tests and build verification; the manual checklist documents the API cases for the next testing increment.

## Why did you use this?

### Why React?

React fits the interactive stateful UI: the sidebar, messages, composer, loading state, and modal can be composed from focused components while state changes re-render only the UI that depends on them.

### Why JavaScript?

JavaScript is the project’s strongest learning target and is enough to demonstrate async functions, arrays, modules, browser APIs, and frontend architecture without adding TypeScript complexity prematurely.

### Why component architecture?

The sidebar, message, composer, and auth dialog each have different responsibilities and interaction details. Separating them improves readability and makes props/state boundaries discussable in an interview.

### Why localStorage?

It makes the app useful before a backend exists and demonstrates JSON serialization, browser APIs, lazy state initialization, and effect-based synchronization.

### Why Context API?

Theme is a small cross-cutting preference. Context avoids passing it through every layer without introducing a larger state library.

### Why not Redux?

The state graph is still small and can be understood with App state, a custom hook, and one Context. Redux would add ceremony without solving a real problem yet.

### Why create a service layer?

AI/provider logic changes independently of UI. The service makes mock, backend, or future provider implementations interchangeable and keeps components readable.

### Why async/await?

The send flow is sequential and includes one success path and one failure path. Async/await makes that Promise flow easy to follow while still using standard JavaScript Promises underneath.

### Why Express?

Express introduces routing and middleware with minimal framework overhead, which is appropriate for learning how React talks to a backend.

### Why MongoDB?

Conversation documents and embedded message arrays map naturally to a document database. MongoDB also lets the project introduce schemas and persistence without a relational modeling detour.

### Why keep AI keys on the backend?

Browser code is visible to users. A server can keep provider credentials in environment variables, apply auth/rate limits, and normalize provider errors before returning a response.

### Why responsive design?

Chat is a frequent mobile use case. A drawer on mobile preserves usable message width and keeps the composer accessible instead of merely shrinking the desktop sidebar.
