
import { useState, useEffect } from "react";
import { YodlPaymentConfig } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet } from "lucide-react";

const SUPPORTED_TOKENS = [
  { value: "USDC", label: "USDC" },
  { value: "USDT", label: "USDT" },
  { value: "ETH", label: "ETH" },
  { value: "DAI", label: "DAI" },
  { value: "USDGLO", label: "USDGLO" },
  { value: "USDM", label: "USDM" }
];

const SUPPORTED_CHAINS = [
  { id: "eth", name: "Ethereum" },
  { id: "base", name: "Base" },
  { id: "oeth", name: "Optimism" },
  { id: "arb1", name: "Arbitrum" },
  { id: "pol", name: "Polygon" }
];

interface YodlConfigProps {
  config: YodlPaymentConfig;
  onChange: (config: YodlPaymentConfig) => void;
}

const YodlConfig = ({ config, onChange }: YodlConfigProps) => {
  const [selectedTokens, setSelectedTokens] = useState<string[]>(
    Array.isArray(config.tokens) ? config.tokens : []
  );
  
  const [selectedChains, setSelectedChains] = useState<string[]>(
    Array.isArray(config.chains) ? config.chains : []
  );

  const updateConfig = (key: keyof YodlPaymentConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const handleTokenSelection = (token: string) => {
    let newSelectedTokens: string[];
    
    if (token === 'all') {
      newSelectedTokens = ['all'];
    } else {
      if (selectedTokens.includes('all')) {
        newSelectedTokens = [token];
      } else {
        newSelectedTokens = selectedTokens.includes(token)
          ? selectedTokens.filter(t => t !== token)
          : [...selectedTokens, token];
      }
    }
    
    setSelectedTokens(newSelectedTokens);
    updateConfig("tokens", newSelectedTokens);
  };

  const handleChainSelection = (chain: string) => {
    let newSelectedChains: string[];
    
    if (chain === 'all') {
      newSelectedChains = ['all'];
    } else {
      if (selectedChains.includes('all')) {
        newSelectedChains = [chain];
      } else {
        newSelectedChains = selectedChains.includes(chain)
          ? selectedChains.filter(c => c !== chain)
          : [...selectedChains, chain];
      }
    }
    
    setSelectedChains(newSelectedChains);
    updateConfig("chains", newSelectedChains);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center bg-green-900/20 border border-green-500/20 p-3 rounded-lg">
        <div className="w-5 h-5 mr-2 relative">
          <img 
            src="https://yodl.me/_next/static/media/new_logo.be0c2fdb.svg" 
            alt="Yodl Logo"
            className="w-full h-full drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]"
          />
        </div>
        <span className="text-green-400 text-sm">Yodl payments configuration</span>
      </div>

      <div className="space-y-3">
        <Label className="block text-sm font-medium mb-2">
          Accepted Tokens
        </Label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTokenSelection('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedTokens.includes('all')
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-100 text-indigo-800 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            All Tokens
          </button>
          {SUPPORTED_TOKENS.map((token) => (
            <button
              key={token.value}
              onClick={() => handleTokenSelection(token.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedTokens.includes(token.value) && !selectedTokens.includes('all')
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-100 text-indigo-800 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {token.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400">
          Select the tokens you want to accept for payments
        </p>
      </div>
      
      <div className="space-y-3">
        <Label className="block text-sm font-medium mb-2">
          Supported Chains
        </Label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleChainSelection('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedChains.includes('all')
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-100 text-indigo-800 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            All Networks
          </button>
          {SUPPORTED_CHAINS.map((chain) => (
            <button
              key={chain.id}
              onClick={() => handleChainSelection(chain.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedChains.includes(chain.id) && !selectedChains.includes('all')
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-100 text-indigo-800 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {chain.name}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400">
          Select the blockchains you want to support for payments
        </p>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="currency">Currency for Amount</Label>
        <Select
          value={config.currency}
          onValueChange={(value) => updateConfig("currency", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="JPY">JPY</SelectItem>
            <SelectItem value="GBP">GBP</SelectItem>
            <SelectItem value="AUD">AUD</SelectItem>
            <SelectItem value="CAD">CAD</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="amount">
          Default Amount (optional)
        </Label>
        <Input
          id="amount"
          type="text"
          inputMode="decimal"
          value={config.amount}
          onChange={(e) => updateConfig("amount", e.target.value)}
          placeholder="5.00"
        />
        <p className="text-xs text-slate-400">
          Leaving this empty will let the sender choose any amount
        </p>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="memo">
          Payment Memo (optional)
        </Label>
        <Textarea
          id="memo"
          value={config.memo || ""}
          onChange={(e) => updateConfig("memo", e.target.value)}
          placeholder="Thanks for the coffee!"
        />
        <p className="text-xs text-slate-400">
          This will be shown to the sender as a default memo
        </p>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="redirectUrl">
          Redirect URL After Payment (optional)
        </Label>
        <Input
          id="redirectUrl"
          type="text"
          value={config.redirectUrl || ""}
          onChange={(e) => updateConfig("redirectUrl", e.target.value)}
          placeholder={`https://myyodlbutton.lovable.app/thank-you/${window.location.pathname.split('/').pop() || 'your-slug'}`}
        />
        <p className="text-xs text-slate-400">
          After payment completion, users will be redirected to this URL
        </p>
      </div>
    </div>
  );
};

export default YodlConfig;
