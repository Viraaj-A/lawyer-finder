import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Check all issue_submissions for this user
    const { data: submissions, error: subError } = await supabase
      .from('issue_submissions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (subError) {
      console.error('Error fetching submissions:', subError);
    }

    // 2. Check all processed_issues for this user
    const { data: processed, error: procError } = await supabase
      .from('processed_issues')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (procError) {
      console.error('Error fetching processed:', procError);
    }

    // 3. Find unprocessed submissions (those without matching processed_issues)
    const processedSubmissionIds = new Set(processed?.map(p => p.submission_id) || []);
    const unprocessed = submissions?.filter(s => !processedSubmissionIds.has(s.id)) || [];

    return NextResponse.json({
      user_id: user.id,
      submissions: {
        total: submissions?.length || 0,
        data: submissions || []
      },
      processed_issues: {
        total: processed?.length || 0,
        data: processed || []
      },
      unprocessed_submissions: {
        total: unprocessed.length,
        data: unprocessed
      }
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}