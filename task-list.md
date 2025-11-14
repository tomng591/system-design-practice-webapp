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

## Task 1.6: Create Basic Chat UI Components (AI SDK Optimized)
**What**: Build minimal, reusable UI components for chat interface leveraging ai-sdk/ui patterns

**How**:
- Create `/components/ChatMessage.tsx` to display individual messages (user/assistant)
- Create `/components/ChatInput.tsx` with input field and send button
- Create `/components/ChatContainer.tsx` to display message list with auto-scroll
- Use shadcn Button and Input components
- Add basic TailwindCSS styling
- **Note**: AI SDK's `useChat` hook (Task 1.7) handles message state, so components focus only on UI rendering

**Verify**:
- All components render without errors
- Components follow ai-sdk/ui Message type structure
- Styling looks clean and readable

---

## Task 1.7: Create Chat Page with useChat Hook (AI SDK UI)
**What**: Build main chat page using ai-sdk/ui's `useChat` hook for state management

**How**:
- Create `/app/chat/page.tsx` using ai-sdk/ui's `useChat` hook (replaces manual useState)
- `useChat` automatically handles: messages array, loading state, error state, sending, streaming
- Add provider selector dropdown (OpenAI, Claude, Gemini)
- Add model selector dropdown (configurable per provider)
- Pass selected provider/model to the `/api/chat` endpoint via headers
- Integrate ChatContainer, ChatInput, and ChatMessage components

**Verify**:
- Page renders without errors
- Provider and model dropdowns work
- `useChat` hook integrates without TypeScript errors
- Messages display correctly

**Key Benefit**: Eliminates 80% of state management code; ai-sdk handles chat state, streaming, and error states automatically.

---

## Task 1.8: Create Chat API Endpoint with streamText (AI SDK Core)
**What**: Create a simple `/api/chat` endpoint using ai-sdk's `streamText` function

**How**:
- Create `/app/api/chat/route.ts` with a POST endpoint
- Use ai-sdk's `streamText()` to stream LLM responses
- Extract provider and model from request headers (set by useChat)
- Call `getModel(provider, model)` from `/lib/llm.ts` (Task 1.4)
- Return streamed response using ai-sdk's `toUIMessageStreamResponse()` helper
- Let ai-sdk handle streaming, errors, token counting automatically

**Verify**:
- POST `/api/chat` endpoint works with streaming response
- useChat hook receives and displays streamed responses
- No manual response formatting or state management needed

**Key Benefit**: `streamText` handles all complexity (streaming, backpressure, error handling, metadata). No custom chat logic file needed.

---

## Task 1.9: Add Minimal Error Handling via AI SDK
**What**: Ensure errors are handled and displayed to user

**How**:
- Add input validation in ChatInput component (prevent empty messages)
- ai-sdk's `useChat` hook automatically catches and exposes errors in `error` state
- Add error display component that shows `useChat`'s error state
- Add basic logging to console for debugging
- No need for custom error handling layer; ai-sdk provides it

**Verify**:
- Empty message submission is prevented
- API errors display in UI via useChat error state
- Invalid provider/model combinations are caught gracefully

**Key Benefit**: Leverages ai-sdk's built-in error handling instead of custom layer.

---

## Task 1.10: Manual End-to-End Testing
**What**: Verify entire chat system works with at least one real LLM provider

**How**:
- Set up valid API key in `.env.local` (start with OpenAI)
- Run `npm run dev`
- Test: type message → select provider → send → see streaming response
- Test provider switching and different models
- Test edge cases: empty input, very long messages, rapid sends

**Verify**:
- Successfully send and receive messages from real LLM provider
- Streaming responses appear in chat UI in real-time
- Provider switching works correctly
- No crashes or unhandled errors
- Basic functionality works end-to-end
