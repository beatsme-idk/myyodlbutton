
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const NotFound = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center py-12 bg-slate-800/30 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-700/50 max-w-md mx-auto">
          <svg className="w-16 h-16 mx-auto mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Page Not Found</h2>
          <p className="text-slate-400 mb-6">The page you are looking for doesn't exist or has been moved.</p>
          <Link to="/" className="inline-flex items-center px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-all transform hover:scale-105">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Return Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
