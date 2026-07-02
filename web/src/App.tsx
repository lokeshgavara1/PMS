import { QueryClientProvider, QueryClient } from 'react-query';
import { useState, useEffect } from 'react';

const queryClient = new QueryClient();

function App() {
  const [health, setHealth] = useState<{ status: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v2/health')
      .then(res => res.json())
      .then(data => {
        setHealth(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Health check failed:', err);
        setLoading(false);
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-8">
          <h1 className="text-3xl font-bold mb-4">CUTM-PMS</h1>
          <p className="text-gray-600 mb-4">Performance Management System</p>

          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <h2 className="text-xl font-semibold mb-2">MSW Health Check</h2>
            {loading ? (
              <p className="text-gray-500">Checking API...</p>
            ) : health ? (
              <p className="text-green-600">✓ API Status: {health.status}</p>
            ) : (
              <p className="text-red-600">✗ API Connection Failed</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              ℹ️ Waiting for SRS.md and SDD.md specification files.
              Once provided, the full frontend will be built with all screens, types, fixtures, and mock handlers.
            </p>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
