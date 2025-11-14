# Task 1.6: Create Basic Chat UI Components

## Description
Build reusable React components for chat interface including message display, input field, and message container. These components will be used in the main chat page and follow shadcn/ui design patterns.

## Implementation Detail

### Steps:
1. Create `components/ChatMessage.tsx` - individual message component:
   ```typescript
   'use client';

   interface ChatMessageProps {
     role: 'user' | 'assistant';
     content: string;
   }

   export function ChatMessage({ role, content }: ChatMessageProps) {
     const isUser = role === 'user';

     return (
       <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
         <div
           className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
             isUser
               ? 'bg-blue-500 text-white rounded-br-none'
               : 'bg-gray-200 text-gray-900 rounded-bl-none'
           }`}
         >
           <p className="break-words">{content}</p>
         </div>
       </div>
     );
   }
   ```

2. Create `components/ChatInput.tsx` - message input component:
   ```typescript
   'use client';

   import { useState } from 'react';
   import { Button } from '@/components/ui/button';
   import { Input } from '@/components/ui/input';

   interface ChatInputProps {
     onSend: (message: string) => void;
     disabled?: boolean;
   }

   export function ChatInput({ onSend, disabled }: ChatInputProps) {
     const [message, setMessage] = useState('');

     const handleSubmit = (e: React.FormEvent) => {
       e.preventDefault();
       if (message.trim()) {
         onSend(message);
         setMessage('');
       }
     };

     return (
       <form onSubmit={handleSubmit} className="flex gap-2">
         <Input
           value={message}
           onChange={(e) => setMessage(e.target.value)}
           placeholder="Type your message..."
           disabled={disabled}
           className="flex-1"
         />
         <Button type="submit" disabled={disabled || !message.trim()}>
           Send
         </Button>
       </form>
     );
   }
   ```

3. Create `components/ChatContainer.tsx` - messages list component:
   ```typescript
   'use client';

   import { useEffect, useRef } from 'react';
   import { ChatMessage } from './ChatMessage';
   import { Card } from '@/components/ui/card';

   export interface Message {
     id: string;
     role: 'user' | 'assistant';
     content: string;
   }

   interface ChatContainerProps {
     messages: Message[];
   }

   export function ChatContainer({ messages }: ChatContainerProps) {
     const messagesEndRef = useRef<HTMLDivElement>(null);

     // Auto-scroll to bottom
     useEffect(() => {
       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
     }, [messages]);

     return (
       <Card className="h-96 overflow-y-auto p-4">
         {messages.length === 0 ? (
           <div className="flex items-center justify-center h-full text-gray-400">
             <p>No messages yet. Start a conversation!</p>
           </div>
         ) : (
           <>
             {messages.map((msg) => (
               <ChatMessage
                 key={msg.id}
                 role={msg.role}
                 content={msg.content}
               />
             ))}
             <div ref={messagesEndRef} />
           </>
         )}
       </Card>
     );
   }
   ```

4. Verify component structure:
   - All components use `'use client'` directive for client-side rendering
   - Components use shadcn/ui Button, Input, and Card
   - Components are properly typed with TypeScript
   - Components use TailwindCSS for styling

5. Create `components/index.ts` for easier imports:
   ```typescript
   export { ChatMessage } from './ChatMessage';
   export { ChatInput } from './ChatInput';
   export { ChatContainer, type Message } from './ChatContainer';
   ```

## Unit Test Detail

**Test File**: `__tests__/chat-components.test.ts`

Test cases:
- Verify component files exist
- Verify components export correctly
- Verify TypeScript types are correct

```typescript
describe('Chat Components', () => {
  it('should export ChatMessage component', () => {
    const { ChatMessage } = require('../components/ChatMessage');
    expect(ChatMessage).toBeDefined();
    expect(typeof ChatMessage).toBe('function');
  });

  it('should export ChatInput component', () => {
    const { ChatInput } = require('../components/ChatInput');
    expect(ChatInput).toBeDefined();
    expect(typeof ChatInput).toBe('function');
  });

  it('should export ChatContainer component', () => {
    const { ChatContainer, Message } = require('../components/ChatContainer');
    expect(ChatContainer).toBeDefined();
    expect(typeof ChatContainer).toBe('function');
  });

  it('should export components from index file', () => {
    const exported = require('../components/index');
    expect(exported.ChatMessage).toBeDefined();
    expect(exported.ChatInput).toBeDefined();
    expect(exported.ChatContainer).toBeDefined();
  });
});
```

## Integration Test Detail

**Test File**: `tests/chat-components.integration.test.ts`

Test cases:
- Build should succeed with all chat components
- No TypeScript errors in component files
- Components can be imported without runtime errors

```typescript
describe('Chat Components Integration', () => {
  it('should build successfully with chat components', async () => {
    const { execSync } = require('child_process');
    const output = execSync('npm run build 2>&1', { encoding: 'utf-8' });
    expect(output).toContain('compiled');
    expect(output).not.toContain('error');
  });

  it('should not have TypeScript errors in components', () => {
    const { execSync } = require('child_process');
    const output = execSync('npx tsc --noEmit 2>&1', { encoding: 'utf-8' });
    expect(output).not.toContain('error TS');
  });

  it('should import all components without errors', () => {
    expect(() => require('../components')).not.toThrow();
  });
});
```

## Manual Test Detail

1. Verify all three component files exist:
   - `components/ChatMessage.tsx`
   - `components/ChatInput.tsx`
   - `components/ChatContainer.tsx`

2. Run `npx tsc --noEmit` and verify no TypeScript errors

3. Run `npm run build` and verify build succeeds

4. Visual test in dev server (after Task 1.7):
   - Components should render without errors
   - Chat messages should display with proper styling
   - Input field should be functional
   - Send button should be properly styled

5. Verify component structure:
   - ChatMessage has role and content props
   - ChatInput has onSend callback and disabled state
   - ChatContainer has auto-scroll functionality

## Testing Requirements & Pass/Fail Criteria

### ✅ MUST-PASS (Blockers)
1. **All component files exist**: ChatMessage, ChatInput, ChatContainer
2. **No TypeScript errors**: `npx tsc --noEmit` passes
3. **Components export correctly**: Can import without runtime errors
4. **Build succeeds**: `npm run build` completes without errors

**Pass Criteria**: All 4 must pass. If any fails, task is incomplete.

### ⚠️ HIGH-PRIORITY (Strongly Recommended)
1. **Components use shadcn/ui**: Button, Input, Card imported correctly
2. **Components properly typed**: All props have TypeScript types
3. **Components have TailwindCSS styling**: Styling is applied with Tailwind classes

**Pass Criteria**: At least 2 of 3 should work.

### ⏭️ CAN SKIP/DEFER (Nice-to-have)
1. **Visual refinement** (can improve styling later)
2. **Accessibility features** (can add ARIA labels later)
3. **Animation/transitions** (can add smooth animations later)

## Recommended Testing Order:
1. **Manual first** (2 min): Verify files exist, run tsc, check imports
2. **If manual passes**: Run TypeScript check and build
3. **If all passes**: Proceed to Task 1.7 ✅
4. **If manual fails**: Check file paths and component structure

## Note / Status

- Status: ⏳ PENDING
- Assigned to: [Team Member]
- Prerequisite: Task 1.1 and 1.2 must be completed
- Created: November 14, 2025
- Notes:
  - Components are "use client" for client-side rendering in Next.js
  - Uses shadcn/ui components for consistency
  - ChatContainer auto-scrolls to latest message
  - Ready to proceed to Task 1.7 after verification
