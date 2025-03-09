
import PaymentHistory from "@/components/PaymentHistory";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentHistoryPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-gradient">
              Payment Analytics
            </h1>
            <div className="w-6 h-6">
              <img 
                src="https://yodl.me/_next/static/media/new_logo.be0c2fdb.svg" 
                alt="Yodl"
                className="w-full h-full drop-shadow-[0_0_3px_rgba(255,255,255,0.4)]"
              />
            </div>
          </div>
          <p className="text-slate-400 mt-1">
            Track goals, view transaction details, and manage your payment history
          </p>
        </div>
        
        <div className="animate-fade-in">
          <PaymentHistory />
        </div>
      </div>
    </Layout>
  );
};

export default PaymentHistoryPage;
