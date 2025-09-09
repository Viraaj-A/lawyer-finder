# Dynamic Form Conversion Logic

## Overview
This document describes how article data from the Supabase `articles` table is transformed into dynamic forms displayed to users after they select a relevant legal topic.

## Data Flow

```
User Query → Flask API → Legal Transformation → Article Search → Article Selection → Dynamic Form Generation
```

## Database Structure

### Articles Table Fields
- `article_id`: Unique identifier
- `original_title`: The exact title from the source (displayed in buttons)
- `original_url`: Link to original article
- `issue_title`: Processed title for the issue
- `issue_category`: Legal category
- `main_category`: Primary categorization
- `subcategory`: Secondary categorization
- `processed_result`: JSONB containing dynamic form data
- Boolean flags: `has_situation_checklist`, `has_lawyer_summary`, etc.

## Form Field Types and Rendering Logic

### 1. Information Panels (Priority: Top)
**Database Field**: `processed_result.information_panels`
**Structure**: Array of panel objects
```json
[
  {
    "type": "info" | "warning",
    "title": "Panel Title",
    "content": "Panel content text",
    "priority": 1
  }
]
```
**Rendering**:
- Full-width cards at the top of the form
- Blue background for "info" type
- Orange background for "warning" type
- Icon based on type (Info or AlertTriangle)
- Sorted by priority (ascending)

### 2. Situation Checklist
**Database Field**: `processed_result.situation_checklist`
**Structure**:
```json
{
  "description": "Check all that apply to your situation:",
  "items": [
    {
      "id": "unique_id",
      "label": "Checkbox label text",
      "importance": "high" | "medium" | "low",
      "helper_text": "Optional helper text"
    }
  ]
}
```
**Rendering**:
- Checkboxes with labels
- Importance badges (red for high, default for medium, gray for low)
- Helper text displayed below label when present

### 3. Actions Already Taken
**Database Field**: `processed_result.actions_taken`
**Structure**:
```json
{
  "description": "Which of these have you already done?",
  "items": [
    {
      "id": "unique_id",
      "label": "Action description",
      "helper_text": "Optional helper text"
    }
  ]
}
```
**Rendering**:
- Simple checkboxes
- Helper text when available

### 4. Documents Checklist
**Database Field**: `processed_result.documents_checklist`
**Structure**:
```json
{
  "description": "Which documents do you have?",
  "items": [
    {
      "id": "unique_id",
      "label": "Document name",
      "required": true | false,
      "helper_text": "Description of document"
    }
  ]
}
```
**Rendering**:
- Checkboxes with labels
- Red asterisk (*) for required documents
- Helper text below label

### 5. Timeline Check
**Database Field**: `processed_result.timeline_check`
**Structure**:
```json
{
  "description": "Timeline considerations:",
  "items": [
    {
      "id": "unique_id",
      "label": "Timeline item",
      "details": "Additional details"
    }
  ]
}
```
**Rendering**:
- Vertical timeline with orange left border
- Label as primary text
- Details as secondary text

### 6. Next Steps Checklist
**Database Field**: `processed_result.next_steps_checklist`
**Structure**:
```json
{
  "description": "Recommended next steps:",
  "items": [
    {
      "id": "unique_id",
      "label": "Step description",
      "order": 1,
      "urgency": "immediate" | "soon" | "eventual",
      "details": "Additional information"
    }
  ]
}
```
**Rendering**:
- Numbered circles (1, 2, 3, etc.)
- Urgency badges (red for immediate, gray for others)
- Details as secondary text
- Sorted by order field

### 7. Resolution Options
**Database Field**: `processed_result.resolution_options`
**Structure**:
```json
{
  "description": "Available resolution methods:",
  "items": [
    {
      "id": "unique_id",
      "label": "Resolution method name",
      "method": "Type of resolution",
      "body": "Organization name",
      "estimated_time": "Time estimate",
      "estimated_cost": "Cost estimate"
    }
  ]
}
```
**Rendering**:
- Card for each option
- Display only: label, method, and body
- Time and cost fields are excluded from display

### 8. Lawyer Summary (Not Rendered in Dynamic Form)
**Database Field**: `processed_result.lawyer_summary`
**Note**: This field exists in the database but is intentionally excluded from the dynamic form display. It contains:
- `key_legal_issues`: Array of legal issues
- `relevant_legislation`: Array of applicable laws
- `potential_claims`: Array of possible claims
- `critical_facts_needed`: Array of required facts

## Layout Structure

### Desktop Layout (≥768px)
```
┌─────────────────────────────────────┐
│     Information Panels (Full Width)  │
├─────────────────────────────────────┤
│  Section 1  │  Section 2  │ Section 3│
├─────────────────────────────────────┤
│  Section 4  │  Section 5  │ Section 6│
└─────────────────────────────────────┘
```

### Mobile Layout (<768px)
```
┌─────────────────────┐
│ Information Panels  │
├─────────────────────┤
│     Section 1       │
├─────────────────────┤
│     Section 2       │
├─────────────────────┤
│     Section 3       │
└─────────────────────┘
```

## State Management

### Checkbox State
- All checkboxes maintain state using a key format: `{fieldName}-{itemId}`
- State is stored as a boolean object: `{ "situation_checklist-item1": true, ... }`
- State is reset when a new article is selected

### Data Collection
When the form is submitted:
1. Collect all checked items
2. Group by field type
3. Send with article ID for processing

## Conditional Rendering

Each section only renders if:
1. The field exists in `processed_result`
2. The field has valid data (not null/undefined)
3. For arrays: contains at least one item
4. For objects with items: the items array has length > 0

## Error Handling

- If `processed_result` is null: Display "No form data available"
- If a field is missing: Skip that section silently
- If items array is empty: Skip that section
- Invalid data types: Use type checking with 'in' operator

## Implementation Notes

1. **Type Safety**: Use TypeScript interfaces for each field type
2. **Performance**: Memoize rendering functions for large forms
3. **Accessibility**: Ensure all checkboxes have proper labels and IDs
4. **Responsive**: Use CSS Grid with responsive breakpoints
5. **Validation**: Required fields should be validated before submission