import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET individual issue
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: issue, error } = await supabase
      .from('processed_issues')
      .select(`
        *,
        submission:issue_submissions(
          text_input,
          file_metadata,
          created_at
        )
      `)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (error || !issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    return NextResponse.json({ issue });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update issue (edit title, description, or status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, status } = body;

    // Build update object with only provided fields
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) {
      // Validate status
      if (status !== 'active' && status !== 'closed') {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      updates.status = status;
    }

    // Ensure we have something to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Update the issue
    const { data: issue, error } = await supabase
      .from('processed_issues')
      .update(updates)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select(`
        *,
        submission:issue_submissions(
          text_input,
          file_metadata,
          created_at
        )
      `)
      .single();

    if (error) {
      console.error('Error updating issue:', error);
      return NextResponse.json({ error: 'Failed to update issue' }, { status: 500 });
    }

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    return NextResponse.json({ issue });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete an issue (soft delete by setting status to 'deleted' or hard delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Hard delete - removes the processed issue entirely
    // The raw submission remains in issue_submissions for audit purposes
    const { error } = await supabase
      .from('processed_issues')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting issue:', error);
      return NextResponse.json({ error: 'Failed to delete issue' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}