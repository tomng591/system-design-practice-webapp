'use client';

import { useState, useEffect } from 'react';
import { validateConfig } from '@/lib/config-validator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SetupPage() {
  const [status, setStatus] = useState<{ valid: boolean; errors: string[] }>({ valid: false, errors: [] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const validation = validateConfig();
      setStatus(validation);
    } catch (error) {
      setStatus({
        valid: false,
        errors: ['Failed to validate configuration'],
      });
    }
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="container mx-auto py-8">
        <p>Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>LLM Configuration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            {status.valid ? (
              <div className="flex items-center gap-2 text-green-600">
                <span className="text-2xl">✅</span>
                <span>All API keys are configured</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <span className="text-2xl">❌</span>
                <span>Missing API key configuration</span>
              </div>
            )}
          </div>

          {status.errors.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Missing configurations:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {status.errors.map((err) => (
                  <li key={err} className="text-red-600">
                    {err}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Please create a `.env.local` file in the project root with the required API keys.
                Refer to `.env.example` for the required environment variables.
              </p>
            </div>
          )}

          {status.valid && (
            <div className="mt-4 p-4 bg-green-50 rounded">
              <p className="text-sm text-green-800">
                Your LLM configuration is ready. You can now proceed with development.
              </p>
            </div>
          )}

          <div className="mt-6">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
