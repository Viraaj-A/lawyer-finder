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
├── signup/
│   └── page.tsx                   # Signup page (/signup)
│
├── onboarding/
│   ├── page.tsx                   # Role selection (/onboarding)
│   ├── individual/
│   │   └── page.tsx               # Individual form (/onboarding/individual)
│   └── lawyer/
│       └── page.tsx               # Lawyer form (/onboarding/lawyer)
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
│   └── page.tsx                   # Profile settings (/profile)
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
    ├── auth/                      # Authentication components
    │   ├── LoginModal.tsx        # Login popup modal
    │   ├── AuthProvider.tsx      # Authentication context
    │   └── LoginButton.tsx       # Login trigger button
    ├── VoiceInput.tsx            # Voice input component
    ├── Header.tsx                # Global header with login button
    ├── Footer.tsx                # Global footer
    └── ProtectedRoute.tsx        # Authentication wrapper
```

## Implementation Checklist

### Phase 1: Foundation & Core Layout
**Priority: HIGH - Build these first**

#### Core App Structure
- [ ] `app/layout.tsx` - Root layout with global providers
- [ ] `app/loading.tsx` - Global loading component
- [ ] `app/not-found.tsx` - 404 error page

#### Shared Components
- [ ] `components/Header.tsx` - Navigation header with login button
- [ ] `components/Footer.tsx` - Site footer
- [ ] `components/ProtectedRoute.tsx` - Authentication wrapper

### Phase 2: Authentication & Onboarding
**Priority: HIGH - User flow foundation**

#### Authentication
- [ ] `app/signup/` - Create signup folder
- [ ] `app/signup/page.tsx` - Signup page
- [ ] `components/auth/` - Create auth components folder
- [ ] `components/auth/LoginModal.tsx` - Login popup modal
- [ ] `components/auth/AuthProvider.tsx` - Authentication context
- [ ] `components/auth/LoginButton.tsx` - Login trigger button
- [ ] Update `components/Header.tsx` - Add login button integration

#### Onboarding Flow
- [ ] `app/onboarding/` - Create onboarding folder
- [ ] `app/onboarding/page.tsx` - Role selection page
- [ ] `app/onboarding/individual/` - Create individual folder
- [ ] `app/onboarding/individual/page.tsx` - Individual profile form
- [ ] `app/onboarding/lawyer/` - Create lawyer folder
- [ ] `app/onboarding/lawyer/page.tsx` - Lawyer profile form

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

### Next Steps
Start with Phase 1 to establish your foundation, then move through phases sequentially. Each phase builds on the previous one, ensuring a stable development process.