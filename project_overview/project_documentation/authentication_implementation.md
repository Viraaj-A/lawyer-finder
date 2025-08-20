# Authentication Implementation Documentation

## Overview
This document outlines the Supabase authentication implementation for the LegalConnect NZ platform, completed on 2025-08-19.

## Architecture Decisions

### 1. File Structure Choice
**Decision**: Used `lib/supabase/` instead of `utils/supabase/`
- **Supabase Docs Convention**: `utils/supabase/`
- **Our Implementation**: `lib/supabase/`
- **Reasoning**: Follows Next.js convention where `lib/` contains utility functions and shared code
- **Note**: Both locations work identically - this is purely organizational preference

### 2. Server Actions vs API Routes
**Decision**: Created Server Actions (`app/actions/auth.ts`) instead of API routes
- **Not from Supabase docs** - this is a Next.js 14+ pattern
- **Benefits**:
  - Type-safe function calls
  - Automatic request/response handling
  - Built-in CSRF protection
  - Simpler than API routes
- **Alternative**: Could use API routes or direct client-side Supabase calls

## Implementation Components

### Core Supabase Setup

#### 1. Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### 2. Supabase Clients

**Browser Client** (`lib/supabase/client.ts`):
- Used in Client Components
- Handles browser-side authentication
- Manages auth tokens in browser cookies

**Server Client** (`lib/supabase/server.ts`):
- Used in Server Components and Server Actions
- Handles server-side authentication
- Manages cookies through Next.js cookie API

### Authentication Flow

#### 1. Middleware (`middleware.ts`)
**Purpose**: Automatically refresh auth tokens and protect routes
- Runs on every request
- Refreshes expired tokens
- Redirects unauthenticated users from `/dashboard` routes
- Updates response cookies

**Protected Routes**:
- `/dashboard/*` - Requires authentication

#### 2. Auth Provider (`components/auth/AuthProvider.tsx`)
**Purpose**: Provides auth context throughout the application
- Listens to auth state changes
- Provides `user`, `isAuthenticated`, and `isLoading` states
- Auto-syncs auth across browser tabs

#### 3. Server Actions (`app/actions/auth.ts`)
**Purpose**: Handle auth operations securely on the server

**Actions Created**:
- `login(formData)` - Email/password login
- `signup(formData)` - User registration
- `signOut()` - User logout
- `signInWithGoogle()` - OAuth Google login

**Note**: These are NOT from Supabase documentation. They're a Next.js pattern for handling form submissions securely.

#### 4. Auth Callback (`app/auth/callback/route.ts`)
**Purpose**: Handle OAuth redirects
- Exchanges auth codes for sessions
- Handles redirects from OAuth providers (Google, etc.)

### UI Components

#### 1. LoginForm (`components/auth/LoginForm.tsx`)
**Features**:
- Email/password input fields
- Google OAuth button
- Error handling
- Loading states
- Redirects to `/dashboard/user` on success

#### 2. LoginModal (`components/auth/LoginModal.tsx`)
**Features**:
- Dialog wrapper for LoginForm
- Closes automatically on successful login
- Triggered by LoginButton

#### 3. LoginButton (`components/auth/LoginButton.tsx`)
**Features**:
- Opens LoginModal when clicked
- Configurable styling through props
- Used in Header component

## Authentication Methods

### 1. Email/Password Authentication
- User enters email and password
- Validated through Supabase
- Session created on success
- Cookies set for persistence

### 2. Google OAuth
- User clicks "Continue with Google"
- Redirected to Google for authentication
- Returns to `/auth/callback` with auth code
- Session created from auth code

## Security Features

1. **Password Security**: Handled entirely by Supabase (bcrypt hashing)
2. **Session Management**: Automatic token refresh via middleware
3. **CSRF Protection**: Built into Server Actions
4. **Cookie Security**: HTTPOnly cookies for session storage
5. **Route Protection**: Middleware blocks unauthorized access

## Data Flow

```
User Login Request
    ↓
LoginForm (Client Component)
    ↓
Supabase Client Auth
    ↓
Auth State Change
    ↓
AuthProvider Updates
    ↓
User Redirected to Dashboard
```

## Files Created/Modified

### New Files
1. `lib/supabase/client.ts` - Browser Supabase client
2. `lib/supabase/server.ts` - Server Supabase client
3. `middleware.ts` - Auth middleware
4. `app/actions/auth.ts` - Server actions for auth
5. `app/auth/callback/route.ts` - OAuth callback handler
6. `components/ui/input.tsx` - Input component
7. `components/ui/label.tsx` - Label component
8. `components/ui/textarea.tsx` - Textarea component

### Modified Files
1. `components/auth/AuthProvider.tsx` - Integrated Supabase
2. `components/auth/LoginForm.tsx` - Added Supabase auth
3. `components/auth/LoginModal.tsx` - Added success callback
4. `app/layout.tsx` - Added AuthProvider wrapper
5. `package.json` - Added Supabase dependencies

## Dependencies Added
```json
"@supabase/ssr": "^0.6.1",
"@supabase/supabase-js": "^2.55.0"
```

## Setup Instructions

### 1. Supabase Project Setup
1. Create a Supabase project at https://app.supabase.com
2. Get your project URL and anon key from Settings → API
3. Add them to `.env.local`

### 2. Google OAuth Setup (Optional)
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add Google OAuth credentials
4. Set redirect URL to `your-domain/auth/callback`

### 3. Email Templates (Optional)
1. Go to Supabase Dashboard → Authentication → Email Templates
2. Customize confirmation emails
3. Update redirect URLs to match your domain

## Testing Checklist

- [ ] Email/password login works
- [ ] Google OAuth login works (if configured)
- [ ] Logout functionality works
- [ ] Protected routes redirect when not authenticated
- [ ] Auth persists on page refresh
- [ ] Auth syncs across browser tabs
- [ ] Error messages display correctly
- [ ] Loading states show during auth operations

## Common Issues & Solutions

### Issue: "Invalid API key"
**Solution**: Check `.env.local` has correct Supabase credentials

### Issue: Google login redirects to wrong URL
**Solution**: Update OAuth redirect URL in Supabase dashboard

### Issue: User stays logged in after logout
**Solution**: Clear browser cookies and check middleware is running

### Issue: Protected routes not redirecting
**Solution**: Ensure middleware.ts matcher includes your routes

## Future Enhancements

1. **Add Password Reset Flow**
   - Create password reset request page
   - Handle reset tokens
   - Update password page

2. **Add Email Verification**
   - Require email confirmation
   - Resend confirmation emails
   - Handle unverified users

3. **Add Role-Based Access**
   - Implement lawyer vs individual role checks
   - Create role-specific redirects
   - Add admin role support

4. **Add Social Logins**
   - Facebook OAuth
   - Apple Sign In
   - Microsoft OAuth

5. **Improve Error Handling**
   - More specific error messages
   - Retry logic for network errors
   - Better offline support