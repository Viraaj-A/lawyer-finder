import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load environment variables manually
const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
const envVars: Record<string, string> = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function processUnprocessedIssues() {
  console.log('Starting issue processing...');
  
  // Get all issue_submissions
  const { data: submissions, error: subError } = await supabase
    .from('issue_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (subError) {
    console.error('Error fetching submissions:', subError);
    return;
  }

  console.log(`Found ${submissions?.length || 0} total submissions`);

  // Get all processed_issues
  const { data: processed, error: procError } = await supabase
    .from('processed_issues')
    .select('*');

  if (procError) {
    console.error('Error fetching processed issues:', procError);
    return;
  }

  console.log(`Found ${processed?.length || 0} processed issues`);

  // Find unprocessed submissions
  const processedSubmissionIds = new Set(processed?.map(p => p.submission_id) || []);
  const unprocessed = submissions?.filter(s => !processedSubmissionIds.has(s.id)) || [];

  console.log(`Found ${unprocessed.length} unprocessed submissions`);

  // Process each unprocessed submission
  for (const submission of unprocessed) {
    console.log(`Processing submission ${submission.id} from user ${submission.user_id}`);
    
    const { data, error } = await supabase
      .from('processed_issues')
      .insert({
        submission_id: submission.id,
        user_id: submission.user_id,
        title: submission.text_input 
          ? submission.text_input.split('\n')[0].substring(0, 100)
          : 'Untitled Issue',
        description: submission.text_input || '',
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error(`Error processing submission ${submission.id}:`, error);
    } else {
      console.log(`Successfully processed submission ${submission.id} -> issue ${data.id}`);
    }
  }

  console.log('Processing complete!');
}

// Run the script
processUnprocessedIssues().catch(console.error);