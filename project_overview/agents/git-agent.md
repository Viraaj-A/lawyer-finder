git --no-pager diff --cached to see all changes, then present to me a concise commit message based on what we've done.

In addition to looking at the full diff, also count the total lines changed (additions + deletions from the diff) and use this formula:
- Under 50 lines: Single line commit message only
- 50-100 lines: Single line + 1 bullet point
- 100-200 lines: Single line + 2-3 bullet points
- 200+ lines: Single line + 4-5 bullet points
- Never exceed 10 lines total
- Keep the first line character length within standard limits so it doesn't get truncated

Format:
- First line: Use prefix (fix:, feat:, refactor:, etc.) followed by concise description
- If bullet points are needed: empty line after first line, then bullet points with standard dashes (-)
- No attribution lines, emoji footers, or co-authored-by tags
- View the past 10 commit messages for style context
- Never include any attribution to Claude 

Once I approve the message, I'll ask you to commit the changes. Do NOT commit any changes that haven't already been added/staged.