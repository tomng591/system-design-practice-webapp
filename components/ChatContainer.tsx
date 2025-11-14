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
