"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function TestDBPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function checkDatabase() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError("Not logged in");
          setLoading(false);
          return;
        }
        
        // Check issue_submissions
        const { data: submissions, error: subError } = await supabase
          .from('issue_submissions')
          .select('*')
          .eq('user_id', user.id);
          
        // Try to check processed_issues
        const { data: processed, error: procError } = await supabase
          .from('processed_issues')
          .select('*')
          .eq('user_id', user.id);
        
        setData({
          user_id: user.id,
          issue_submissions: {
            data: submissions,
            error: subError?.message,
            count: submissions?.length || 0
          },
          processed_issues: {
            data: processed,
            error: procError?.message,
            count: processed?.length || 0,
            tableExists: !procError || !procError.message?.includes('relation')
          }
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    checkDatabase();
  }, []);
  
  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Status Check</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-bold">User ID:</h2>
          <p className="font-mono text-sm">{data?.user_id}</p>
        </div>
        
        <div className="p-4 bg-blue-50 rounded">
          <h2 className="font-bold">issue_submissions table:</h2>
          <p>Count: {data?.issue_submissions?.count}</p>
          {data?.issue_submissions?.error && (
            <p className="text-red-600">Error: {data.issue_submissions.error}</p>
          )}
          <pre className="mt-2 text-xs overflow-auto bg-white p-2 rounded">
            {JSON.stringify(data?.issue_submissions?.data, null, 2)}
          </pre>
        </div>
        
        <div className="p-4 bg-green-50 rounded">
          <h2 className="font-bold">processed_issues table:</h2>
          <p>Table exists: {data?.processed_issues?.tableExists ? '✅ Yes' : '❌ No'}</p>
          <p>Count: {data?.processed_issues?.count}</p>
          {data?.processed_issues?.error && (
            <p className="text-red-600">Error: {data.processed_issues.error}</p>
          )}
          <pre className="mt-2 text-xs overflow-auto bg-white p-2 rounded">
            {JSON.stringify(data?.processed_issues?.data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}