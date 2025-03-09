
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 py-4 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-slate-100 flex items-center">
            <span className="mr-2">✨</span>
            Buy Me a Coffee Button Creator
            <span className="ml-2 text-xs bg-slate-700/50 px-3 py-1 rounded-full font-medium">Beta</span>
          </h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-slate-900/50 backdrop-blur-xl border-t border-slate-800/50 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          <div className="flex justify-center space-x-4 mb-2">
            <Link to="/" className="hover:text-slate-100 transition-colors">Home</Link>
            <a href="#" className="hover:text-slate-100 transition-colors">Documentation</a>
            <a href="#" className="hover:text-slate-100 transition-colors">Support</a>
          </div>
          © {new Date().getFullYear()} Buy Me a Coffee Button Creator. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
