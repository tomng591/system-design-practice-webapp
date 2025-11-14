'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { ChatContainer, ChatInput } from '@/components/index';
import { Card } from '@/components/ui/card';
import { llmModels, type Provider, type Model } from '@/lib/llm';

const providers = Object.keys(llmModels) as Provider[];

export default function ChatPage() {
  const [selectedProvider, setSelectedProvider] = useState<Provider>('openai');
  const [selectedModel, setSelectedModel] = useState<Model>('gpt-4.1');

  // useChat hook handles ALL state management:
  // - messages array
  // - loading state
  // - error state
  // - streaming responses
  // - sending messages
  const { messages, sendMessage, status, error } = useChat({
    api: '/api/chat',
    headers: {
      'x-provider': selectedProvider,
      'x-model': selectedModel,
    },
  });

  const handleSendMessage = async (message: string) => {
    // useChat handles sending messages, streaming, loading states
    await sendMessage({ role: 'user', parts: [{ type: 'text', text: message }] });
  };

  const isLoading = status === 'streaming';

  // Convert UIMessage to Message format for ChatContainer
  const convertedMessages = messages.map((msg) => {
    let content = '';
    if (msg.parts && Array.isArray(msg.parts)) {
      content = msg.parts
        .map((part: any) => {
          if (part.type === 'text' && part.text) {
            return part.text;
          }
          return '';
        })
        .join('');
    }
    return {
      id: msg.id,
      role: (msg.role === 'user' || msg.role === 'assistant' ? msg.role : 'assistant') as 'user' | 'assistant',
      content: content,
    };
  });

  const currentProviderModels = llmModels[selectedProvider];
  const models = Object.keys(currentProviderModels) as Model[];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold mb-4">LLM Chat (AI SDK Powered)</h1>

        {/* Provider and Model Selection */}
        <div className="flex gap-4">
          {/* Provider Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Provider</label>
            <select
              value={selectedProvider}
              onChange={(e) => {
                const newProvider = e.target.value as Provider;
                setSelectedProvider(newProvider);
                // Reset model to first available for this provider
                const firstModel = Object.keys(
                  llmModels[newProvider]
                )[0] as Model;
                setSelectedModel(firstModel);
              }}
              disabled={isLoading}
              className="border rounded px-3 py-2 bg-white"
            >
              {providers.map((provider) => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as Model)}
              disabled={isLoading}
              className="border rounded px-3 py-2 bg-white"
            >
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex items-end">
            {isLoading ? (
              <span className="text-blue-600 font-medium">Streaming...</span>
            ) : error ? (
              <span className="text-red-600 font-medium">Error</span>
            ) : (
              <span className="text-green-600 font-medium">Ready</span>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <ChatContainer messages={convertedMessages} />

        {/* Error Display */}
        {error && (
          <Card className="bg-red-50 border-red-200 p-4 mt-4">
            <p className="text-red-800 text-sm">
              Error: {error.message || 'Failed to send message'}
            </p>
          </Card>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <ChatInput
          onSend={handleSendMessage}
          disabled={isLoading}
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
}
