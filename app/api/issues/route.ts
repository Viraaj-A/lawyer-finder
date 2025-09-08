import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get query parameters for filtering
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status'); // 'active', 'closed', or null for all

  try {
    // First, get all submissions for this user
    const { data: allSubmissions } = await supabase
      .from('issue_submissions')
      .select('*')
      .eq('user_id', user.id);

    // Get all processed issues to find which submissions are already processed
    const { data: existingProcessed } = await supabase
      .from('processed_issues')
      .select('submission_id')
      .eq('user_id', user.id);

    // Find unprocessed submissions
    const processedSubmissionIds = new Set(existingProcessed?.map(p => p.submission_id) || []);
    const unprocessedSubmissions = allSubmissions?.filter(s => !processedSubmissionIds.has(s.id)) || [];

    // Process any unprocessed submissions
    if (unprocessedSubmissions.length > 0) {
      for (const submission of unprocessedSubmissions) {
        // Create a processed issue for each unprocessed submission
        const { error: insertError } = await supabase
          .from('processed_issues')
          .insert({
            submission_id: submission.id,
            user_id: submission.user_id,
            description: submission.text_input || '',
            title: submission.text_input 
              ? submission.text_input.split('\n')[0].substring(0, 100)
              : 'Untitled Issue'
          });
        
        if (insertError) {
          console.error('Error processing submission:', insertError);
        }
      }
    }

    // Build the query for processed issues
    let query = supabase
      .from('processed_issues')
      .select(`
        *,
        submission:issue_submissions(
          text_input,
          file_metadata,
          created_at
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply status filter if provided
    if (status && (status === 'active' || status === 'closed')) {
      query = query.eq('status', status);
    }

    const { data: issues, error } = await query;

    if (error) {
      console.error('Error fetching issues:', error);
      return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
    }

    return NextResponse.json({ issues: issues || [] });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Process a raw submission into a processed issue (manual trigger)
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { submission_id } = body;

    if (!submission_id) {
      return NextResponse.json({ error: 'submission_id is required' }, { status: 400 });
    }

    // Verify the submission belongs to the user
    const { data: submission, error: submissionError } = await supabase
      .from('issue_submissions')
      .select('*')
      .eq('id', submission_id)
      .eq('user_id', user.id)
      .single();

    if (submissionError || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Check if already processed
    const { data: existing } = await supabase
      .from('processed_issues')
      .select('id')
      .eq('submission_id', submission_id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Issue already processed' }, { status: 400 });
    }

    // Create processed issue
    const { data: processedIssue, error: createError } = await supabase
      .from('processed_issues')
      .insert({
        submission_id: submission.id,
        user_id: submission.user_id,
        description: submission.text_input || '',
        title: submission.text_input 
          ? submission.text_input.split('\n')[0].substring(0, 100)
          : 'Untitled Issue'
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating processed issue:', createError);
      return NextResponse.json({ error: 'Failed to process issue' }, { status: 500 });
    }

    return NextResponse.json({ issue: processedIssue }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}