# Legal Marketplace - Project Structure & Implementation Checklist

## Complete Folder Structure

```
app/
├── globals.css                     # Global styles ✅ (exists)
├── layout.tsx                      # Root layout
├── page.tsx                        # Landing page (/) ✅ (exists)
├── loading.tsx                     # Global loading UI
├── not-found.tsx                   # 404 page
│
├── login/
│   └── page.tsx                   # Login/signup page (/login) ✅ (exists, unified modal)
│
├── onboarding/
│   ├── page.tsx                   # Role selection (/onboarding) ✅ (exists, saves role to DB)
│   ├── individual/
│   │   └── page.tsx               # Individual profile form (/onboarding/individual) ✅ (exists, saves to DB)
│   └── lawyer/
│       └── page.tsx               # Lawyer profile form (/onboarding/lawyer) - future
│
├── search/
│   ├── page.tsx                   # Lawyer search (/search)
│   └── components/                # Search-specific components
│       ├── SearchFilters.tsx
│       └── LawyerCard.tsx
│
├── lawyers/
│   └── [id]/
│       ├── page.tsx               # Lawyer profile (/lawyers/[id])
│       └── loading.tsx            # Loading state for lawyer profile
│
├── dashboard/
│   ├── user/
│   │   └── page.tsx               # User dashboard (/dashboard/user)
│   ├── lawyer/
│   │   └── page.tsx               # Lawyer dashboard (/dashboard/lawyer)
│   └── layout.tsx                 # Dashboard layout with navigation
│
├── issues/
│   └── [id]/
│       ├── page.tsx               # Issue review (/issues/[id])
│       └── components/
│           ├── IssueDetails.tsx
│           └── LawyerList.tsx
│
├── profile/
│   └── page.tsx                   # Profile settings (/profile) - future
│
├── messages/
│   ├── page.tsx                   # Messages overview (/messages)
│   └── [conversationId]/
│       └── page.tsx               # Individual conversation (/messages/[id])
│
├── help/
│   └── page.tsx                   # Help page (/help)
│
├── api/                           # API routes
│   ├── auth/
│   │   └── route.ts              # Authentication endpoints
│   ├── lawyers/
│   │   ├── route.ts              # GET /api/lawyers
│   │   └── [id]/
│   │       └── route.ts          # GET /api/lawyers/[id]
│   ├── issues/
│   │   ├── route.ts              # POST /api/issues
│   │   └── [id]/
│   │       └── route.ts          # GET/PATCH /api/issues/[id]
│   └── search/
│       └── route.ts              # POST /api/search
│
└── components/                    # Shared components
    ├── ui/                        # Shadcn/ui components ✅ (exists)
    ├── auth/                      # Authentication components ✅ (exists)
    │   ├── LoginModal.tsx        # Login/signup modal ✅ (exists)
    │   └── LoginButton.tsx       # Login trigger button ✅ (exists)
    ├── profile/                   # Profile components ✅ (exists)
    │   ├── language-selector.tsx # Language multi-select ✅ (exists)
    │   └── location-autocomplete.tsx # Google Places autocomplete ✅ (exists)
    ├── VoiceInput.tsx            # Voice input component
    ├── Header.tsx                # Global header with auth state ✅ (exists)
    ├── Footer.tsx                # Global footer ✅ (exists)
    └── ProtectedRoute.tsx        # Authentication wrapper
```

## Implementation Checklist

### Phase 1: Foundation & Core Layout
**Priority: HIGH - Build these first**

#### Core App Structure
- [x] `app/layout.tsx` - Root layout ✅ (exists)
- [ ] `app/loading.tsx` - Global loading component
- [ ] `app/not-found.tsx` - 404 error page

#### Shared Components
- [x] `components/Header.tsx` - Navigation header with auth state ✅ (exists)
- [x] `components/Footer.tsx` - Site footer ✅ (exists)
- [ ] `components/ProtectedRoute.tsx` - Authentication wrapper

### Phase 2: Authentication & Onboarding
**Priority: HIGH - User flow foundation**

#### Authentication
- [x] `app/login/` - Login page folder ✅ (exists)
- [x] `app/login/page.tsx` - Unified login/signup page ✅ (exists)
- [x] `components/auth/` - Auth components folder ✅ (exists)
- [x] `components/auth/LoginModal.tsx` - Login/signup modal ✅ (exists)
- [x] `components/auth/LoginButton.tsx` - Login trigger button ✅ (exists)
- [x] `app/actions/auth.ts` - Server actions for auth ✅ (exists)
- [x] `app/auth/callback/route.ts` - OAuth callback ✅ (exists)
- [x] `middleware.ts` - Route protection ✅ (exists)
- [x] `lib/supabase/` - Supabase client setup ✅ (exists)
- [x] Update `components/Header.tsx` - Shows auth state ✅ (completed)

#### Onboarding Flow
- [x] `app/onboarding/` - Create onboarding folder ✅
- [x] `app/onboarding/page.tsx` - Role selection (saves to profiles table) ✅
- [x] `app/onboarding/individual/` - Individual profile folder ✅
- [x] `app/onboarding/individual/page.tsx` - Individual profile form (saves to individual_profiles table) ✅
- [x] `components/profile/language-selector.tsx` - Multi-select language component ✅
- [x] `components/profile/location-autocomplete.tsx` - Google Places autocomplete ✅
- [x] **Database Schema**: profiles + individual_profiles tables with RLS ✅
- [ ] `app/onboarding/lawyer/` - Lawyer folder (future)
- [ ] `app/onboarding/lawyer/page.tsx` - Lawyer profile form (future)

### Phase 3: Core Features
**Priority: MEDIUM - Main functionality**

#### Landing Page Enhancements
- [ ] `components/VoiceInput.tsx` - Voice input component
- [ ] Update `app/page.tsx` - Enhance with voice input functionality

#### Search Functionality
- [ ] `app/search/` - Create search folder
- [ ] `app/search/page.tsx` - Lawyer search page
- [ ] `app/search/components/` - Create search components folder
- [ ] `app/search/components/SearchFilters.tsx` - Search filters component
- [ ] `app/search/components/LawyerCard.tsx` - Lawyer card component

#### Lawyer Profiles
- [ ] `app/lawyers/` - Create lawyers folder
- [ ] `app/lawyers/[id]/` - Create dynamic id folder
- [ ] `app/lawyers/[id]/page.tsx` - Individual lawyer profile
- [ ] `app/lawyers/[id]/loading.tsx` - Loading state for lawyer profiles

### Phase 4: User Dashboards
**Priority: MEDIUM - User management**

#### Dashboard Structure
- [ ] `app/dashboard/` - Create dashboard folder
- [ ] `app/dashboard/layout.tsx` - Dashboard navigation layout
- [ ] `app/dashboard/user/` - Create user dashboard folder
- [ ] `app/dashboard/user/page.tsx` - User dashboard page
- [ ] `app/dashboard/lawyer/` - Create lawyer dashboard folder
- [ ] `app/dashboard/lawyer/page.tsx` - Lawyer dashboard page

#### Profile Management
- [ ] `app/profile/` - Create profile folder
- [ ] `app/profile/page.tsx` - Profile settings page

### Phase 5: Legal Issues & Communication
**Priority: MEDIUM - Core workflow**

#### Legal Issues
- [ ] `app/issues/` - Create issues folder
- [ ] `app/issues/[id]/` - Create dynamic id folder
- [ ] `app/issues/[id]/page.tsx` - Issue review page
- [ ] `app/issues/[id]/components/` - Create issue components folder
- [ ] `app/issues/[id]/components/IssueDetails.tsx` - Issue details component
- [ ] `app/issues/[id]/components/LawyerList.tsx` - Lawyer list component

#### Messaging System
- [ ] `app/messages/` - Create messages folder
- [ ] `app/messages/page.tsx` - Messages overview page
- [ ] `app/messages/[conversationId]/` - Create conversation folder
- [ ] `app/messages/[conversationId]/page.tsx` - Individual conversation page

### Phase 6: Support & API
**Priority: LOW - Additional features**

#### Support
- [ ] `app/help/` - Create help folder
- [ ] `app/help/page.tsx` - Help and support page

#### API Routes
- [ ] `app/api/` - Create API folder
- [ ] `app/api/auth/` - Create auth API folder
- [ ] `app/api/auth/route.ts` - Authentication endpoints
- [ ] `app/api/lawyers/` - Create lawyers API folder
- [ ] `app/api/lawyers/route.ts` - Lawyers list endpoint
- [ ] `app/api/lawyers/[id]/` - Create dynamic lawyer API folder
- [ ] `app/api/lawyers/[id]/route.ts` - Individual lawyer endpoint
- [ ] `app/api/issues/` - Create issues API folder
- [ ] `app/api/issues/route.ts` - Issues endpoints
- [ ] `app/api/issues/[id]/` - Create dynamic issue API folder
- [ ] `app/api/issues/[id]/route.ts` - Individual issue endpoint
- [ ] `app/api/search/` - Create search API folder
- [ ] `app/api/search/route.ts` - Search endpoint

## Quick Reference

### File Types & Purposes
- **`page.tsx`** - Makes a route publicly accessible
- **`layout.tsx`** - Wraps child routes with shared UI
- **`loading.tsx`** - Loading UI for async operations
- **`route.ts`** - API endpoints
- **`[param]`** - Dynamic route segments
- **`(group)`** - Route grouping without URL impact

### Recommended Implementation Order
1. **Foundation** (Phase 1) - Get basic structure working
2. **Auth Flow** (Phase 2) - Enable user registration/login
3. **Core Pages** (Phase 3) - Landing, search, lawyer profiles
4. **Dashboards** (Phase 4) - User and lawyer management
5. **Workflow** (Phase 5) - Legal issues and messaging
6. **Polish** (Phase 6) - Support and API optimization

## Database Schema (Supabase)

### Implemented Tables
- **`profiles`** - Main user profiles (1:1 with auth.users)
  - `id` (uuid, FK to auth.users)
  - `role` ('individual' | 'lawyer' | null)  
  - `onboarding_completed` (boolean, default false)
  - Auto-created on user signup via trigger

- **`individual_profiles`** - Individual user data (1:1 with profiles where role='individual')
  - `id` (uuid, FK to profiles)
  - `first_name`, `last_name` (text)
  - `age` (integer), `gender` (text)
  - `location` (text) - suburb/city format
  - `languages` (text[]) - array of languages
  - `accessibility_needs` (text[]) - array of accessibility requirements

### Row Level Security
- Users can only read/write their own profile data
- Policies enforced on both tables

## Authentication Flow
1. **Signup** → Creates auth.users record → Trigger creates profiles record → Redirects to onboarding
2. **Onboarding** → User selects role → Saves to profiles.role → Redirects to role-specific form  
3. **Profile Form** → Individual fills profile → Saves to individual_profiles → Marks onboarding_completed=true
4. **Future Logins** → Checks onboarding_completed → Redirects completed users to home, incomplete to onboarding

### Next Steps
Start with Phase 1 to establish your foundation, then move through phases sequentially. Each phase builds on the previous one, ensuring a stable development process.