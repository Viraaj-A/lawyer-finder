'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function submitIssue(formData: {
  text: string;
}) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'You must be logged in to submit an issue' };
  }
  
  // Get user's individual profile
  const { data: profile } = await supabase
    .from('individual_profiles')
    .select('id')
    .eq('id', user.id)
    .single();
    
  if (!profile) {
    return { error: 'Please complete your profile first' };
  }
  
  // Insert the submission
  const { data, error } = await supabase
    .from('issue_submissions')
    .insert({
      user_id: user.id,
      text_input: formData.text
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error submitting issue:', error);
    return { error: 'Failed to submit issue. Please try again.' };
  }
  
  return { 
    success: true, 
    issueId: data.id,
    message: 'Issue submitted successfully!' 
  };
}