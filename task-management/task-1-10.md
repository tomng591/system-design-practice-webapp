# Task 1.10: End-to-End Testing with Chrome DevTools MCP (AI SDK MVP)

## ⏭️ SKIPPED - Task Status: SKIPPED

**Reason for Skipping**:
- Chat functionality is not the primary focus of this system design practice webapp
- Comprehensive end-to-end testing with chrome-devtools-mcp was already completed in Task 1.8
- The bug fix process in Task 1.8 validated the entire chat pipeline:
  - Chat page loads and renders correctly
  - Messages send and receive responses
  - Streaming works token-by-token
  - Error handling works properly
  - No JavaScript errors in console

**E2E Testing Completed in Task 1.8**:
- ✅ Opened chat at http://localhost:3000/chat
- ✅ Sent test message "Test message - checking if responses show up now"
- ✅ Verified assistant response displayed correctly
- ✅ Confirmed streaming format in network tab
- ✅ Validated event stream with proper metadata
- ✅ Checked server logs for no errors
- ✅ Used chrome-devtools-mcp for screenshot and network inspection

**Next Steps**:
This completes Milestone 1 MVP. The focus now shifts to system design features (not chat features).

---

## Description
Perform focused end-to-end testing to verify the entire chat system works correctly with at least one real LLM provider. This task uses **Chrome DevTools MCP** for automated browser testing via Claude Code, with manual testing as fallback. This is the final validation task before Milestone 1 completion. Since we're using ai-sdk for the heavy lifting, testing is simplified - just verify the integration works end-to-end.

## Testing Setup:
1. Ensure at least one API key is configured in `.env.local`:
   - `OPENAI_API_KEY` (recommended for MVP testing)
   - Or `ANTHROPIC_API_KEY` or `GOOGLE_GENAI_API_KEY`

2. Start development server:
   ```bash
   npm run dev
   ```
   - Verify server starts on http://localhost:3000

3. Choose testing approach:
   - **Automated** (Recommended): Use Chrome DevTools MCP in Claude Code (See below)
   - **Manual**: Use browser DevTools (F12) for inspection

---

## Automated Integration Testing with Chrome DevTools MCP

### Setup Chrome DevTools MCP (One-time)

If not already configured, add to Claude Code settings:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-chrome-devtools"]
    }
  }
}
```

### Automated Test Script (Claude Code)

Ask Claude Code to run this automated test:

```
Run automated E2E tests for the chat application using chrome-devtools-mcp:

1. Open browser to http://localhost:3000/chat
2. Test 1: Empty message validation
   - Try to send empty message
   - Verify error message "Message cannot be empty" appears

3. Test 2: Basic message and streaming response
   - Type message: "Say hello in one sentence"
   - Click Send button
   - Wait for response to stream in
   - Verify user message appears (right-aligned, blue)
   - Verify assistant response appears (left-aligned, gray)
   - Verify status shows "Ready" when done
   - Take screenshot of completed chat

4. Test 3: Multiple messages (context)
   - Type: "What did I just ask you?"
   - Send message
   - Verify assistant response references previous question
   - Verify both messages visible in chat history
   - Take screenshot showing conversation

5. Test 4: Provider switching (if applicable)
   - Change provider dropdown
   - Send another message
   - Verify response comes from new provider

6. Test 5: Check console for errors
   - Verify no JavaScript errors in console
   - Verify no network errors

7. Report results with screenshots
```

### What Chrome DevTools MCP Tests

The automated approach using claude-devtools-mcp provides:

- ✅ **Visual verification**: Screenshots showing UI state at each step
- ✅ **DOM inspection**: Verify elements exist and have correct content
- ✅ **Network monitoring**: Check `/api/chat` requests and responses
- ✅ **Console inspection**: Detect JavaScript errors automatically
- ✅ **Page navigation**: Handles browser interactions programmatically
- ✅ **State validation**: Verify loading states, error messages, streaming text
- ✅ **No flakiness**: Built-in waits for elements and async operations

### Expected Automated Test Output

When automated tests complete, you should see:
1. Screenshots at each test stage
2. Console output showing: "✅ Test 1 passed", "✅ Test 2 passed", etc.
3. Final report: "All automated tests passed ✅"
4. No error messages or exceptions

### Advantages of Automated Testing

| Aspect | Manual | Automated (chrome-devtools-mcp) |
|--------|--------|----------------------------------|
| Speed | 10+ minutes | 2-3 minutes |
| Repeatability | Manual each time | One command, repeatable |
| Documentation | Screenshots optional | Screenshots captured automatically |
| Reliability | Human error possible | Programmatic, no flakiness |
| Debugging | Need DevTools open | Console/network data captured |
| Integration | Manual review | Can integrate into CI/CD |

---

## Manual Testing (Fallback)

If automated testing is not available or you prefer manual verification:

## Core Test Scenarios (Simplified)

### Test 1: Basic Streaming Response
**Goal**: Verify message streams token-by-token with proper UI updates

**Steps**:
1. Navigate to `http://localhost:3000/chat`
2. Select provider with valid API key
3. Type: "Hello, say hi back in one sentence"
4. Click Send
5. **Verify**:
   - ✅ User message appears immediately (right-aligned, blue)
   - ✅ "Streaming..." status shows in header
   - ✅ Assistant response appears token-by-token (visible as text appears gradually)
   - ✅ Response completes and status changes to "Ready"
   - ✅ No console errors
   - ✅ Network tab shows `/api/chat` POST request with streaming response

**Expected**: Response streams in smoothly, text appears character-by-character, UI updates properly

---

### Test 2: Multiple Messages (Context)
**Goal**: Verify conversation context is maintained

**Steps**:
1. From Test 1, type: "What did I just ask you?"
2. Send message
3. **Verify**:
   - ✅ Assistant references previous message (shows context understanding)
   - ✅ Both user messages visible in chat history
   - ✅ Both assistant responses visible
   - ✅ Messages in correct order

**Expected**: Chat maintains conversation history and context across multiple exchanges

---

### Test 3: Provider Switching (If Multiple Keys Available)
**Goal**: Verify different providers work and respond differently

**Prerequisites**: Have API keys for 2+ providers

**Steps**:
1. Change provider dropdown to different LLM
2. Type: "What's 2+2?"
3. Send message
4. **Verify**:
   - ✅ Response comes from new provider (may have different wording)
   - ✅ Still streams correctly
   - ✅ Works without errors

**Expected**: Can switch providers and each produces valid responses

---

### Test 4: Error Handling
**Goal**: Verify graceful error handling for invalid inputs

**Steps**:
1. Click Send with empty message
2. **Verify**: "Message cannot be empty" error shows in red
3. Type 5001+ characters
4. **Verify**: Length error shows
5. Type valid message and send
6. **Verify**: Error clears and message sends successfully

**Expected**: Input validation works and prevents invalid submissions

---

### Test 5: UI Responsiveness During Streaming
**Goal**: Verify UI remains responsive while streaming

**Steps**:
1. Send a message that will generate a long response (e.g., "Write 5 sentences")
2. While streaming, **verify**:
   - ✅ Can see text appearing incrementally
   - ✅ Send button is disabled (grayed out)
   - ✅ Provider/model dropdowns are disabled
   - ✅ Chat remains scrollable if needed

**Expected**: UI properly manages loading state and remains responsive

---

## Quick Check Scenarios (Optional)

### Edge Case: Very Long Input
```
Type: [5000 character message]
→ Should accept and send
```

### Edge Case: Rapid Sends
```
Type message, send, immediately type another
→ Should queue and send in order
```

### Network Observation (DevTools Network tab)
```
Should see:
- POST /api/chat request
- Response type: "text/event-stream" (streaming)
- Multiple events flowing: text-delta, finish
```

## Testing Checklist

| Scenario | Expected | Result | Notes |
|----------|----------|--------|-------|
| Page loads at /chat | No errors | ✓/✗ | |
| Can type message | Input works | ✓/✗ | |
| Send message | Streams response | ✓/✗ | Check Network tab |
| Response displays | Text in chat | ✓/✗ | Should be gradual |
| Multiple messages | Context maintained | ✓/✗ | |
| Provider switch | New response | ✓/✗ | If 2+ keys available |
| Empty message | Error shown | ✓/✗ | Red error text |
| Streaming UI | Disabled state | ✓/✗ | Send button greyed |

## Troubleshooting Guide

### Issue: Page doesn't load at /chat
- Check: Is dev server running? (`npm run dev`)
- Check: Are there TypeScript errors? (`npm run build`)
- Check: Is route file created? (`app/chat/page.tsx`)

### Issue: API calls fail with 400 error
- Check: Provider/model headers correctly passed?
- Check: Messages format correct? (Should be array from useChat)
- Check: getModel() returns valid model instance?

### Issue: Streaming doesn't work
- Check: Is streamText imported in API route?
- Check: Is .toDataStreamResponse() called?
- Check: Network tab shows "text/event-stream" response?

### Issue: Error state not displaying
- Check: useChat hook has error state?
- Check: Error display div in chat page rendered?
- Check: Error boundary working properly?

### Issue: Model responses are slow
- This is normal! API calls take 1-10+ seconds
- Check: Network tab shows request is actually pending
- Check: Tokens appearing incrementally (not all at once)

## Testing Requirements & Pass/Fail Criteria

### ✅ MUST-PASS (Blockers)
1. **Page loads at /chat without errors**: Can access chat interface
2. **Can send a message and receive response**: Real LLM integration works
3. **Response streams (visible as incremental text)**: Token-by-token delivery working
4. **No unhandled JavaScript errors**: Console is clean

**Pass Criteria**: All 4 must pass. If any fails, Milestone 1 incomplete.

### ⚠️ HIGH-PRIORITY (Strongly Recommended)
1. **Multiple messages maintain context**: Conversation history works
2. **Input validation works**: Empty messages prevented
3. **Error messages display properly**: User sees helpful error text

**Pass Criteria**: At least 2 of 3 should work.

### ⏭️ CAN SKIP/DEFER (Nice-to-have)
1. **Provider switching** (if multiple API keys not available)
2. **Edge case testing** (can test more thoroughly later)
3. **Performance optimization** (can optimize later)

## Recommended Testing Order:
1. **Test 1 first** (2 min): Basic message and response
2. **If Test 1 passes**: Test 2 (context) and Test 4 (validation)
3. **If Tests 1-2-4 pass**: Test 3 (provider switching) if available
4. **If all core tests pass**: Milestone 1 complete ✅

## Success Criteria

**Milestone 1 is complete when**:
- ✅ Chat page loads without errors
- ✅ Can send message and receive streaming response
- ✅ Response text appears incrementally (token-by-token)
- ✅ Can send multiple messages in sequence
- ✅ Input validation prevents empty messages
- ✅ No unhandled JavaScript errors in console

### Automated Testing Success (Recommended):
Using Chrome DevTools MCP, **all 5 tests pass** with:
- ✅ Empty message validation error displays
- ✅ Message streams and displays correctly
- ✅ Streaming indicator shows during response
- ✅ Multiple messages maintain conversation context
- ✅ Console has no JavaScript errors
- ✅ Screenshots captured at each test stage

## Note / Status

- Status: ⏭️ SKIPPED
- Assigned to: N/A (Task Skipped)
- Reason: Chat is not the primary focus of the app; comprehensive E2E testing completed in Task 1.8 using chrome-devtools-mcp
- Prerequisite: Task 1.1 through 1.8 must be completed
- Created: November 14, 2025
- Updated: November 14, 2025 (Enhanced with Chrome DevTools MCP)
- Skipped: November 14, 2025 (E2E testing with chrome-devtools-mcp completed during Task 1.8 debugging)
- Notes:
  - **CHROME DEVTOOLS MCP INTEGRATION**: Automated browser testing via Claude Code
  - **AI SDK OPTIMIZATION**: Simplified testing since ai-sdk handles streaming/errors
  - **Recommended approach**: Use automated testing (faster, repeatable, documented)
  - **Fallback approach**: Manual testing if MCP not available
  - Focus on happy path: can chat work end-to-end?
  - Don't test edge cases extensively - MVP only
  - Streaming visible in UI (not all response at once)
  - Token-by-token delivery from ai-sdk streamText function
  - Error states automatically handled and displayed
  - Automated tests provide screenshots and validation
  - Once core tests pass, Milestone 1 complete
  - Milestone 2 begins with feature expansion
  - This is final validation of MVP chat functionality

## Running the Automated Tests

To run the automated end-to-end tests in Claude Code:

1. **Ensure dev server is running**: `npm run dev`
2. **Ask Claude Code**:
   ```
   Run the automated E2E tests for task 1.10 using chrome-devtools-mcp.
   Follow the test steps in the "Automated Integration Testing with Chrome DevTools MCP" section.
   ```
3. **Review results**: Check screenshots and test output
4. **Report status**: All tests pass = Milestone 1 complete ✅
