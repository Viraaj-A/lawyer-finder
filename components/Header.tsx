"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/LoginButton";

export function Header() {
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
      
      <LoginButton />
    </header>
  );
}