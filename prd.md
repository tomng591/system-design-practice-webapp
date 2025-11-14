# PRD
## Vision and purpose
- Create a tool to learn and practice system design for software engineer going into interview

## Use case
- Learn: user can load up knowledge about certain system design as context, or ask LLM to generate the system design. Then user can have different way to learn it: traditional reading and question/answer, or let LLM draw diagram, or other more interactive way to learn and remember.
    - Thing to call out here: need to set context about current level of user and their targeted interview level, their position and field/domain to set up the correct scope for the system design. this is very important. The AI should be able to do web search as well to find the correct guidance to teach user, because knowledge in this field is very big and not the same for everyone even with similar kinda question
    - should have a monitoring/progress system to track what have learnt and to learn.
- Practice: user can interview with AI through voice mode to practice for actual interview. In this sense AI need to do a good job of capturing user accent/pronuounciation to understand what they are saying, and need to show that so user know when they got capture wrongly of what they say. The other aspect is to have 2 modes here: practice and mock interview. For practice mode: AI give user more advice and feedback than normal to help user learn while still in the speak/interview format. For mock interview mode, it should mirror the real interview process where interviewer focus on getting the answer from user and only rarely give hint to progress the interview, then only give a detail feedback at the end to evaluate the whole interview.

## Goal
- I can use this to learn more about system design and document that learning. I will have a progress/score system to record my progress and make sure i'm doing better in system design interview after using this (have a meaningful score system to evaluate myself)

## Brainstorm about the app
### User profile
- user profile: focus on set up and store (to simple database like indexdb) user current level, job position, industry/domain, targeted position and level. May generate the scope at which we think user should target and let user to preview and edit, then store that into database as well.

### Learning feature
- learn: essentially user want to have a roadmap about what they will need to learn to get into their desired level. But there's different way to do it. 1 straightforward way is to just ask AI to generate this roadmap base on user profile above, then generate the material. The other way is to give user more say on it by letting them give input like material, blogs, links to load up the context about what they think they should learn and what's some good resource they want to learn. need to strike for balance here to not make it too complicated
    - thing to call out: you don't need to cover all type of system design and best practice. that's for actual engineer on this job. you want to know the basic and fundamental of the system design for the interview, depend on the level. That's why this would be difficult to build. i probably should build with a target for senior engineer as my level first, and when we open source this we can get more input from other people at their level to contribute and to build the UI that make more sense to them

- so essentially user want to get a roadmap first, so generate them from user profile but leave user the ability to modify and regenerate this roadmap
- once we have the roadmap now we will need to generate the lesson or the way user learn. 
    - like i said earlier there's traditional reading material with suppliment question/answer and quiz (def a good way). 
    - then there's the diagram and explaination way, which we may want to do with tldraw if possible. but we will implement this later (aka this is not in the mvp). we should still find way to retrieve/generate the high level diagram for the system design in the traditional learning method to help user understand the system, just don't need to make it interactive or anything
    - feel like quiz is an important part of the learning process to help user remember things/concept
- regardless of the method to learn, there is the need to have material as the context for these lesson. it can either be ai generate directly from their knowledge, user give ai material and ask ai to exclusively use those, or user ask ai to do websearch/deep research to find the right content/material. regardless of the method user should be able to see the final version of these context/material before ai using them to teach user
- this is more than enough for the mvp. maybe the other thing we need to build is progress tracking and observability, since it's always the different to motivate the user to learn if they got something to keep track of their progress
    - simple quiz score, number of topic. more advance is how confident the ai think user is ready for their interview, how much time has they spend on learning each day, what is the speed of learning in each topic. remember ppl not only care about the progress but also the speed of their progress, because they want to optimize. maybe can even suggest different way to learn or optimize. always has a challenge or a goal seems to be a good way to gamify here.

# MVP Focus
**Learning Module Only**: This MVP focuses exclusively on the learning feature with traditional reading, Q&A, and quizzes. Voice-based practice and mock interviews are planned for future milestones after initial learning system is validated.

# Architecture & Scalability Strategy

## Current Architecture (MVP - Milestones 1-2)
The MVP is a **monolithic Next.js application** where all code (frontend and business logic) runs in a single repository:
- Frontend: React components in `/app` and `/components`
- Business Logic: Pure functions in `/lib` (e.g., `llm-client.ts`, `chat.ts`)
- API calls: Made directly to LLM providers from Next.js
- Data Storage: Client-side IndexedDB for user data (Milestone 2+)

**Why this approach:**
- Faster MVP development
- Simpler deployment
- Sufficient for early-stage user validation
- No unnecessary infrastructure complexity

## Future Architecture (Milestone 3+): Backend Separation
As the app grows and complexity increases (Milestone 3: roadmap generation, Milestone 4: lesson evaluation, Milestone 5: material processing), we plan to separate business logic into a dedicated Node.js backend server.

**Separation Path:**
```
MVP (All in Next.js):
React Components → /lib/business-logic.ts → LLM APIs

Future (Separate Backend):
React Components → /app/api/routes → HTTP → Separate Node.js Backend → LLM APIs
```

**Migration Effort Estimate:**
- Extracting logic to separate backend: 1-2 weeks
- Database migration (IndexedDB → backend DB): 1-2 weeks
- Infrastructure setup & deployment: 1 week
- **Total: 3-5 weeks** (can be done incrementally)

## Design Principles for Easy Future Migration

To ensure separation is straightforward when needed, follow these guidelines during implementation:

### ✅ DO:
1. **Keep business logic in `/lib` as pure functions**
   - No React dependencies (useState, useContext, hooks)
   - Accept inputs, return structured outputs
   - Example: `callLLM(provider, message) → { content, provider }`

2. **Define clear API contracts**
   - Document data structures that flow between frontend and backend
   - Create Next.js API routes (`/app/api/*`) as interface layer early (Milestone 2+)
   - This makes swapping backend implementation trivial later

3. **Store sensitive data server-side only**
   - API keys, secrets, and credentials never in client code
   - Pass only responses to client, never raw API keys
   - Use environment variables in `.env.local`

4. **Use dependency injection patterns**
   - Pass dependencies (like LLM client) as function parameters
   - Makes testing and backend swapping easier

### ❌ DON'T:
1. **Tightly couple business logic to React**
   - Avoid embedding business logic in component files
   - Don't use React hooks within business logic functions

2. **Mix UI and business logic**
   - Keep presentation layer separate from data/business layer
   - UI should only call functions from `/lib`, not contain business logic

3. **Use client-side environment variables for secrets**
   - Even if Next.js allows it, only use `NEXT_PUBLIC_*` for non-sensitive values
   - Keep API keys server-side

4. **Create tight dependencies between components**
   - Use props and prop drilling rather than global state for simple cases
   - Easier to extract components to backend services later

## When to Actually Separate

**Trigger points for backend migration:**
- When Milestone 3 (roadmap generation) complexity requires heavy computation
- When Milestone 5 (material processing, web search) needs long-running operations
- When you need background jobs (processing materials, generating lessons asynchronously)
- When you want to scale LLM calls independently from UI
- When you need a traditional database for complex queries (not just IndexedDB)

**Do NOT separate prematurely** - MVP benefits from simplicity. Wait until you have real scalability needs.

# Milestones & tasks
## Milestone 1: Set up webapp project and multi-LLM support
- Initialize web app project (Next.js/React)
- Set up ai-sdk or equivalent for LLM integration
- Implement API integration for OpenAI, Claude, and Gemini
- Use tailwindcss and shadcn or equivalent to bootstrap UI. Create basic chat/message interface for testing

## Milestone 2: Create user profile feature
**Logic:**
- Implement IndexedDB storage for user data
- Build API endpoint to generate recommended scope/learning focus from user profile
- Support profile data: current level, target level, position, industry/domain

**UI/UX Research & Design (separate task):**
- Research best UX patterns for onboarding and profile setup
- Determine how to collect user inputs intuitively (not just a form)
- Design flow for presenting AI-generated scope and allowing user edits
- Create wireframes/mockups before implementation

## Milestone 3: Create learn roadmap feature
**Logic:**
- Design roadmap generation prompt and AI workflow
- Implement AI-powered roadmap generation based on user profile
- Support roadmap editing and regeneration logic
- Store roadmap in database
- Build API to persist and retrieve roadmaps

**UI/UX Research & Design (separate task):**
- Research effective ways to visualize topic hierarchy and dependencies
- Determine best interaction model for editing/regenerating roadmaps
- Design information hierarchy for roadmap display
- Create wireframes/mockups before implementation

## Milestone 4: Create traditional learning feature
**Logic:**
- Design lesson data structure (reading material + Q&A + quiz format)
- Implement lesson retrieval and sequencing logic
- Build Q&A evaluation system with feedback generation
- Create quiz scoring and answer validation logic
- Link roadmap topics to lesson data

**UI/UX Research & Design (separate task):**
- Research best practices for reading and learning interfaces
- Determine optimal layout for Q&A, quizzes, and progress indicators
- Design interaction patterns for lesson navigation
- Plan how to present feedback and explanations effectively
- Create wireframes/mockups before implementation

## Milestone 5: Create material loading and generating
**Logic:**
- Implement AI-generated material from knowledge base
- Build user material upload/import system (documents, links)
- Implement web search and research capability for material gathering
- Create material processing and storage system
- Build API for material retrieval and association with lessons

**UI/UX Research & Design (separate task):**
- Research best UX for material preview and review before usage
- Design flow for uploading and importing custom materials
- Determine how to display and organize material sources
- Design approval/confirmation flow before materials are used in lessons
- Create wireframes/mockups before implementation

## Milestone 6: Implement learning progress tracking
**Logic:**
- Implement quiz score tracking and history storage
- Build learning metrics computation (confidence levels, time spent per topic, learning speed)
- Create gamification data model (badges, streaks, goals)
- Build APIs to retrieve progress and metrics data
- Implement progress calculation and aggregation logic

**UI/UX Research & Design (separate task):**
- Research effective progress visualization techniques
- Design metrics dashboard to show learning speed and progress trends
- Determine best way to display gamification elements motivatingly
- Design data presentation for quiz history and performance analysis
- Plan notification/feedback mechanisms for milestones
- Create wireframes/mockups before implementation

# Future work
- Implement voice-based practice mode with AI interviewer
- Implement mock interview mode (realistic interview simulation)
- Add openrouter for extended model support
- Implement interactive diagram generation (tldraw integration)
- Multi-level learning paths (junior, mid, senior)