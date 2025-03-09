
import { useState, useEffect } from "react";
import { UserConfig, ButtonStyle, ThankYouPageStyle, SocialPreviewStyle, YodlPaymentConfig } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { validateHexColor, isValidEnsOrAddress, isValidSlug } from "@/utils/validation";
import { Check, ChevronsUpDown, AlertCircle, Lightbulb, Settings, Palette, Heart, Share2, Upload, ExternalLink, Book } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useWeb3 } from "@/contexts/Web3Context";
import ColorPicker from "./ColorPicker";
import LoadingSpinner from "./LoadingSpinner";
import SocialPreviewCard from "./SocialPreviewCard";
import YodlConfig from "./YodlConfig";

interface ConfigurationFormProps {
  initialConfig?: UserConfig;
  onConfigChange: (config: UserConfig) => void;
  onSave: (config: UserConfig) => void;
}

const DEFAULT_BUTTON_STYLE: ButtonStyle = {
  backgroundColor: "#1E40AF",
  textColor: "#FFFFFF",
  borderRadius: "9999px",
  fontSize: "16px",
  padding: "12px 24px",
  buttonText: "Buy me a coffee"
};

const DEFAULT_THANK_YOU_STYLE: ThankYouPageStyle = {
  backgroundColor: "#F9FAFB",
  textColor: "#111827",
  message: "Thank you for your support! It means a lot to me.",
  showConfetti: true
};

const DEFAULT_SOCIAL_PREVIEW: SocialPreviewStyle = {
  title: "Support My Work",
  description: "Every contribution helps me continue creating awesome content for you!",
  imageUrl: "",
  useCustomImage: false
};

const DEFAULT_CONFIG: UserConfig = {
  ensNameOrAddress: "",
  buttonStyle: DEFAULT_BUTTON_STYLE,
  thankYouPage: DEFAULT_THANK_YOU_STYLE,
  socialPreview: DEFAULT_SOCIAL_PREVIEW,
  slug: "",
  yodlConfig: {
    enabled: true, // Always enabled
    tokens: "USDC,USDT",
    chains: "base,oeth",
    currency: "USD",
    amount: "",
    memo: "",
    webhooks: []
  }
};

const ConfigurationForm = ({
  initialConfig = DEFAULT_CONFIG,
  onConfigChange,
  onSave
}: ConfigurationFormProps) => {
  const [config, setConfig] = useState<UserConfig>(initialConfig);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { ensNameOrAddress: connectedWalletENS, isConnected } = useWeb3();

  useEffect(() => {
    if (isConnected && connectedWalletENS && !config.ensNameOrAddress) {
      const newConfig = { ...config, ensNameOrAddress: connectedWalletENS };
      
      if (!config.slug) {
        const autoSlug = connectedWalletENS
          .toLowerCase()
          .replace('.eth', '')
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        newConfig.slug = autoSlug;
      }
      
      // Ensure Yodl is always enabled
      if (newConfig.yodlConfig) {
        newConfig.yodlConfig.enabled = true;
      } else {
        newConfig.yodlConfig = {
          ...DEFAULT_CONFIG.yodlConfig!,
          enabled: true
        };
      }
      
      setConfig(newConfig);
      onConfigChange(newConfig);
    }
  }, [isConnected, connectedWalletENS]);

  const updateConfig = (key: keyof UserConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    
    // Ensure Yodl is always enabled
    if (key === 'yodlConfig' && newConfig.yodlConfig) {
      newConfig.yodlConfig.enabled = true;
    }
    
    setConfig(newConfig);
    onConfigChange(newConfig);
    validateField(key, value);
    
    if (key === "ensNameOrAddress" && !config.slug && isValidEnsOrAddress(value)) {
      const autoSlug = value
        .toLowerCase()
        .replace('.eth', '')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      updateConfig("slug", autoSlug);
    }
  };
  
  const updateButtonStyle = (key: keyof ButtonStyle, value: string) => {
    const newButtonStyle = { ...config.buttonStyle, [key]: value };
    const newConfig = { ...config, buttonStyle: newButtonStyle };
    setConfig(newConfig);
    onConfigChange(newConfig);
    validateField(`buttonStyle.${key}`, value);
  };
  
  const updateThankYouStyle = (key: keyof ThankYouPageStyle, value: any) => {
    const newThankYouStyle = { ...config.thankYouPage, [key]: value };
    const newConfig = { ...config, thankYouPage: newThankYouStyle };
    setConfig(newConfig);
    onConfigChange(newConfig);
    validateField(`thankYouPage.${key}`, value);
  };

  const updateSocialPreviewStyle = (key: keyof SocialPreviewStyle, value: any) => {
    const newSocialPreviewStyle = { ...config.socialPreview, [key]: value };
    const newConfig = { ...config, socialPreview: newSocialPreviewStyle };
    setConfig(newConfig);
    onConfigChange(newConfig);
    validateField(`socialPreview.${key}`, value);
  };
  
  const validateField = (key: string, value: any) => {
    const newErrors = { ...errors };
    
    if (key === "ensNameOrAddress") {
      if (!value.trim()) {
        newErrors.ensNameOrAddress = "ENS name or address is required";
      } else if (!isValidEnsOrAddress(value)) {
        newErrors.ensNameOrAddress = "Invalid ENS name or Ethereum address";
      } else {
        delete newErrors.ensNameOrAddress;
      }
    }
    
    if (key === "slug") {
      if (!value.trim()) {
        newErrors.slug = "Slug is required";
      } else if (!isValidSlug(value)) {
        newErrors.slug = "Slug must contain only lowercase letters, numbers, and hyphens";
      } else {
        delete newErrors.slug;
      }
    }
    
    if (key.startsWith("buttonStyle.") || key.startsWith("thankYouPage.")) {
      const styleKey = key.split(".")[1];
      
      if (styleKey === "backgroundColor" || styleKey === "textColor") {
        if (!validateHexColor(value)) {
          newErrors[key] = "Must be a valid hex color (e.g. #FF0000)";
        } else {
          delete newErrors[key];
        }
      }
      
      if (styleKey === "message" && key.startsWith("thankYouPage.")) {
        if (!value.trim()) {
          newErrors[key] = "Thank you message is required";
        } else {
          delete newErrors[key];
        }
      }
      
      if (styleKey === "buttonText" && key.startsWith("buttonStyle.")) {
        if (!value.trim()) {
          newErrors[key] = "Button text is required";
        } else {
          delete newErrors[key];
        }
      }
    }

    if (key.startsWith("socialPreview.")) {
      const styleKey = key.split(".")[1];
      
      if (styleKey === "title") {
        if (!value.trim()) {
          newErrors[key] = "Title is required";
        } else {
          delete newErrors[key];
        }
      }
      
      if (styleKey === "description") {
        if (!value.trim()) {
          newErrors[key] = "Description is required";
        } else {
          delete newErrors[key];
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateForm = (): boolean => {
    const fieldValidations: Record<string, boolean> = {
      "ensNameOrAddress": validateField("ensNameOrAddress", config.ensNameOrAddress),
      "slug": validateField("slug", config.slug),
      "buttonStyle.backgroundColor": validateField("buttonStyle.backgroundColor", config.buttonStyle.backgroundColor),
      "buttonStyle.textColor": validateField("buttonStyle.textColor", config.buttonStyle.textColor),
      "buttonStyle.buttonText": validateField("buttonStyle.buttonText", config.buttonStyle.buttonText),
      "thankYouPage.backgroundColor": validateField("thankYouPage.backgroundColor", config.thankYouPage.backgroundColor),
      "thankYouPage.textColor": validateField("thankYouPage.textColor", config.thankYouPage.textColor),
      "thankYouPage.message": validateField("thankYouPage.message", config.thankYouPage.message),
      "socialPreview.title": validateField("socialPreview.title", config.socialPreview.title),
      "socialPreview.description": validateField("socialPreview.description", config.socialPreview.description)
    };
    
    return Object.values(fieldValidations).every(valid => valid);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        onSave(config);
        toast({
          title: "Configuration saved",
          description: "Your payment button has been successfully created",
        });
      } catch (error) {
        toast({
          title: "Error saving configuration",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast({
        title: "Validation error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
    }
  };
  
  const generateRandomSlug = () => {
    const randomString = Math.random().toString(36).substring(2, 10);
    updateConfig("slug", randomString);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateSocialPreviewStyle('imageUrl', reader.result);
          updateSocialPreviewStyle('useCustomImage', true);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full animate-slide-up">
        <CardHeader>
          <CardTitle className="text-2xl font-medium">
            Configure Your Payment Button
          </CardTitle>
          <CardDescription>
            Customize how your "Buy Me a Coffee" button looks and behaves
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="button" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Button</span>
              </TabsTrigger>
              <TabsTrigger value="thankYou" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Thank You</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Social</span>
              </TabsTrigger>
              <TabsTrigger value="yodl" className="flex items-center gap-2">
                <div className="w-4 h-4">
                  <img 
                    src="https://yodl.me/_next/static/media/new_logo.be0c2fdb.svg" 
                    alt="Yodl"
                    className="w-full h-full drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]"
                  />
                </div>
                <span className="hidden sm:inline">Yodl</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 mb-6">
                <div className="flex items-center mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                  <h3 className="text-lg font-semibold">Quick Tips</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center">
                    <span className="mr-2 text-indigo-400">•</span>
                    Use an ENS name for better recognition
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-indigo-400">•</span>
                    Create a memorable slug for easy sharing
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-indigo-400">•</span>
                    Subdomains are supported (e.g., donations.vitalik.eth)
                  </li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ensNameOrAddress">
                  ENS Name or Ethereum Address
                </Label>
                <Input
                  id="ensNameOrAddress"
                  value={config.ensNameOrAddress}
                  onChange={(e) => updateConfig("ensNameOrAddress", e.target.value)}
                  placeholder="vitalik.eth or donations.vitalik.eth or 0x123..."
                  className={errors.ensNameOrAddress ? "border-destructive" : ""}
                  disabled={isConnected}
                />
                {isConnected && (
                  <p className="text-xs text-indigo-400 mt-1">
                    Using your connected wallet's address
                  </p>
                )}
                {errors.ensNameOrAddress && (
                  <div className="text-destructive text-sm flex items-center gap-1 mt-1">
                    <AlertCircle size={14} />
                    {errors.ensNameOrAddress}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug">Custom URL Slug</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={generateRandomSlug}
                    className="h-8 px-2 text-xs"
                  >
                    Generate Random
                  </Button>
                </div>
                <div className="flex rounded-lg shadow-sm">
                  <span className="inline-flex items-center px-4 bg-slate-800/50 border border-r-0 border-slate-700/50 rounded-l-lg text-slate-400 text-sm">
                    {window.location.origin}/pay/
                  </span>
                  <Input
                    id="slug"
                    value={config.slug}
                    onChange={(e) => updateConfig("slug", e.target.value)}
                    placeholder="my-coffee-button"
                    className={`rounded-none rounded-r-lg ${errors.slug ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.slug && (
                  <div className="text-destructive text-sm flex items-center gap-1 mt-1">
                    <AlertCircle size={14} />
                    {errors.slug}
                  </div>
                )}
                <div className="text-muted-foreground text-xs mt-1">
                  This will be used in your payment URL: {window.location.origin}/pay/<strong>{config.slug || "your-slug"}</strong>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="button" className="space-y-6">
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 mb-4">
                <h3 className="text-lg font-semibold mb-4">Button Preview</h3>
                <div className="flex items-center justify-center p-8 bg-slate-900/50 rounded-lg">
                  <button
                    className="inline-flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                    style={{
                      backgroundColor: config.buttonStyle.backgroundColor,
                      color: config.buttonStyle.textColor,
                      borderRadius: config.buttonStyle.borderRadius,
                      fontSize: config.buttonStyle.fontSize,
                      padding: config.buttonStyle.padding,
                    }}
                  >
                    {config.buttonStyle.buttonText}
                  </button>
                </div>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <ColorPicker 
                    color={config.buttonStyle.backgroundColor} 
                    onChange={(color) => updateButtonStyle("backgroundColor", color)}
                  />
                  {errors["buttonStyle.backgroundColor"] && (
                    <div className="text-destructive text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors["buttonStyle.backgroundColor"]}
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="textColor">Text Color</Label>
                  <ColorPicker 
                    color={config.buttonStyle.textColor} 
                    onChange={(color) => updateButtonStyle("textColor", color)}
                  />
                  {errors["buttonStyle.textColor"] && (
                    <div className="text-destructive text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors["buttonStyle.textColor"]}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={config.buttonStyle.buttonText}
                  onChange={(e) => updateButtonStyle("buttonText", e.target.value)}
                  placeholder="Buy me a coffee"
                  className={errors["buttonStyle.buttonText"] ? "border-destructive" : ""}
                />
                {errors["buttonStyle.buttonText"] && (
                  <div className="text-destructive text-sm flex items-center gap-1 mt-1">
                    <AlertCircle size={14} />
                    {errors["buttonStyle.buttonText"]}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="borderRadius">Border Radius</Label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="24"
                      value={parseInt(config.buttonStyle.borderRadius)}
                      onChange={(e) => updateButtonStyle("borderRadius", `${e.target.value}px`)}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground">
                      {config.buttonStyle.borderRadius}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={parseInt(config.buttonStyle.fontSize)}
                      onChange={(e) => updateButtonStyle("fontSize", `${e.target.value}px`)}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground">
                      {config.buttonStyle.fontSize}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="padding">Padding</Label>
                  <Input
                    id="padding"
                    value={config.buttonStyle.padding}
                    onChange={(e) => updateButtonStyle("padding", e.target.value)}
                    placeholder="12px 24px"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="thankYou" className="space-y-6">
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 mb-4">
                <h3 className="text-lg font-semibold mb-4">Thank You Page Preview</h3>
                <div 
                  className="p-8 rounded-lg text-center"
                  style={{
                    backgroundColor: config.thankYouPage.backgroundColor,
                    color: config.thankYouPage.textColor
                  }}
                >
                  <h4 className="text-2xl font-bold mb-4">Thank You!</h4>
                  <p className="opacity-80">{config.thankYouPage.message}</p>
                  {config.thankYouPage.showConfetti && (
                    <div className="mt-4 text-sm">✨ Confetti will appear here ✨</div>
                  )}
                </div>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="tyBackgroundColor">Background Color</Label>
                  <ColorPicker 
                    color={config.thankYouPage.backgroundColor} 
                    onChange={(color) => updateThankYouStyle("backgroundColor", color)}
                  />
                  {errors["thankYouPage.backgroundColor"] && (
                    <div className="text-destructive text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors["thankYouPage.backgroundColor"]}
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="tyTextColor">Text Color</Label>
                  <ColorPicker 
                    color={config.thankYouPage.textColor} 
                    onChange={(color) => updateThankYouStyle("textColor", color)}
                  />
                  {errors["thankYouPage.textColor"] && (
                    <div className="text-destructive text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors["thankYouPage.textColor"]}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tyMessage">Thank You Message</Label>
                <Textarea
                  id="tyMessage"
                  value={config.thankYouPage.message}
                  onChange={(e) => updateThankYouStyle("message", e.target.value)}
                  placeholder="Thank you for your support!"
                  className={errors["thankYouPage.message"] ? "border-destructive" : "min-h-[100px]"}
                />
                {errors["thankYouPage.message"] && (
                  <div className="text-destructive text-sm flex items-center gap-1 mt-1">
                    <AlertCircle size={14} />
                    {errors["thankYouPage.message"]}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="showConfetti"
                  checked={config.thankYouPage.showConfetti}
                  onCheckedChange={(checked) => updateThankYouStyle("showConfetti", checked)}
                />
                <Label htmlFor="showConfetti">Show confetti animation</Label>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 mb-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Share2 className="w-5 h-5 text-indigo-400 mr-2" />
                  Social Media Preview
                </h3>
                <p className="text-sm text-slate-300 mb-4">
                  Customize how your payment link appears when shared on social media platforms 
                  like Twitter, Facebook, and LinkedIn.
                </p>
                <SocialPreviewCard 
                  ensNameOrAddress={config.ensNameOrAddress || "your.name.eth"}
                  socialPreview={config.socialPreview}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="socialTitle">Title</Label>
                <Input
                  id="socialTitle"
                  value={config.socialPreview.title}
                  onChange={(e) => updateSocialPreviewStyle("title", e.target.value)}
                  placeholder="Support My Work"
                  className={errors["socialPreview.title"] ? "border-destructive" : ""}
                />
                {errors["socialPreview.title"] && (
                  <div className="text-destructive text-sm flex items-center gap-1 mt-1">
                    <AlertCircle size={14} />
                    {errors["socialPreview.title"]}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="socialDescription">Description</Label>
                <Textarea
                  id="socialDescription"
                  value={config.socialPreview.description}
                  onChange={(e) => updateSocialPreviewStyle("description", e.target.value)}
                  placeholder="Every contribution helps me continue creating awesome content for you!"
                  className={errors["socialPreview.description"] ? "border-destructive" : ""}
                />
                {errors["socialPreview.description"] && (
                  <div className="text-destructive text-sm flex items-center gap-1 mt-1">
                    <AlertCircle size={14} />
                    {errors["socialPreview.description"]}
                  </div>
                )}
                <p className="text-xs text-slate-400">
                  Keep it under 155 characters for optimal display on social platforms
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Switch
                    id="useCustomImage"
                    checked={config.socialPreview.useCustomImage}
                    onCheckedChange={(checked) => updateSocialPreviewStyle("useCustomImage", checked)}
                  />
                  <Label htmlFor="useCustomImage">Use custom image</Label>
                </div>
                
                {config.socialPreview.useCustomImage && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {config.socialPreview.imageUrl && (
                        <div className="w-12 h-12 rounded overflow-hidden">
                          <img 
                            src={config.socialPreview.imageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        asChild
                      >
                        <label className="cursor-pointer">
                          <Upload size={14} />
                          {config.socialPreview.imageUrl ? "Change image" : "Upload image"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </Button>
                    </div>
                    <p className="text-xs text-slate-400">
                      Best size is 1200x630 pixels for optimal display across platforms
                    </p>
                  </div>
                )}
                
                {!config.socialPreview.useCustomImage && (
                  <p className="text-sm text-slate-400">
                    Your ENS avatar or a generated one will be used as the image
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="yodl" className="space-y-6">
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 mb-4">
                <div className="flex items-center mb-4">
                  <Wallet className="w-5 h-5 text-green-500 mr-2" />
                  <h3 className="text-lg font-semibold">Yodl Payment</h3>
                </div>
                <p className="text-sm text-slate-300">
                  Yodl payments allow your supporters to send you tokens on various blockchains.
                  Configure your preferred tokens, chains, and other settings below.
                </p>
              </div>
              
              <YodlConfig 
                config={config.yodlConfig || {
                  enabled: true,
                  tokens: "USDC,USDT",
                  chains: "base,oeth",
                  currency: "USD",
                  amount: "",
                  memo: "",
                  webhooks: []
                }} 
                onChange={(yodlConfig) => {
                  const newConfig = { 
                    ...config, 
                    yodlConfig: {
                      ...yodlConfig,
                      enabled: true
                    } 
                  };
                  setConfig(newConfig);
                  onConfigChange(newConfig);
                }} 
              />
            </TabsContent>
          </Tabs>
          
          <Button 
            type="submit" 
            className="mt-6 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Creating Payment Button...
              </div>
            ) : (
              "Create Payment Button"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default ConfigurationForm;
