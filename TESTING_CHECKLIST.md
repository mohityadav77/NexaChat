# NexaChat Testing Checklist

## Automated

- [x] `npm run build`
- [x] `npm test`
- [x] Assistant service returns a closure explanation with code
- [x] Assistant service returns a useful fallback for unknown prompts

## Manual frontend checks

- [ ] Load the app with no localStorage data
- [ ] Refresh and confirm conversations remain
- [ ] Create and select a conversation
- [ ] Rename and delete a conversation
- [ ] Delete the final conversation and confirm a replacement is created
- [ ] Search conversations with `React`
- [ ] Search with no results
- [ ] Send a normal message
- [ ] Press Enter to send
- [ ] Press Shift + Enter to add a new line
- [ ] Rapidly click Send while AI is thinking
- [ ] Confirm the loading animation and `AI is thinking...`
- [ ] Send `/error` and confirm the retry banner
- [ ] Retry the failed request
- [ ] Regenerate the latest assistant answer
- [ ] Copy a response and copy a fenced code block
- [ ] Like, dislike, and bookmark a response
- [ ] Search within the current conversation
- [ ] Search for a term with no matching messages
- [ ] Choose each suggested prompt
- [ ] Toggle light/dark mode and refresh
- [ ] Open the account dialog
- [ ] Try login/register with the backend stopped and confirm local mode survives

## Manual backend checks

- [ ] Run `npm run dev:server`
- [ ] Open `GET /api/health`
- [ ] Register a user
- [ ] Confirm passwords are stored as hashes
- [ ] Log in with the created user
- [ ] Try an incorrect password
- [ ] Load conversations with a bearer token
- [ ] Create, update, and delete a conversation
- [ ] Call `/api/chat`
- [ ] Start without `MONGODB_URI` and confirm memory fallback
- [ ] Start with a valid MongoDB URI and confirm MongoDB persistence
- [ ] Try an invalid JWT

## Responsive and accessibility checks

- [ ] Desktop layout at 1280px+
- [ ] Tablet layout around 820px
- [ ] Mobile layout around 390px
- [ ] Open/close the mobile sidebar drawer
- [ ] Tab through buttons and inputs
- [ ] Confirm visible focus states
- [ ] Confirm icon-only buttons have accessible labels
- [ ] Confirm dialog has a label and close button
- [ ] Confirm text remains readable in dark mode
