import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-10 py-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Link 
              href="/about" 
              className="text-sm font-normal text-muted-foreground hover:text-primary transition-colors"
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-normal text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link 
              href="/privacy" 
              className="text-sm font-normal text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-sm font-normal text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 LegalConnect NZ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}