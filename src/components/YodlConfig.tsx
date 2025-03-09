
import { useState } from "react";
import { YodlPaymentConfig } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AlertCircle, HelpCircle, Link, PlusCircle, Tags, Wallet } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface YodlConfigProps {
  config: YodlPaymentConfig;
  onChange: (config: YodlPaymentConfig) => void;
}

const DEFAULT_YODL_CONFIG: YodlPaymentConfig = {
  enabled: false,
  tokens: "USDC,USDT",
  chains: "base,oeth",
  currency: "USD",
  amount: "",
  memo: "",
  webhooks: []
};

const SUPPORTED_TOKENS = ["USDC", "USDT", "DAI", "USDGLO", "USDM", "CRVUSD", "XDAI", "WXDAI"];
const SUPPORTED_CHAINS = [
  { id: "eth", name: "Ethereum Mainnet" },
  { id: "base", name: "Base" },
  { id: "oeth", name: "Optimism" },
  { id: "gno", name: "Gnosis Chain" },
  { id: "pol", name: "Polygon" },
  { id: "arb1", name: "Arbitrum One" }
];

const YodlConfig = ({ config = DEFAULT_YODL_CONFIG, onChange }: YodlConfigProps) => {
  const [webhookInput, setWebhookInput] = useState("");
  
  const updateConfig = (key: keyof YodlPaymentConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };
  
  const addWebhook = () => {
    if (!webhookInput || !webhookInput.startsWith("http")) return;
    
    // Limit to 5 webhooks as per Yodl docs
    if (config.webhooks && config.webhooks.length >= 5) {
      return;
    }
    
    const newWebhooks = [...(config.webhooks || []), webhookInput];
    updateConfig("webhooks", newWebhooks);
    setWebhookInput("");
  };
  
  const removeWebhook = (index: number) => {
    if (!config.webhooks) return;
    
    const newWebhooks = [...config.webhooks];
    newWebhooks.splice(index, 1);
    updateConfig("webhooks", newWebhooks);
  };
  
  const toggleToken = (token: string) => {
    const tokens = config.tokens ? config.tokens.split(",") : [];
    const tokenIndex = tokens.indexOf(token);
    
    if (tokenIndex >= 0) {
      // Remove token
      tokens.splice(tokenIndex, 1);
    } else {
      // Add token
      tokens.push(token);
    }
    
    updateConfig("tokens", tokens.join(","));
  };
  
  const toggleChain = (chainId: string) => {
    const chains = config.chains ? config.chains.split(",") : [];
    const chainIndex = chains.indexOf(chainId);
    
    if (chainIndex >= 0) {
      // Remove chain
      chains.splice(chainIndex, 1);
    } else {
      // Add chain
      chains.push(chainId);
    }
    
    updateConfig("chains", chains.join(","));
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-400" />
            Yodl Payment Configuration
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Switch
              id="yodl-enabled"
              checked={config.enabled}
              onCheckedChange={(checked) => updateConfig("enabled", checked)}
            />
            <Label htmlFor="yodl-enabled">Enable Yodl Payments</Label>
          </div>
        </div>
        <CardDescription>
          Configure your Yodl payment parameters to receive crypto payments
          <a 
            href="https://docs.yodl.me" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center ml-2 text-indigo-400 hover:text-indigo-300"
          >
            <Link className="w-3 h-3 mr-1" />
            Yodl Docs
          </a>
        </CardDescription>
      </CardHeader>
      
      {config.enabled && (
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center">
              <Label className="flex items-center">
                Supported Tokens
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 ml-2 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Comma-separated list of preferred tokens. Leave empty to auto-detect based on wallet balances.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_TOKENS.map((token) => {
                const isSelected = config.tokens?.includes(token);
                return (
                  <Badge
                    key={token}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer ${isSelected ? "bg-indigo-600" : ""}`}
                    onClick={() => toggleToken(token)}
                  >
                    {token}
                  </Badge>
                );
              })}
            </div>
            
            <div className="text-xs text-muted-foreground">
              Current selection: <code className="bg-slate-800 px-1 py-0.5 rounded">{config.tokens || "Auto-detect"}</code>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <Label className="flex items-center">
                Supported Chains
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 ml-2 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Comma-separated list of supported chains. Leave empty to auto-detect based on wallet gas balances.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_CHAINS.map((chain) => {
                const isSelected = config.chains?.includes(chain.id);
                return (
                  <Badge
                    key={chain.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer ${isSelected ? "bg-indigo-600" : ""}`}
                    onClick={() => toggleChain(chain.id)}
                  >
                    {chain.name}
                  </Badge>
                );
              })}
            </div>
            
            <div className="text-xs text-muted-foreground">
              Current selection: <code className="bg-slate-800 px-1 py-0.5 rounded">{config.chains || "Auto-detect"}</code>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currency" className="flex items-center">
              Currency
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 ml-2 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Currency for pricing and invoicing. Default: USD</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="currency"
              value={config.currency || ""}
              onChange={(e) => updateConfig("currency", e.target.value)}
              placeholder="USD"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center">
              Fixed Amount (Optional)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 ml-2 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Hard-coded amount during checkout. Leave empty for user to enter amount.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="amount"
              value={config.amount || ""}
              onChange={(e) => updateConfig("amount", e.target.value)}
              placeholder="10.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="memo" className="flex items-center">
              Memo (Optional)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 ml-2 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Reference ID to match a payment to an order or invoice.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="memo"
              value={config.memo || ""}
              onChange={(e) => updateConfig("memo", e.target.value)}
              placeholder="INVOICE-123 or order_id"
            />
          </div>
          
          <div className="space-y-3">
            <Label className="flex items-center">
              Webhooks (Optional)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 ml-2 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Up to 5 webhook URLs to notify when payment is received. These are stored in ENS records.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            
            <div className="flex gap-2">
              <Input
                value={webhookInput}
                onChange={(e) => setWebhookInput(e.target.value)}
                placeholder="https://example.com/webhook"
              />
              <Button 
                type="button" 
                size="icon" 
                variant="outline"
                onClick={addWebhook}
                disabled={!webhookInput || !webhookInput.startsWith("http") || (config.webhooks && config.webhooks.length >= 5)}
              >
                <PlusCircle className="w-4 h-4" />
              </Button>
            </div>
            
            {config.webhooks && config.webhooks.length > 0 && (
              <div className="space-y-2 mt-2">
                {config.webhooks.map((webhook, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-800/50 p-2 rounded-md">
                    <code className="text-xs text-slate-300 truncate flex-1">{webhook}</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0" 
                      onClick={() => removeWebhook(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-xs text-muted-foreground">
              {config.webhooks ? `${config.webhooks.length}/5 webhooks configured` : "No webhooks configured"}
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-md mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Tags className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-medium">Generated Yodl Link</h3>
            </div>
            <code className="text-xs block bg-black/20 p-2 rounded overflow-x-auto whitespace-pre-wrap break-all">
              https://yodl.me/YOUR_ADDRESS?tokens={config.tokens || "auto"}&chains={config.chains || "auto"}&currency={config.currency || "USD"}
              {config.amount ? `&amount=${config.amount}` : ""}
              {config.memo ? `&memo=${config.memo}` : ""}
            </code>
            <div className="text-xs text-muted-foreground mt-2">
              This link will be automatically generated when your ENS or address is configured
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-amber-400 text-sm mt-2">
            <AlertCircle className="w-4 h-4" />
            <p>Webhooks are not included in the URL and must be configured in your ENS text record.</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default YodlConfig;
