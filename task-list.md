# Task List - Milestone 1: Set up webapp project and multi-LLM support

## Task 1.1: Initialize Next.js + React + TypeScript + TailwindCSS Project
**What**: Set up the foundational project structure with all development dependencies

**How**:
- Use `create-next-app` to bootstrap a Next.js project with TypeScript
- Install TailwindCSS v4 and configure it
- Verify TypeScript strict mode is enabled in `tsconfig.json`
- Set up basic project folder structure: `/app`, `/components`, `/lib`, `/utils`
- Install dev dependencies: `eslint`, `prettier`

**Verify**:
- `npm install` completes without errors
- `npm run dev` starts dev server successfully
- No TypeScript compilation errors
- Tailwind styles work (test with a simple styled component)

---

## Task 1.2: Install and Configure shadcn/ui
**What**: Set up the shadcn/ui component library for consistent UI components

**How**:
- Install shadcn/ui CLI: `npm install -g shadcn-ui`
- Run `npx shadcn-ui@latest init` to configure shadcn
- Choose default theme (light mode for now)
- Add initial components: `Button`, `Input`, `Card`
- Verify components are available in `/components/ui`

**Verify**:
- shadcn components render without errors
- Components are styled correctly with TailwindCSS
- New components can be added via CLI

---

## Task 1.3: Set up Environment Variables and LLM API Configuration
**What**: Create configuration for connecting to multiple LLM providers

**How**:
- Create `.env.local` file (don't commit to git)
- Add placeholder environment variables:
  - `OPENAI_API_KEY`
  - `ANTHROPIC_API_KEY`
  - `GOOGLE_GENAI_API_KEY`
- Create `/lib/config.ts` to load and validate env vars at startup
- Add a simple validation function that checks required keys exist

**Verify**:
- `.env.local` is in `.gitignore`
- Config module can be imported without errors
- Proper error message when env vars are missing

---

## Task 1.4: Install and Set Up ai-sdk
**What**: Install the Vercel ai-sdk for unified LLM integration

**How**:
- Install `ai` package: `npm install ai`
- Install provider packages: `npm install @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/google`
- Create `/lib/llm.ts` with LLM provider initialization for OpenAI, Claude, and Gemini
- Export functions to get each provider model instance

**Verify**:
- All packages install without errors
- LLM module can be imported without errors
- No TypeScript errors in the LLM configuration

---

## Task 1.5: Create LLM Abstraction Layer
**What**: Build a unified interface to call any LLM provider

**How**:
- Create `/lib/llm-client.ts` with an abstraction function `callLLM(provider, message, model)`
- Support switching between providers (openai, anthropic, google)
- Add basic error handling for API failures
- Return response in a consistent format: `{ content: string, provider: string }`

**Verify**:
- Function accepts multiple providers without errors
- Error handling works for invalid inputs
- Response format is consistent across providers

---

## Task 1.6: Create Basic Chat UI Components
**What**: Build reusable UI components for chat interface

**How**:
- Create `/components/ChatMessage.tsx` to display individual messages (user/assistant)
- Create `/components/ChatInput.tsx` with input field and send button
- Create `/components/ChatContainer.tsx` to display message list
- Use shadcn Button and Input components
- Add basic styling with TailwindCSS (flex layout, colors, spacing)

**Verify**:
- All components render without errors
- Components accept and display props correctly
- Styling looks clean and readable

---

## Task 1.7: Create Chat Page and State Management
**What**: Build the main chat page with message state and LLM interaction

**How**:
- Create `/app/page.tsx` as the main chat page
- Use React `useState` to manage messages array
- Add provider selector dropdown (OpenAI, Claude, Gemini)
- Add model selector dropdown (configurable per provider)
- Implement message submission handler that calls the LLM
- Implement loading state during API calls

**Verify**:
- Page renders without errors
- Provider and model dropdowns work
- Messages are stored and displayed correctly

---

## Task 1.8: Implement Chat Functionality - Send Message to LLM
**What**: Connect chat UI to LLM and handle responses

**How**:
- Create `/lib/chat.ts` with `sendMessage(message, provider, model)` function
- Call the LLM abstraction layer from Task 1.5
- Add error handling for API failures (display error message to user)
- Update chat messages array with both user and assistant responses
- Add response streaming support (optional but recommended)

**Verify**:
- Sending a message calls the API and returns a response
- Responses appear in chat UI
- Errors are displayed gracefully to the user
- Loading indicator shows while waiting for response

---

## Task 1.9: Add Error Handling and User Feedback
**What**: Improve robustness with error messages and validation

**How**:
- Add input validation (check message is not empty)
- Add UI error notifications (toast or alert component from shadcn)
- Handle network errors gracefully
- Handle rate limiting and quota errors
- Add logging for debugging

**Verify**:
- Empty message submission is prevented
- API errors show user-friendly messages
- No console errors when things fail

---

## Task 1.10: Test Basic Chat Flow - Manual Testing
**What**: Verify the entire chat system works end-to-end with all three LLM providers

**How**:
- Set up API keys for at least one provider (start with OpenAI if available)
- Run dev server: `npm run dev`
- Test basic flow: type message → select provider → send → see response
- Test provider switching: verify response changes per provider
- Test edge cases: empty input, very long input, network failure

**Verify**:
- Successfully send and receive messages from at least one LLM provider
- Chat UI displays messages correctly
- No crashes or unhandled errors
- Basic functionality works end-to-end
