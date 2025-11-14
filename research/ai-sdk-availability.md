# AI SDK Integration Guide for a System-Design Interview Webapp (Next.js)

This doc maps **AI SDK features** to things your webapp would normally need to build manually.

Your app:
- Next.js, heavy on LLM calls  
- Focused on system-design coaching: chat, evaluation, hints, question generation, RAG, analytics  

AI SDK gives you:

- A **core LLM layer** (generation, tools, structured outputs, embeddings, media)
- A **React UI layer** (hooks + streaming transports)
- An **agents layer** (loops, tool orchestration)
- **Provider, middleware & telemetry** infra

---

## 1. Core: Text Generation & Streaming

### 1.1 `generateText` – one-shot generations

Use instead of hand-writing provider REST calls.

Good for:
- Generating system design questions  
- Drafting model answers  
- Producing feedback or hints  

Benefits:
- Unified API for providers  
- Rich metadata: finish reason, usage, reasoning, tool calls  
- Avoids building custom REST wrappers + manual parsing

---

### 1.2 `streamText` – streaming responses

For live coaching.

Features:
- Streams tokens, tool calls, metadata  
- Helpers: `toUIMessageStreamResponse`, `pipeUIMessageStreamToResponse`, etc.  
- Callbacks: `onChunk`, `onError`, `onFinish`

Use it for:
- `/api/chat` endpoint that returns streaming AI responses

Avoids:
- Building your own SSE/socket transport  
- Manual buffering + backpressure handling

---

## 2. Structured Evaluation & Extraction

### 2.1 `generateObject` / `streamObject`

High-level APIs for **structured JSON** with validation (Zod, Valibot, JSON Schema).

Use-cases:
- **Answer scoring** (correctness, coverage, trade-offs)  
- **Rubric alignment**  
- **Metadata extraction** (architectures, components, bottlenecks)

Avoids:
- Manual JSON extraction prompts  
- Fragile parsing + validation  
- Provider-specific JSON mode handling

`streamObject` lets you show partial evaluation live.

---

## 3. Tool Calling & Agents

### 3.1 Tools (`tool` helper)

Define tools with:
- `description`
- `inputSchema`
- `execute`

Your app can expose tools like:
- `getQuestion`
- `listQuestionsByTopic`
- `saveAttempt`
- `retrieveNotes`
- `lookupDefinition`

Avoids:
- Prompt conventions for function calling  
- Per-provider tool-call glue  
- Manual JSON schema parsing

---

### 3.2 Agents (`Experimental_Agent`)

Manages multi-step tool-LLM loops.

Use-cases:
- Multi-step coaching:
  - Clarify → fetch question → evaluate → give feedback  
- Automated evaluation pipelines  
- Inspecting full “chain-of-thought” (in logs)

Avoids:
- Writing your own agent loop  
- Manual stopping logic  
- Complex message history management

---

## 4. Embeddings & Retrieval (RAG)

### 4.1 `embed` / `embedMany`

Use for:
- Indexing question bank  
- Context retrieval for explanations  
- Storing user notes for RAG coaching

Avoids:
- Writing per-provider embedding calls  
- Custom batching logic

---

## 5. Media (Optional)

### 5.1 Image Generation
Experimental `generateImage` for:
- Architecture diagrams (rough sketches)
- Thumbnails / UI moodboards

### 5.2 Speech & Transcription
Supports:
- Speech-to-text for voice-based answers  
- Text-to-speech for explanations

Avoids:
- Integrating multiple audio APIs separately

---

## 6. Providers & Model Config

### 6.1 `customProvider`
Centralize:
- Default settings (temp, tokens)  
- Allowed models per environment  
- Aliases (e.g. `"eval-fast"` → gpt-4o-mini)

### 6.2 Provider Registry
`createProviderRegistry`:
- Single place to register OpenAI, Anthropic, etc.  
- Use identifiers like `"openai:gpt-4.1"`  
- Swap models without changing app logic

Avoids:
- Scattered API keys/config  
- Hardcoded model names

---

## 7. Middleware (Guardrails, Logging, Caching)

Add global functionality via `wrapLanguageModel`:

Possible middlewares:
- Guardrails (strip sensitive data)  
- Caching of repeated eval prompts  
- Logging and analytics  
- RAG context injection  
- `extractReasoningMiddleware`  
- `simulateStreamingMiddleware`  
- `defaultSettingsMiddleware`

Avoids:
- Writing pre/post hooks per endpoint  
- Duplicating logic across routes

---

## 8. Telemetry & Observability

AI SDK supports **OpenTelemetry**:

You get:
- Traces for `generateText`, `streamText`, `generateObject`, etc.  
- Latency metrics: time-to-first-token, tokens/sec  
- Token usage and model IDs logged uniformly  

Avoids:
- Custom manual instrumentation  
- Hard-to-debug performance regressions

---

## 9. AI SDK UI (React Hooks)

Recommended for production (RSC is experimental).

### 9.1 `useChat`
- Real-time chat state  
- Handles messages, status, errors, abort/retry  
- Works with `DefaultChatTransport`

Use for:
- Main coaching chat  
- Evaluation discussions

Avoids:
- Implementing chat stores  
- DIY streaming → React state logic

---

### 9.2 `useCompletion`
Single prompt → streaming answer.

Use for:
- “Generate a new question (topic X, difficulty Y)”  
- “Rewrite my answer more clearly”

Avoids:
- Writing your own completion form logic

---

### 9.3 `useObject`
Stream structured objects into React.

Use for:
- Live evaluation dashboards  
- Real-time rubric scoring  
- Dynamic next-step instructions

Avoids:
- Diff/patch logic for partial JSON streaming

---

### 9.4 Streaming Custom Data (Typed)
Use:
- `createUIMessageStream`
- `createUIMessageStreamResponse`
- `pipeUIMessageStreamToResponse`

Allows streaming metadata with messages:
- Scores  
- Links  
- Derived metrics  
- Evaluation JSON  

Avoids:
- Building your own event multiplexing layer

---

### 9.5 Transport & Error Handling
AI SDK UI provides:
- Unified error states  
- Retries  
- Custom transports  
- Standard patterns for React

Avoids:
- Inconsistent UX and custom fetch/SSE code

---

## 10. AI SDK RSC (Optional)
Experimental. Lets you stream React components from the server.  
Recommended to use **AI SDK UI** instead for production.

---

## 11. Putting It All Together (Your App Architecture)

### 11.1 Chat Coach
- Frontend: `useChat`
- Backend: `streamText`
- Tools: question retrieval, save attempt, definitions
- Middleware: guardrails, logging

### 11.2 Answer Evaluation
- Backend: `generateObject` / `streamObject`
- UI: `useObject`
- Renders live scoring dashboard

### 11.3 RAG Coaching
- Precompute embeddings with `embedMany`
- Use tool `retrieveContext`
- Inject into prompts via middleware

### 11.4 Question Generation
- Frontend: `useCompletion`
- Backend: `streamText` or `generateObject` with schema

### 11.5 Model Switching
- Registry with `createProviderRegistry`
- Aliases via `customProvider`

### 11.6 Observability
- `experimental_telemetry: { isEnabled: true }`
- Logs latency, usage, reasoning (if enabled)
