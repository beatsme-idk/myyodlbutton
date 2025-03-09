
import { useState, useEffect } from "react";
import { YodlPaymentConfig } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ChevronDown, Plus, Trash2, AlertTriangle, ExternalLink, Check } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAccount } from "wagmi";
import { parseYodlConfigFromENS } from "@/utils/yodl";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

// Predefined lists of tokens and chains
const SUPPORTED_TOKENS = [
  { value: "USDC", label: "USDC" },
  { value: "USDT", label: "USDT" },
  { value: "ETH", label: "ETH" },
  { value: "WETH", label: "WETH" },
  { value: "DAI", label: "DAI" },
  { value: "WBTC", label: "WBTC" },
  { value: "MATIC", label: "MATIC" },
  { value: "OP", label: "OP" },
  { value: "ARB", label: "ARB" },
];

const SUPPORTED_CHAINS = [
  { value: "mainnet", label: "Ethereum" },
  { value: "base", label: "Base" },
  { value: "optimism", label: "Optimism" },
  { value: "arbitrum", label: "Arbitrum" },
  { value: "polygon", label: "Polygon" },
  { value: "avalanche", label: "Avalanche" },
  { value: "zora", label: "Zora" },
  { value: "oeth", label: "Optimism ETH" },
];

interface YodlConfigProps {
  config: YodlPaymentConfig;
  onChange: (config: YodlPaymentConfig) => void;
}

const YodlConfig = ({ config, onChange }: YodlConfigProps) => {
  const [loading, setLoading] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [webhooks, setWebhooks] = useState<string[]>(config.webhooks || []);
  const { address, isConnected } = useAccount();
  
  // Selected tokens and chains state
  const [selectedTokens, setSelectedTokens] = useState<string[]>(
    config.tokens ? config.tokens.split(',').map(token => token.trim()) : []
  );
  const [selectedChains, setSelectedChains] = useState<string[]>(
    config.chains ? config.chains.split(',').map(chain => chain.trim()) : []
  );
  
  // Fetch Yodl preferences from ENS
  useEffect(() => {
    if (isConnected && address) {
      const fetchYodlConfig = async () => {
        setLoading(true);
        try {
          const ensYodlConfig = await parseYodlConfigFromENS(address);
          if (ensYodlConfig) {
            // Merge ENS config with current config but keep enabled always true
            onChange({
              ...config,
              ...ensYodlConfig,
              enabled: true,
              // Keep webhooks from current config if not provided in ENS
              webhooks: ensYodlConfig.webhooks || config.webhooks || []
            });
            
            setWebhooks(ensYodlConfig.webhooks || config.webhooks || []);
            
            // Update selected tokens and chains
            if (ensYodlConfig.tokens) {
              setSelectedTokens(ensYodlConfig.tokens.split(',').map(token => token.trim()));
            }
            
            if (ensYodlConfig.chains) {
              setSelectedChains(ensYodlConfig.chains.split(',').map(chain => chain.trim()));
            }
            
            toast({
              title: "Yodl preferences loaded",
              description: "Your Yodl payment preferences have been loaded from ENS",
            });
          }
        } catch (error) {
          console.error("Error fetching Yodl preferences:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchYodlConfig();
    }
  }, [isConnected, address]);

  const updateConfig = (key: keyof YodlPaymentConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const handleAddWebhook = () => {
    const newWebhooks = [...webhooks, ""];
    setWebhooks(newWebhooks);
    updateConfig("webhooks", newWebhooks);
  };

  const handleWebhookChange = (index: number, value: string) => {
    const newWebhooks = [...webhooks];
    newWebhooks[index] = value;
    setWebhooks(newWebhooks);
    updateConfig("webhooks", newWebhooks);
  };

  const handleRemoveWebhook = (index: number) => {
    const newWebhooks = webhooks.filter((_, i) => i !== index);
    setWebhooks(newWebhooks);
    updateConfig("webhooks", newWebhooks);
  };
  
  // Handle token selection
  const toggleToken = (value: string) => {
    const newSelectedTokens = selectedTokens.includes(value)
      ? selectedTokens.filter(token => token !== value)
      : [...selectedTokens, value];
      
    setSelectedTokens(newSelectedTokens);
    updateConfig("tokens", newSelectedTokens.join(','));
  };
  
  // Handle chain selection
  const toggleChain = (value: string) => {
    const newSelectedChains = selectedChains.includes(value)
      ? selectedChains.filter(chain => chain !== value)
      : [...selectedChains, value];
      
    setSelectedChains(newSelectedChains);
    updateConfig("chains", newSelectedChains.join(','));
  };

  return (
    <div className="space-y-6">
      {/* Yodl is now always enabled, showing info with new logo */}
      <div className="flex items-center bg-green-900/20 border border-green-500/20 p-3 rounded-lg">
        <div className="w-5 h-5 mr-2 relative">
          <img 
            src="https://yodl.me/_next/static/media/new_logo.be0c2fdb.svg" 
            alt="Yodl Logo"
            className="w-full h-full drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]"
          />
        </div>
        <span className="text-green-400 text-sm">Yodl payments enabled</span>
      </div>

      {loading ? (
        <div className="text-center py-6">
          <div className="animate-spin mx-auto w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full" />
          <p className="text-sm text-slate-400 mt-2">Fetching your Yodl preferences...</p>
        </div>
      ) : (
        <>
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
            {selectedTokens.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedTokens.map(token => (
                  <Badge key={token} variant="secondary" className="gap-1">
                    {token}
                    <button 
                      type="button" 
                      className="ml-1 rounded-full text-xs"
                      onClick={() => toggleToken(token)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
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
            {selectedChains.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedChains.map(chain => (
                  <Badge key={chain} variant="secondary" className="gap-1">
                    {SUPPORTED_CHAINS.find(c => c.value === chain)?.label || chain}
                    <button 
                      type="button" 
                      className="ml-1 rounded-full text-xs"
                      onClick={() => toggleChain(chain)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
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
          
          <Collapsible 
            open={showAdvancedOptions} 
            onOpenChange={setShowAdvancedOptions}
            className="border border-slate-700/50 rounded-lg p-4"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <span className="font-medium">Advanced Options</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedOptions ? "transform rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Webhook URLs (optional)</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddWebhook}
                    className="h-8 flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add Webhook
                  </Button>
                </div>
                
                {webhooks.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No webhooks configured. Add one to receive payment notifications.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {webhooks.map((webhook, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={webhook}
                          onChange={(e) => handleWebhookChange(index, e.target.value)}
                          placeholder="https://example.com/webhook"
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveWebhook(index)}
                          className="border-destructive hover:bg-destructive/10"
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-slate-400">
                  Webhooks will be called when a payment is received
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <div className="mt-4 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => window.open("https://yodl.me", "_blank")}
            >
              <ExternalLink size={14} className="mr-1" />
              Learn more about Yodl
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default YodlConfig;
