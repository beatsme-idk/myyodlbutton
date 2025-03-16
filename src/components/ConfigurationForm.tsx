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
import { Check, AlertCircle, Lightbulb, Settings, Palette, Heart, Coffee, Hand, Gift, Zap, Share2, Upload, ExternalLink, Book, Wallet, Droplet, Twitter, Instagram, Github, Linkedin, Link2, ArrowRight, Star, Coins, Sparkles, CopyIcon, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ColorPicker from "./ColorPicker";
import LoadingSpinner from "./LoadingSpinner";
import SocialPreviewCard from "./SocialPreviewCard";
import YodlConfig from "./YodlConfig";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  buttonText: "Yodl me a coffee",
  icon: "none"
};

const DEFAULT_THANK_YOU_STYLE: ThankYouPageStyle = {
  backgroundColor: "#F9FAFB",
  textColor: "#111827",
  message: "Thank you for your support! It means a lot to me.",
  showConfetti: true,
  socialLinks: {}
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
    tokens: ["all"],
    chains: ["all"],
    amount: "",
    memo: "",
    redirectUrl: "",
    currency: "USD"
  }
};

const GRADIENT_OPTIONS = [
  {
    label: "None",
    value: "none"
  },
  {
    label: "Indigo to Purple",
    value: "linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)"
  },
  {
    label: "Orange to Red",
    value: "linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)"
  },
  {
    label: "Blue to Cyan",
    value: "linear-gradient(90deg, hsla(221, 45%, 73%, 1) 0%, hsla(220, 78%, 29%, 1) 100%)"
  },
  {
    label: "Green to Yellow",
    value: "linear-gradient(90deg, hsla(139, 70%, 75%, 1) 0%, hsla(63, 90%, 76%, 1) 100%)"
  },
  {
    label: "Pink to Orange",
    value: "linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)"
  },
  {
    label: "Purple to Magenta",
    value: "linear-gradient(102.3deg, rgba(147,39,143,1) 5.9%, rgba(234,172,232,1) 64%, rgba(246,219,245,1) 89%)"
  }
];

const ConfigurationForm = ({
  initialConfig = DEFAULT_CONFIG,
  onConfigChange,
  onSave
}: ConfigurationFormProps) => {
  const [config, setConfig] = useState<UserConfig>(initialConfig);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useGradient, setUseGradient] = useState(false);
  const [selectedGradient, setSelectedGradient] = useState("none");
  const [paddingHorizontal, setPaddingHorizontal] = useState(24);
  const [paddingVertical, setPaddingVertical] = useState(12);
  const [customLinkActive, setCustomLinkActive] = useState(!!config.thankYouPage.customLink);
  const [selectedIcon, setSelectedIcon] = useState<string>(config.buttonStyle.icon || "none");
  const [useThankYouGradient, setUseThankYouGradient] = useState(false);
  const [selectedThankYouGradient, setSelectedThankYouGradient] = useState("none");

  useEffect(() => {
    if (config.buttonStyle.padding) {
      const paddingValues = config.buttonStyle.padding.split(" ");
      if (paddingValues.length === 2) {
        setPaddingVertical(parseInt(paddingValues[0]) || 12);
        setPaddingHorizontal(parseInt(paddingValues[1]) || 24);
      }
    }

    if (config.buttonStyle.backgroundColor.includes("linear-gradient")) {
      setUseGradient(true);
      setSelectedGradient(config.buttonStyle.backgroundColor);
    } else {
      setUseGradient(false);
      setSelectedGradient("none");
    }
    
    setCustomLinkActive(!!config.thankYouPage.customLink);
  }, [config.buttonStyle.padding, config.buttonStyle.backgroundColor, config.thankYouPage.customLink]);

  const handleChange = (name: string, value: any) => {
    const newConfig = { ...config };
    
    if (name.includes(".")) {
      const [section, key] = name.split(".");
      newConfig[section][key] = value;
    } else {
      newConfig[name] = value;
    }
    
    setConfig(newConfig);
    onConfigChange(newConfig);
    
    // Validate and update errors
    const errorMessage = validateField(name, value);
    const newErrors = { ...errors };
    
    if (errorMessage) {
      newErrors[name] = errorMessage;
    } else {
      delete newErrors[name];
    }
    
    setErrors(newErrors);
    
    // Auto-generate slug from ENS name or address
    if (name === "ensNameOrAddress" && isValidEnsOrAddress(value)) {
      let autoSlug = value
        .toLowerCase()
        .replace(/\.eth$/, '')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      if (value.startsWith('0x')) {
        autoSlug = `${value.substring(2, 8)}-${value.substring(value.length - 6)}`;
      }
      
      // Update the slug without triggering another validation cycle
      const slugConfig = { ...newConfig, slug: autoSlug };
      setConfig(slugConfig);
      onConfigChange(slugConfig);
      
      // Clear any slug errors
      const updatedErrors = { ...newErrors };
      delete updatedErrors["slug"];
      setErrors(updatedErrors);
    }
  };

  const updateConfig = (key: keyof UserConfig, value: any) => {
    handleChange(key as string, value);
  };
  
  const updateButtonStyle = (key: keyof ButtonStyle, value: any) => {
    handleChange(`buttonStyle.${key}`, value);
  };
  
  const updateThankYouPage = (key: keyof ThankYouPageStyle, value: any) => {
    handleChange(`thankYouPage.${key}`, value);
  };
  
  const updateSocialPreview = (key: keyof SocialPreviewStyle, value: any) => {
    handleChange(`socialPreview.${key}`, value);
  };

  const updateSocialLinks = (network: string, value: string) => {
    const socialLinks = { ...(config.thankYouPage.socialLinks || {}) };
    
    if (value) {
      socialLinks[network as keyof typeof socialLinks] = value;
    } else {
      delete socialLinks[network as keyof typeof socialLinks];
    }
    
    updateThankYouPage('socialLinks', socialLinks);
  };

  const updateCustomLink = (key: string, value: string) => {
    const customLink = { 
      ...(config.thankYouPage.customLink || { text: '', url: '' }),
      [key]: value
    };
    
    updateThankYouPage('customLink', customLink);
  };

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case "ensNameOrAddress":
        if (!value) {
          return "ENS name or Ethereum address is required";
        }
        if (!isValidEnsOrAddress(value)) {
          return "Invalid format. Use a valid ENS name (name.eth or subdomain.name.eth) or Ethereum address (0x...)";
        }
        return "";
      case "slug":
        if (!value.trim()) {
          return "Slug is required";
        }
        if (!isValidSlug(value)) {
          return "Slug must contain only lowercase letters, numbers, and hyphens";
        }
        return "";
      case "buttonStyle.backgroundColor":
      case "buttonStyle.textColor":
        if (value.includes("linear-gradient")) {
          return "";
        }
        if (!validateHexColor(value)) {
          return "Must be a valid hex color (e.g. #FF0000)";
        }
        return "";
      case "buttonStyle.buttonText":
        if (!value.trim()) {
          return "Button text is required";
        }
        return "";
      case "thankYouPage.backgroundColor":
      case "thankYouPage.textColor":
        if (!value.trim()) {
          return "Background color is required";
        }
        return "";
      case "thankYouPage.message":
        if (!value.trim()) {
          return "Thank you message is required";
        }
        return "";
      case "socialPreview.title":
        if (!value.trim()) {
          return "Title is required";
        }
        return "";
      case "socialPreview.description":
        if (!value.trim()) {
          return "Description is required";
        }
        return "";
      default:
        return "";
    }
  };
  
  const validateForm = (): boolean => {
    const fieldValidations: Record<string, boolean> = {
      "ensNameOrAddress": validateField("ensNameOrAddress", config.ensNameOrAddress) === "",
      "slug": validateField("slug", config.slug) === "",
      "buttonStyle.backgroundColor": validateField("buttonStyle.backgroundColor", config.buttonStyle.backgroundColor) === "",
      "buttonStyle.textColor": validateField("buttonStyle.textColor", config.buttonStyle.textColor) === "",
      "buttonStyle.buttonText": validateField("buttonStyle.buttonText", config.buttonStyle.buttonText) === "",
      "thankYouPage.backgroundColor": validateField("thankYouPage.backgroundColor", config.thankYouPage.backgroundColor) === "",
      "thankYouPage.textColor": validateField("thankYouPage.textColor", config.thankYouPage.textColor) === "",
      "thankYouPage.message": validateField("thankYouPage.message", config.thankYouPage.message) === "",
      "socialPreview.title": validateField("socialPreview.title", config.socialPreview.title) === "",
      "socialPreview.description": validateField("socialPreview.description", config.socialPreview.description) === ""
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
    // Create a fully random string with no reference to address
    const randomString = Math.random().toString(36).substring(2, 10) + 
                        Math.random().toString(36).substring(2, 10);
    
    // Use only the random string as the slug
    const secureSlug = randomString.substring(0, 12);
    updateConfig("slug", secureSlug);
  };

  const updatePadding = () => {
    const paddingValue = `${paddingVertical}px ${paddingHorizontal}px`;
    updateButtonStyle("padding", paddingValue);
  };

  const handleGradientChange = (value: string) => {
    setSelectedGradient(value);
    if (value === "none") {
      setUseGradient(false);
      // Reset to solid color
      if (config.buttonStyle.backgroundColor.includes("linear-gradient")) {
        updateButtonStyle("backgroundColor", "#1E40AF");
      }
    } else {
      setUseGradient(true);
      updateButtonStyle("backgroundColor", value);
    }
  };

  const toggleCustomLink = (active: boolean) => {
    setCustomLinkActive(active);
    if (active) {
      updateThankYouPage("customLink", { text: 'Visit my website', url: 'https://example.com' });
    } else {
      updateThankYouPage("customLink", undefined);
    }
  };
  
  const handleIconSelection = (icon: string) => {
    updateButtonStyle("icon", icon);
  };

  const handleThankYouGradientChange = (value: string) => {
    setSelectedThankYouGradient(value);
    if (value === "none") {
      setUseThankYouGradient(false);
      // Reset to solid color
      if (config.thankYouPage.backgroundColor.includes("linear-gradient")) {
        updateThankYouPage("backgroundColor", "#F9FAFB");
      }
    } else {
      setUseThankYouGradient(true);
      updateThankYouPage("backgroundColor", value);
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
            Customize how your "Yodl Me a Coffee" button looks and behaves
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8 w-full max-w-full overflow-x-auto bg-slate-800/50 p-1.5 rounded-xl">
              <TabsTrigger 
                value="general" 
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">General</span>
              </TabsTrigger>
              <TabsTrigger 
                value="button" 
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Button</span>
              </TabsTrigger>
              <TabsTrigger 
                value="thankYou" 
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Thank You</span>
              </TabsTrigger>
              <TabsTrigger 
                value="social" 
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Preview Cards</span>
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
                    Subdomains are supported (e.g., tam.yodl.eth)
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
                />
                {errors.ensNameOrAddress && (
                  <div className="text-destructive text-sm flex items-center gap-1 mt-1">
                    <AlertCircle size={14} />
                    {errors.ensNameOrAddress}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug">Payment URL</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={generateRandomSlug}
                    className="h-8 px-2 text-xs"
                  >
                    Generate New Random ID
                  </Button>
                </div>
                <div className="flex rounded-lg shadow-sm">
                  <span className="inline-flex items-center px-4 bg-slate-800/50 border border-r-0 border-slate-700/50 rounded-l-lg text-slate-400 text-sm">
                    https://myyodlbutton.lovable.app/
                  </span>
                  <div className="flex-1 bg-slate-800/30 border border-slate-700/50 rounded-r-lg px-3 py-2 text-sm text-indigo-200 font-mono overflow-x-auto">
                    {config.slug || "generating..."}
                  </div>
                </div>
                <div className="text-muted-foreground text-xs mt-1">
                  This is your secure payment URL: https://myyodlbutton.lovable.app/<strong>{config.slug || "your-id"}</strong>
                </div>
                <div className="bg-amber-900/20 border border-amber-500/20 rounded-md p-3 mt-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={16} className="text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-amber-400 text-sm font-medium">Security Notice</p>
                      <p className="text-amber-300/80 text-xs mt-1">
                        For security reasons, your payment URL uses a completely random ID that cannot be guessed or predicted. This prevents impersonation and scams while keeping your payments secure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Wallet className="w-5 h-5 text-green-500 mr-2" />
                  Yodl Payment Settings
                </h3>
                <YodlConfig 
                  config={config.yodlConfig} 
                  onChange={(yodlConfig) => updateConfig("yodlConfig", yodlConfig)} 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="button" className="space-y-6">
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 mb-4">
                <h3 className="text-lg font-semibold mb-4">Button Preview</h3>
                <div className="flex items-center justify-center p-8 bg-slate-900/50 rounded-lg">
                  <button
                    className="inline-flex flex-col items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 min-w-[200px]"
                    style={{
                      background: config.buttonStyle.backgroundColor,
                      color: config.buttonStyle.textColor,
                      borderRadius: config.buttonStyle.borderRadius,
                      fontSize: config.buttonStyle.fontSize,
                      padding: `${parseInt(config.buttonStyle.padding.split(' ')[0]) + 4}px ${parseInt(config.buttonStyle.padding.split(' ')[1]) + 8}px`,
                    }}
                  >
                    <div className="flex items-center w-full mb-2">
                      <div className="relative mr-2 w-5 h-5">
                        <img 
                          src="https://yodl.me/_next/static/media/new_logo.be0c2fdb.svg" 
                          alt="Yodl"
                          className="w-full h-full drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]"
                        />
                      </div>
                      {config.buttonStyle.icon !== "none" && (
                        <>
                          {config.buttonStyle.icon === "heart" && <Heart className="mr-2" size={16} />}
                          {config.buttonStyle.icon === "coffee" && <Coffee className="mr-2" size={16} />}
                          {config.buttonStyle.icon === "hand" && <Hand className="mr-2" size={16} />}
                          {config.buttonStyle.icon === "gift" && <Gift className="mr-2" size={16} />}
                          {config.buttonStyle.icon === "zap" && <Zap className="mr-2" size={16} />}
                          {config.buttonStyle.icon === "star" && <Star className="mr-2" size={16} />}
                          {config.buttonStyle.icon === "coins" && <Coins className="mr-2" size={16} />}
                          {config.buttonStyle.icon === "sparkles" && <Sparkles className="mr-2" size={16} />}
                        </>
                      )}
                      <span className="flex-1">{config.buttonStyle.buttonText}</span>
                      <ArrowRight className="ml-2 opacity-70" size={16} />
                    </div>
                    <div className="text-xs opacity-70 self-start mt-1">
                      To: {config.ensNameOrAddress ? 
                        (config.ensNameOrAddress.length > 20 ? 
                          `${config.ensNameOrAddress.substring(0, 10)}...${config.ensNameOrAddress.substring(config.ensNameOrAddress.length - 6)}` : 
                          config.ensNameOrAddress) : 
                        "username.eth"}
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="buttonText" className="text-base flex items-center gap-2">
                  <Sparkles size={18} className="text-indigo-400" />
                  Button Text
                </Label>
                <Input
                  id="buttonText"
                  value={config.buttonStyle.buttonText}
                  onChange={(e) => updateButtonStyle("buttonText", e.target.value)}
                  className="bg-slate-800/50 border-slate-700"
                />
                {errors["buttonStyle.buttonText"] && (
                  <p className="text-red-500 text-xs mt-1">{errors["buttonStyle.buttonText"]}</p>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-base flex items-center gap-2">
                  <Coffee size={18} className="text-indigo-400" />
                  Button Icon
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Button
                    type="button"
                    variant={config.buttonStyle.icon === 'heart' ? 'default' : 'outline'}
                    className={`flex items-center justify-center min-h-[44px] ${config.buttonStyle.icon === 'heart' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700'}`}
                    onClick={() => handleIconSelection("heart")}
                  >
                    <Heart size={18} />
                  </Button>
                  <Button
                    type="button"
                    variant={config.buttonStyle.icon === 'coffee' ? 'default' : 'outline'}
                    className={`flex items-center justify-center min-h-[44px] ${config.buttonStyle.icon === 'coffee' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700'}`}
                    onClick={() => handleIconSelection("coffee")}
                  >
                    <Coffee size={18} />
                  </Button>
                  <Button
                    type="button"
                    variant={config.buttonStyle.icon === 'hand' ? 'default' : 'outline'}
                    className={`flex items-center justify-center min-h-[44px] ${config.buttonStyle.icon === 'hand' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700'}`}
                    onClick={() => handleIconSelection("hand")}
                  >
                    <Hand size={18} />
                  </Button>
                  <Button
                    type="button"
                    variant={config.buttonStyle.icon === 'gift' ? 'default' : 'outline'}
                    className={`flex items-center justify-center min-h-[44px] ${config.buttonStyle.icon === 'gift' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700'}`}
                    onClick={() => handleIconSelection("gift")}
                  >
                    <Gift size={18} />
                  </Button>
                  <Button
                    type="button"
                    variant={config.buttonStyle.icon === 'zap' ? 'default' : 'outline'}
                    className={`flex items-center justify-center min-h-[44px] ${config.buttonStyle.icon === 'zap' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700'}`}
                    onClick={() => handleIconSelection("zap")}
                  >
                    <Zap size={18} />
                  </Button>
                  <Button
                    type="button"
                    variant={config.buttonStyle.icon === 'star' ? 'default' : 'outline'}
                    className={`flex items-center justify-center min-h-[44px] ${config.buttonStyle.icon === 'star' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700'}`}
                    onClick={() => handleIconSelection("star")}
                  >
                    <Star size={18} />
                  </Button>
                  <Button
                    type="button"
                    variant={config.buttonStyle.icon === 'coins' ? 'default' : 'outline'}
                    className={`flex items-center justify-center min-h-[44px] ${config.buttonStyle.icon === 'coins' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700'}`}
                    onClick={() => handleIconSelection("coins")}
                  >
                    <Coins size={18} />
                  </Button>
                  <Button
                    type="button"
                    variant={config.buttonStyle.icon === 'sparkles' ? 'default' : 'outline'}
                    className={`flex items-center justify-center min-h-[44px] ${config.buttonStyle.icon === 'sparkles' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700'}`}
                    onClick={() => handleIconSelection("sparkles")}
                  >
                    <Sparkles size={18} />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base flex items-center gap-2">
                  <Palette size={18} className="text-indigo-400" />
                  Button Colors
                </Label>
                <div className="space-y-4">
                  <RadioGroup 
                    value={useGradient ? "gradient" : "solid"} 
                    onValueChange={(value) => {
                      setUseGradient(value === "gradient");
                      if (value === "solid" && config.buttonStyle.backgroundColor.includes("linear-gradient")) {
                        updateButtonStyle("backgroundColor", "#1E40AF");
                      }
                    }}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="solid" id="solid" />
                      <Label htmlFor="solid">Solid Color</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="gradient" id="gradient" />
                      <Label htmlFor="gradient">Gradient</Label>
                    </div>
                  </RadioGroup>
                  
                  {!useGradient ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-slate-400 mb-1 block">Background</Label>
                        <ColorPicker
                          color={config.buttonStyle.backgroundColor.includes("linear-gradient") ? "#1E40AF" : config.buttonStyle.backgroundColor}
                          onChange={(color) => updateButtonStyle("backgroundColor", color)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-400 mb-1 block">Text</Label>
                        <ColorPicker
                          color={config.buttonStyle.textColor || '#ffffff'}
                          onChange={(color) => updateButtonStyle("textColor", color)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Label className="text-xs text-slate-400 mb-1 block">Gradient Style</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {GRADIENT_OPTIONS.filter(option => option.value !== "none").map((gradient) => (
                          <button
                            key={gradient.value}
                            type="button"
                            className={`h-12 rounded-md border-2 transition-all ${selectedGradient === gradient.value ? 'border-white scale-105' : 'border-transparent opacity-80 hover:opacity-100'}`}
                            style={{ background: gradient.value }}
                            onClick={() => handleGradientChange(gradient.value)}
                          />
                        ))}
                      </div>
                      <div>
                        <Label className="text-xs text-slate-400 mb-1 block">Text Color</Label>
                        <ColorPicker
                          color={config.buttonStyle.textColor || '#ffffff'}
                          onChange={(color) => updateButtonStyle("textColor", color)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="thankYou" className="space-y-6">
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 mb-4">
                <h3 className="text-lg font-semibold mb-4">Thank You Page Preview</h3>
                <div 
                  className="p-8 rounded-lg text-center"
                  style={{
                    background: config.thankYouPage.backgroundColor,
                    color: config.thankYouPage.textColor
                  }}
                >
                  <h4 className="text-2xl font-bold mb-4">Thank You!</h4>
                  <p className="opacity-80">{config.thankYouPage.message}</p>
                  {config.thankYouPage.showConfetti && (
                    <div className="mt-4 text-sm">✨ Confetti will appear here ✨</div>
                  )}
                  {config.thankYouPage.socialLinks && (
                    <div className="flex justify-center mt-4 space-x-3">
                      {config.thankYouPage.socialLinks.twitter && <Twitter size={20} />}
                      {config.thankYouPage.socialLinks.instagram && <Instagram size={20} />}
                      {config.thankYouPage.socialLinks.github && <Github size={20} />}
                      {config.thankYouPage.socialLinks.linkedin && <Linkedin size={20} />}
                    </div>
                  )}
                  {config.thankYouPage.customLink && (
                    <div className="mt-4">
                      <div className="inline-flex items-center gap-1 text-sm px-4 py-2 rounded-full border border-current border-opacity-20">
                        <ExternalLink size={14} />
                        {config.thankYouPage.customLink.text}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            
              <div className="space-y-4">
                <Label htmlFor="tyBackgroundColor" className="text-base flex items-center gap-2">
                  <Palette size={18} className="text-indigo-400" />
                  Background Style
                </Label>
                <RadioGroup 
                  value={useThankYouGradient ? "gradient" : "solid"} 
                  onValueChange={(value) => {
                    setUseThankYouGradient(value === "gradient");
                    if (value === "solid" && config.thankYouPage.backgroundColor.includes("linear-gradient")) {
                      updateThankYouPage("backgroundColor", "#F9FAFB");
                    }
                  }}
                  className="grid grid-cols-2 gap-2 mb-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="solid" id="ty-solid" />
                    <Label htmlFor="ty-solid">Solid Color</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gradient" id="ty-gradient" />
                    <Label htmlFor="ty-gradient">Gradient</Label>
                  </div>
                </RadioGroup>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {!useThankYouGradient ? (
                      <>
                        <Label className="text-xs text-slate-400 mb-1 block">Background Color</Label>
                        <ColorPicker 
                          color={config.thankYouPage.backgroundColor.includes("linear-gradient") ? "#F9FAFB" : config.thankYouPage.backgroundColor} 
                          onChange={(color) => updateThankYouPage("backgroundColor", color)}
                        />
                      </>
                    ) : (
                      <div className="space-y-3">
                        <Label className="text-xs text-slate-400 mb-1 block">Gradient Style</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {GRADIENT_OPTIONS.filter(option => option.value !== "none").map((gradient) => (
                            <button
                              key={gradient.value}
                              type="button"
                              className={`h-12 rounded-md border-2 transition-all ${selectedThankYouGradient === gradient.value ? 'border-white scale-105' : 'border-transparent opacity-80 hover:opacity-100'}`}
                              style={{ background: gradient.value }}
                              onClick={() => handleThankYouGradientChange(gradient.value)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {errors["thankYouPage.backgroundColor"] && (
                      <div className="text-destructive text-sm flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors["thankYouPage.backgroundColor"]}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-xs text-slate-400 mb-1 block">Text Color</Label>
                    <ColorPicker 
                      color={config.thankYouPage.textColor} 
                      onChange={(color) => updateThankYouPage("textColor", color)}
                    />
                    {errors["thankYouPage.textColor"] && (
                      <div className="text-destructive text-sm flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors["thankYouPage.textColor"]}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label htmlFor="tyMessage" className="text-base flex items-center gap-2">
                  <MessageSquare size={18} className="text-indigo-400" />
                  Thank You Message
                </Label>
                <Textarea
                  id="tyMessage"
                  value={config.thankYouPage.message}
                  onChange={(e) => updateThankYouPage("message", e.target.value)}
                  placeholder="Thank you for your support!"
                  className={`bg-slate-800/50 border-slate-700 ${errors["thankYouPage.message"] ? "border-destructive" : ""}`}
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
                  onCheckedChange={(checked) => updateThankYouPage("showConfetti", checked)}
                />
                <Label htmlFor="showConfetti">Show Confetti Animation</Label>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-slate-700/50">
                <h3 className="text-lg font-semibold">Social Media Links</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="twitterLink" className="flex items-center gap-2">
                        <Twitter size={16} />
                        Twitter Link
                      </Label>
                      <Input
                        id="twitterLink"
                        value={config.thankYouPage.socialLinks?.twitter || ""}
                        onChange={(e) => updateSocialLinks("twitter", e.target.value)}
                        placeholder="https://twitter.com/yourusername"
                        className="bg-slate-800/50 border-slate-700"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instagramLink" className="flex items-center gap-2">
                        <Instagram size={16} />
                        Instagram Link
                      </Label>
                      <Input
                        id="instagramLink"
                        value={config.thankYouPage.socialLinks?.instagram || ""}
                        onChange={(e) => updateSocialLinks("instagram", e.target.value)}
                        placeholder="https://instagram.com/yourusername"
                        className="bg-slate-800/50 border-slate-700"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="githubLink" className="flex items-center gap-2">
                        <Github size={16} />
                        GitHub Link
                      </Label>
                      <Input
                        id="githubLink"
                        value={config.thankYouPage.socialLinks?.github || ""}
                        onChange={(e) => updateSocialLinks("github", e.target.value)}
                        placeholder="https://github.com/yourusername"
                        className="bg-slate-800/50 border-slate-700"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="linkedinLink" className="flex items-center gap-2">
                        <Linkedin size={16} />
                        LinkedIn Link
                      </Label>
                      <Input
                        id="linkedinLink"
                        value={config.thankYouPage.socialLinks?.linkedin || ""}
                        onChange={(e) => updateSocialLinks("linkedin", e.target.value)}
                        placeholder="https://linkedin.com/in/yourusername"
                        className="bg-slate-800/50 border-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Custom Link</h3>
                  <Switch 
                    id="customLinkToggle" 
                    checked={customLinkActive}
                    onCheckedChange={toggleCustomLink}
                  />
                </div>
                
                {customLinkActive && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customLinkText">Link Text</Label>
                      <Input
                        id="customLinkText"
                        value={config.thankYouPage.customLink?.text || ""}
                        onChange={(e) => updateCustomLink("text", e.target.value)}
                        placeholder="Visit my website"
                        className="bg-slate-800/50 border-slate-700"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customLinkUrl">Link URL</Label>
                      <Input
                        id="customLinkUrl"
                        value={config.thankYouPage.customLink?.url || ""}
                        onChange={(e) => updateCustomLink("url", e.target.value)}
                        placeholder="https://example.com"
                        className="bg-slate-800/50 border-slate-700"
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="social" className="space-y-6">
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 mb-4">
                <h3 className="text-lg font-semibold mb-4">Social Preview</h3>
                <SocialPreviewCard 
                  ensNameOrAddress={config.ensNameOrAddress || "username.eth"} 
                  socialPreview={config.socialPreview} 
                />
              </div>
            
              <div className="space-y-2">
                <Label htmlFor="previewTitle">Page Title</Label>
                <Input
                  id="previewTitle"
                  value={config.socialPreview.title}
                  onChange={(e) => updateSocialPreview("title", e.target.value)}
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
              
              <div className="space-y-2">
                <Label htmlFor="previewDescription">Description</Label>
                <Textarea
                  id="previewDescription"
                  value={config.socialPreview.description}
                  onChange={(e) => updateSocialPreview("description", e.target.value)}
                  placeholder="Every contribution helps me continue creating awesome content for you!"
                  className={errors["socialPreview.description"] ? "border-destructive" : ""}
                />
                {errors["socialPreview.description"] && (
                  <div className="text-destructive text-sm flex items-center gap-1 mt-1">
                    <AlertCircle size={14} />
                    {errors["socialPreview.description"]}
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="customImage">Custom Preview Image</Label>
                  <Switch 
                    id="customImage" 
                    checked={config.socialPreview.useCustomImage}
                    onCheckedChange={(checked) => updateSocialPreview("useCustomImage", checked)}
                  />
                </div>
                
                {config.socialPreview.useCustomImage && (
                  <div className="space-y-4">
                    {config.socialPreview.imageUrl && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-700/50">
                        <img 
                          src={config.socialPreview.imageUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={config.socialPreview.imageUrl || ""}
                        onChange={(e) => updateSocialPreview("imageUrl", e.target.value)}
                        placeholder="https://example.com/your-image.jpg"
                        className="bg-slate-800/50 border-slate-700"
                      />
                      <div className="text-xs text-muted-foreground">
                        Recommended size: 1200 x 630 pixels (16:9 ratio)
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-700/50">
                <h3 className="text-lg font-semibold">Embed to your website</h3>
                <div className="space-y-2">
                  <Label>HTML Embed Code</Label>
                  <div className="relative">
                    <div className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-4 font-mono text-xs text-slate-300 overflow-x-auto">
                      {`<script src="https://myyodlbutton.lovable.app/embed.js" data-slug="${config.slug}" async></script>`}
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="absolute top-2 right-2"
                      onClick={() => {
                        navigator.clipboard.writeText(`<script src="https://myyodlbutton.lovable.app/embed.js" data-slug="${config.slug}" async></script>`);
                        toast({
                          title: "Copied to clipboard",
                          description: "Embed code has been copied to your clipboard",
                        });
                      }}
                    >
                      <CopyIcon size={14} className="mr-1" /> Copy
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add this code to your website to embed your Yodl payment button.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end mt-8 pt-6 border-t border-slate-700/50">
            <Button 
              type="submit" 
              className="w-full md:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save Configuration
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default ConfigurationForm;
