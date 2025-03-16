import { useState, useEffect } from "react";
import { YodlPaymentConfig } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Info, Coins, DollarSign, MessageSquare, ExternalLink } from "lucide-react";
import { AVAILABLE_TOKENS, AVAILABLE_CHAINS } from "@/utils/yodl";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface YodlConfigProps {
  config: YodlPaymentConfig;
  onChange: (config: YodlPaymentConfig) => void;
}

const YodlConfig = ({ config, onChange }: YodlConfigProps) => {
  const [selectedTokens, setSelectedTokens] = useState<string[]>(config.tokens || ["all"]);
  const [selectedChains, setSelectedChains] = useState<string[]>(config.chains || ["all"]);
  const [amount, setAmount] = useState<string>(config.amount || "");
  const [memo, setMemo] = useState<string>(config.memo || "");
  const [redirectUrl, setRedirectUrl] = useState<string>(config.redirectUrl || "");

  useEffect(() => {
    onChange({
      tokens: selectedTokens,
      chains: selectedChains,
      currency: "USD",
      amount,
      memo,
      redirectUrl
    });
  }, [selectedTokens, selectedChains, amount, memo, redirectUrl, onChange]);

  const toggleToken = (token: string) => {
    let newSelectedTokens: string[];
    
    if (token === "all") {
      newSelectedTokens = ["all"];
    } else {
      // If "all" is currently selected, remove it
      const withoutAll = selectedTokens.filter(t => t !== "all");
      
      if (withoutAll.includes(token)) {
        // Remove the token if it's already selected
        newSelectedTokens = withoutAll.filter(t => t !== token);
        // If no tokens left, default to "all"
        if (newSelectedTokens.length === 0) {
          newSelectedTokens = ["all"];
        }
      } else {
        // Add the token
        newSelectedTokens = [...withoutAll, token];
      }
    }
    
    setSelectedTokens(newSelectedTokens);
  };

  const toggleChain = (chain: string) => {
    let newSelectedChains: string[];
    
    if (chain === "all") {
      newSelectedChains = ["all"];
    } else {
      // If "all" is currently selected, remove it
      const withoutAll = selectedChains.filter(c => c !== "all");
      
      if (withoutAll.includes(chain)) {
        // Remove the chain if it's already selected
        newSelectedChains = withoutAll.filter(c => c !== chain);
        // If no chains left, default to "all"
        if (newSelectedChains.length === 0) {
          newSelectedChains = ["all"];
        }
      } else {
        // Add the chain
        newSelectedChains = [...withoutAll, chain];
      }
    }
    
    setSelectedChains(newSelectedChains);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleMemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemo(e.target.value);
  };

  const handleRedirectUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRedirectUrl(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base flex items-center gap-2">
              <Coins size={18} className="text-green-400" />
              Accepted Tokens
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-[250px]">
                    Select which tokens you want to accept. Default is "All tokens".
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Button
              type="button"
              variant={selectedTokens.includes("all") ? "default" : "outline"}
              size="sm"
              onClick={() => toggleToken("all")}
              className={`${selectedTokens.includes("all") ? "bg-green-600 hover:bg-green-700" : "bg-slate-800/50 border-slate-700 hover:bg-slate-700"} min-h-[40px]`}
            >
              All tokens
            </Button>
            
            {AVAILABLE_TOKENS.map(token => (
              <Button
                key={token.id}
                type="button"
                variant={selectedTokens.includes(token.id) && !selectedTokens.includes("all") ? "default" : "outline"}
                size="sm"
                onClick={() => toggleToken(token.id)}
                className={`${selectedTokens.includes(token.id) && !selectedTokens.includes("all") ? "bg-green-600 hover:bg-green-700" : "bg-slate-800/50 border-slate-700 hover:bg-slate-700"} min-h-[40px]`}
              >
                {token.name}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base flex items-center gap-2">
              <Coins size={18} className="text-green-400" />
              Accepted Chains
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-[250px]">
                    Select which blockchain networks you want to accept payments from. Default is "All chains".
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Button
              type="button"
              variant={selectedChains.includes("all") ? "default" : "outline"}
              size="sm"
              onClick={() => toggleChain("all")}
              className={`${selectedChains.includes("all") ? "bg-green-600 hover:bg-green-700" : "bg-slate-800/50 border-slate-700 hover:bg-slate-700"} min-h-[40px]`}
            >
              All chains
            </Button>
            
            {AVAILABLE_CHAINS.map(chain => (
              <Button
                key={chain.id}
                type="button"
                variant={selectedChains.includes(chain.id) && !selectedChains.includes("all") ? "default" : "outline"}
                size="sm"
                onClick={() => toggleChain(chain.id)}
                className={`${selectedChains.includes(chain.id) && !selectedChains.includes("all") ? "bg-green-600 hover:bg-green-700" : "bg-slate-800/50 border-slate-700 hover:bg-slate-700"} min-h-[40px]`}
              >
                {chain.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="amount" className="text-base flex items-center gap-2">
              <DollarSign size={18} className="text-green-400" />
              Payment Amount
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-[250px]">
                    Set a default amount for payments in USD. Leave empty for users to choose their own amount.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div>
            <Label htmlFor="amount" className="text-xs text-slate-400 mb-1 block">Amount (Optional)</Label>
            <Input
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="5.00"
              className="bg-slate-800/50 border-slate-700"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="memo" className="text-base flex items-center gap-2 whitespace-nowrap">
              <MessageSquare size={18} className="text-green-400" />
              Payment Memo <span className="text-sm opacity-70">(Optional)</span>
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-[250px]">
                    Add an optional memo that will be included with the payment. Leave empty by default.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Input
            id="memo"
            value={memo}
            onChange={handleMemoChange}
            placeholder="Optional message to include with payment"
            className="bg-slate-800/50 border-slate-700"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="redirectUrl" className="text-base flex items-center gap-2">
            <ExternalLink size={18} className="text-green-400" />
            Custom Thank You Page URL
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Info size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-[250px]">
                  After payment, users will be redirected to this custom thank you page. Leave empty to use the default thank you page you've configured.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Input
          id="redirectUrl"
          value={redirectUrl}
          onChange={handleRedirectUrlChange}
          placeholder="https://example.com/thank-you"
          className="bg-slate-800/50 border-slate-700"
        />
      </div>
    </div>
  );
};

export default YodlConfig;
