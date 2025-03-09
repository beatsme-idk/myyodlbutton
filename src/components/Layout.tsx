
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import WalletConnect from './WalletConnect';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold tracking-tight">
              BuyMeACoffee
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                to="/"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/") ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Home
              </Link>
              <Link
                to="/payment-history"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/payment-history") ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Payment Analytics
              </Link>
              <Link
                to="/profile"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/profile") ? "text-foreground" : "text-muted-foreground"
                )}
              >
                My Profile
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <WalletConnect />
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BuyMeACoffee. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground underline underline-offset-4"
            >
              Terms of Service
            </Link>
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground underline underline-offset-4"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
