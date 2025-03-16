import React, { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl font-bold tracking-tight">
              My Yodl Button
            </Link>
            
            {/* Desktop Navigation - Removed Home button */}
            <nav className="hidden md:flex gap-6">
              {/* Navigation items can be added here if needed in the future */}
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            {isMobile && (
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="ml-2 p-2 text-foreground"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation - Removed Home button */}
        {isMobile && mobileMenuOpen && (
          <div className="container px-4 pb-3 border-b border-border/50 animate-fade-in">
            <nav className="flex flex-col gap-3">
              {/* Navigation items can be added here if needed in the future */}
            </nav>
          </div>
        )}
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t py-4 md:py-6">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} My Yodl Button. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs md:text-sm font-medium text-muted-foreground underline underline-offset-4"
            >
              Terms of Service
            </Link>
            <Link
              to="/"
              className="text-xs md:text-sm font-medium text-muted-foreground underline underline-offset-4"
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
