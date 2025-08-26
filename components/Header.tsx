import Link from "next/link";
import { LoginButton } from "@/components/auth/LoginButton";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get user profile status if logged in
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('role, onboarding_completed')
      .eq('id', user.id)
      .single();
    profile = data;
  }
  
  // Get initials for avatar
  const getInitials = (email: string) => {
    const parts = email.split('@')[0].split('.');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };
  
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b px-10 py-3 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 text-primary">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
          </svg>
        </div>
        <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">
          LegalConnect NZ
        </h2>
      </div>
      
      <nav className="hidden md:flex items-center gap-8">
        <Link 
          href="/search" 
          className="text-sm font-medium leading-normal text-muted-foreground hover:text-primary transition-colors"
        >
          Find a lawyer
        </Link>
        <Link 
          href="/topics" 
          className="text-sm font-medium leading-normal text-muted-foreground hover:text-primary transition-colors"
        >
          Legal topics
        </Link>
        <Link 
          href="/how-it-works" 
          className="text-sm font-medium leading-normal text-muted-foreground hover:text-primary transition-colors"
        >
          How it works
        </Link>
        <Link 
          href="/pricing" 
          className="text-sm font-medium leading-normal text-muted-foreground hover:text-primary transition-colors"
        >
          Pricing
        </Link>
      </nav>
      
      {user ? (
        <div className="flex items-center space-x-4">
          {!profile?.onboarding_completed && (
            <Link href={!profile?.role ? '/onboarding' : profile.role === 'lawyer' ? '/onboarding/lawyer' : '/onboarding/individual'}>
              <Button variant="outline" size="sm" className="border-yellow-600 text-yellow-700 hover:bg-yellow-50">
                <AlertCircle className="h-4 w-4 mr-2" />
                Complete Profile
              </Button>
            </Link>
          )}
          
          {profile?.onboarding_completed && (
            <Link href={profile.role === 'lawyer' ? '/dashboard/lawyer' : '/dashboard/individual'}>
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
          )}
          
          <form action={signOut}>
            <Button variant="ghost" size="sm" type="submit">
              Sign out
            </Button>
          </form>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                {getInitials(user.email || '')}
              </span>
              {!profile?.onboarding_completed && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {profile?.role && (
                <p className="text-xs text-muted-foreground capitalize">
                  {profile.role} {!profile.onboarding_completed && '(Incomplete)'}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <LoginButton />
      )}
    </header>
  );
}