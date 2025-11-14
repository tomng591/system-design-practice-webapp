'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:bg-zinc-800/30">
          System Design Practice Webapp
        </p>
      </div>

      <div className="relative flex place-items-center">
        <h1 className="text-4xl font-bold">Welcome to System Design Practice</h1>
      </div>

      {/* shadcn/ui Components Test */}
      <div className="mt-8 space-y-4 w-full max-w-2xl">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">shadcn/ui Components</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Input Component</label>
              <Input placeholder="Type something..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Button Component</label>
              <Button>Click Me</Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Card Component</label>
              <Card className="p-4 bg-muted">
                <p>This is a nested Card component with shadcn styling.</p>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
