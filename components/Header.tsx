import Link from "next/link";
import { LoginButton } from "@/components/auth/LoginButton";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
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
          <form action={signOut}>
            <Button variant="ghost" size="sm" type="submit">
              Sign out
            </Button>
          </form>
          <div className="flex items-center space-x-3">
            <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
              {getInitials(user.email || '')}
            </span>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      ) : (
        <LoginButton />
      )}
    </header>
  );
}