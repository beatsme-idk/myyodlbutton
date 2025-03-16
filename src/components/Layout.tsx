import React, { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, Zap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
  showHero?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showHero = true }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-gradient-to-r from-slate-900 to-indigo-950">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl font-bold tracking-tight text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-indigo-400" />
              My Yodl Button
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6">
              <Link
                to="/"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/") ? "text-white" : "text-slate-300"
                )}
              >
                Home
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            {isMobile && (
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="ml-2 p-2 text-white"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobile && mobileMenuOpen && (
          <div className="container px-4 pb-3 border-b border-indigo-500/20 animate-fade-in">
            <nav className="flex flex-col gap-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary py-2",
                  isActive("/") ? "text-white" : "text-slate-300"
                )}
              >
                Home
              </Link>
            </nav>
          </div>
        )}
        
        {/* Hero Section */}
        {showHero && (
          <div className="container px-4 md:px-6 py-8 md:py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="animate-pulse-subtle inline-flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-glow">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gradient animate-fade-in px-2 mb-3">
              Create Beautiful Yodl Buttons
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto animate-fade-in-up delay-150 px-2">
              Design and share a sleek donation button in minutes and start accepting crypto tips and donations without any technical knowledge.
            </p>
          </div>
        )}
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t py-4 md:py-6 bg-slate-900">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs md:text-sm text-slate-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} My Yodl Button. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs md:text-sm font-medium text-slate-400 underline underline-offset-4 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/"
              className="text-xs md:text-sm font-medium text-slate-400 underline underline-offset-4 hover:text-white transition-colors"
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
