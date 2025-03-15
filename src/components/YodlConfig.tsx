
import { useState } from "react";
import { YodlPaymentConfig } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const SUPPORTED_TOKENS = [
  { value: "USDC", label: "USDC" },
  { value: "USDT", label: "USDT" },
  { value: "ETH", label: "ETH" },
  { value: "DAI", label: "DAI" },
  { value: "USDGLO", label: "USDGLO" },
  { value: "USDM", label: "USDM" },
  { value: "CRVUSD", label: "CRVUSD" },
  { value: "XDAI", label: "XDAI" },
  { value: "WXDAI", label: "WXDAI" },
];

const SUPPORTED_CHAINS = [
  { value: "mainnet", label: "Ethereum" },
  { value: "base", label: "Base" },
  { value: "optimism", label: "Optimism" },
  { value: "arbitrum", label: "Arbitrum" },
  { value: "polygon", label: "Polygon" },
  { value: "oeth", label: "Optimism ETH" },
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

  const toggleToken = (value: string) => {
    const newSelectedTokens = selectedTokens.includes(value)
      ? selectedTokens.filter(token => token !== value)
      : [...selectedTokens, value];
      
    setSelectedTokens(newSelectedTokens);
    updateConfig("tokens", newSelectedTokens);
  };

  const toggleChain = (value: string) => {
    const newSelectedChains = selectedChains.includes(value)
      ? selectedChains.filter(chain => chain !== value)
      : [...selectedChains, value];
      
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
        <Label htmlFor="tokens">
          Accepted Tokens
        </Label>
        <div className="border border-input bg-background rounded-md p-3">
          <div className="grid grid-cols-3 gap-2">
            {SUPPORTED_TOKENS.map((token) => (
              <div key={token.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`token-${token.value}`}
                  checked={selectedTokens.includes(token.value)}
                  onCheckedChange={() => toggleToken(token.value)}
                />
                <Label 
                  htmlFor={`token-${token.value}`}
                  className="text-sm cursor-pointer"
                >
                  {token.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Select the tokens you want to accept for payments
        </p>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="chains">
          Supported Chains
        </Label>
        <div className="border border-input bg-background rounded-md p-3">
          <div className="grid grid-cols-2 gap-2">
            {SUPPORTED_CHAINS.map((chain) => (
              <div key={chain.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`chain-${chain.value}`}
                  checked={selectedChains.includes(chain.value)}
                  onCheckedChange={() => toggleChain(chain.value)}
                />
                <Label 
                  htmlFor={`chain-${chain.value}`}
                  className="text-sm cursor-pointer"
                >
                  {chain.label}
                </Label>
              </div>
            ))}
          </div>
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
          value={config.memo}
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
