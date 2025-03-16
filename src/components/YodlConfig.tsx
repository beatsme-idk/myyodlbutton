import { useState, useEffect } from "react";
import { YodlPaymentConfig } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Info, AlertCircle } from "lucide-react";

interface YodlConfigProps {
  config: YodlPaymentConfig;
  onChange: (config: YodlPaymentConfig) => void;
}

// Available tokens and chains for Yodl
const AVAILABLE_TOKENS = ["ETH", "USDC", "USDT", "DAI", "USDM", "USDGLO"];
const AVAILABLE_CHAINS = [
  { id: "eth", name: "Ethereum" },
  { id: "arb1", name: "Arbitrum" },
  { id: "base", name: "Base" },
  { id: "oeth", name: "Optimism" },
  { id: "pol", name: "Polygon" }
];

const YodlConfig = ({ config, onChange }: YodlConfigProps) => {
  // Ensure default values are set
  useEffect(() => {
    // If tokens or chains are empty, set them to "all"
    const updatedConfig = { ...config };
    let updated = false;
    
    if (!config.tokens || config.tokens.length === 0) {
      updatedConfig.tokens = ["all"];
      updated = true;
    }
    
    if (!config.chains || config.chains.length === 0) {
      updatedConfig.chains = ["all"];
      updated = true;
    }
    
    if (updated) {
      onChange(updatedConfig);
    }
  }, []);
  
  const handleCurrencyChange = (value: string) => {
    onChange({ ...config, currency: value });
  };
  
  const handleAmountChange = (value: string) => {
    onChange({ ...config, amount: value });
  };
  
  const handleMemoChange = (value: string) => {
    onChange({ ...config, memo: value });
  };
  
  const handleTokenSelection = (token: string) => {
    let newTokens: string[] = [];
    
    if (token === "all") {
      // When "all" is selected, clear other selections
      newTokens = ["all"];
    } else {
      // If "all" was previously selected, replace it with just this token
      if (config.tokens.includes("all")) {
        newTokens = [token];
      } else {
        // Toggle the selected state of this token
        newTokens = config.tokens.includes(token)
          ? config.tokens.filter(t => t !== token)
          : [...config.tokens, token];
        
        // If no tokens are selected, default to "all"
        if (newTokens.length === 0) {
          newTokens = ["all"];
        }
      }
    }
    
    onChange({ ...config, tokens: newTokens });
  };
  
  const handleChainSelection = (chain: string) => {
    let newChains: string[] = [];
    
    if (chain === "all") {
      // When "all" is selected, clear other selections
      newChains = ["all"];
    } else {
      // If "all" was previously selected, replace it with just this chain
      if (config.chains.includes("all")) {
        newChains = [chain];
      } else {
        // Toggle the selected state of this chain
        newChains = config.chains.includes(chain)
          ? config.chains.filter(c => c !== chain)
          : [...config.chains, chain];
        
        // If no chains are selected, default to "all"
        if (newChains.length === 0) {
          newChains = ["all"];
        }
      }
    }
    
    onChange({ ...config, chains: newChains });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Currency</Label>
          <Select 
            value={config.currency} 
            onValueChange={handleCurrencyChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="JPY">JPY</SelectItem>
              <SelectItem value="CNY">CNY</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Amount (Optional)</Label>
          <Input
            type="text"
            placeholder="e.g. 10.00"
            value={config.amount}
            onChange={(e) => handleAmountChange(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Leave empty to let the user choose
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Memo (Optional)</Label>
        <Input
          type="text"
          placeholder="e.g. Thanks for your support!"
          value={config.memo}
          onChange={(e) => handleMemoChange(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Add a message that will be included with the payment
        </p>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Accepted Tokens</Label>
          <div className="text-xs text-slate-400 flex items-center">
            <Info size={12} className="mr-1" />
            Select specific tokens or accept all
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={config.tokens.includes("all") ? "default" : "outline"}
            size="sm"
            onClick={() => handleTokenSelection("all")}
            className="rounded-full"
          >
            All Tokens
          </Button>
          
          {AVAILABLE_TOKENS.map((token) => (
            <Button
              key={token}
              type="button"
              variant={config.tokens.includes(token) && !config.tokens.includes("all") ? "default" : "outline"}
              size="sm"
              onClick={() => handleTokenSelection(token)}
              className="rounded-full"
              disabled={config.tokens.includes("all")}
            >
              {token}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Accepted Chains</Label>
          <div className="text-xs text-slate-400 flex items-center">
            <Info size={12} className="mr-1" />
            Select specific chains or accept all
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={config.chains.includes("all") ? "default" : "outline"}
            size="sm"
            onClick={() => handleChainSelection("all")}
            className="rounded-full"
          >
            All Chains
          </Button>
          
          {AVAILABLE_CHAINS.map((chain) => (
            <Button
              key={chain.id}
              type="button"
              variant={config.chains.includes(chain.id) && !config.chains.includes("all") ? "default" : "outline"}
              size="sm"
              onClick={() => handleChainSelection(chain.id)}
              className="rounded-full"
              disabled={config.chains.includes("all")}
            >
              {chain.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YodlConfig;
