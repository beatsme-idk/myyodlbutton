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
import { Check, AlertCircle, Lightbulb, Settings, Palette, Heart, Coffee, Hand, Gift, Zap, Share2, Upload, ExternalLink, Book, Wallet, Droplet, Twitter, Instagram, Github, Linkedin, Link2, ArrowRight, Star, Coins, Sparkles } from "lucide-react";
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
    currency: "USD",
    amount: "",
    memo: "",
    redirectUrl: ""
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

  const updateConfig = (key: keyof UserConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    
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

  const updateSocialLinks = (network: string, value: string) => {
    const socialLinks = { ...(config.thankYouPage.socialLinks || {}) };
    
    if (value) {
      socialLinks[network as keyof typeof socialLinks] = value;
    } else {
      delete socialLinks[network as keyof typeof socialLinks];
    }
    
    updateThankYouStyle('socialLinks', socialLinks);
  };

  const updateCustomLink = (key: string, value: string) => {
    const customLink = { 
      ...(config.thankYouPage.customLink || { text: '', url: '' }),
      [key]: value
    };
    
    updateThankYouStyle('customLink', customLink);
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
        if (styleKey === "backgroundColor" && value.includes("linear-gradient")) {
          delete newErrors[key];
        } else if (!validateHexColor(value)) {
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
      updateThankYouStyle('customLink', { text: 'Visit my website', url: 'https://example.com' });
    } else {
      updateThankYouStyle('customLink', undefined);
    }
  };
  
  const handleIconSelection = (icon: string) => {
    setSelectedIcon(icon);
    updateButtonStyle("icon", icon);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full animate-slide-up">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl md:text-2xl font-semibold text-gradient-blue flex items-center">
            <svg className="w-5 h-5 mr-2 md:w-6 md:h-6 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Configure Your Button
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
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
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
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
                    https://myyodlbutton.lovable.app/
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
                  This will be used in your payment URL: https://myyodlbutton.lovable.app/<strong>{config.slug || "your-slug"}</strong>
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
                    className="inline-flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                    style={{
                      background: config.buttonStyle.backgroundColor,
                      color: config.buttonStyle.textColor,
                      borderRadius: config.buttonStyle.borderRadius,
                      fontSize: config.buttonStyle.fontSize,
                      padding: config.buttonStyle.padding,
                    }}
                  >
                    <div className="relative mr-2 w-5 h-5">
                      <img 
                        src="https://yodl.me/_next/static/media/new_logo.be0c2fdb.svg" 
                        alt="Yodl"
                        className="w-full h-full drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]"
                      />
                    </div>
                    {selectedIcon !== "none" && (
                      <>
                        {selectedIcon === "heart" && <Heart className="mr-2" size={16} />}
                        {selectedIcon === "coffee" && <Coffee className="mr-2" size={16} />}
                        {selectedIcon === "hand" && <Hand className="mr-2" size={16} />}
                        {selectedIcon === "gift" && <Gift className="mr-2" size={16} />}
                        {selectedIcon === "zap" && <Zap className="mr-2" size={16} />}
                        {selectedIcon === "star" && <Star className="mr-2" size={16} />}
                        {selectedIcon === "coins" && <Coins className="mr-2" size={16} />}
                        {selectedIcon === "sparkles" && <Sparkles className="mr-2" size={16} />}
                      </>
                    )}
                    <span>{config.buttonStyle.buttonText}</span>
                    <ArrowRight className="ml-2 opacity-70" size={16} />
                  </button>
                </div>
              </div>
            
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Droplet className="w-5 h-5 text-indigo-400" />
                  <Label>Background Style</Label>
                </div>
                
                <RadioGroup 
                  value={selectedGradient} 
                  onValueChange={handleGradientChange}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  {GRADIENT_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex items-center">
                        <div 
                          className="w-6 h-6 rounded-full mr-2 border border-gray-600"
                          style={{ 
                            background: option.value === "none" ? config.buttonStyle.backgroundColor : option.value 
                          }}
                        ></div>
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {!useGradient && (
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
              )}
              
              {useGradient && (
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
              )}
              
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={config.buttonStyle.buttonText}
                  onChange={(e) => updateButtonStyle("buttonText", e.target.value)}
                  placeholder="Yodl me a coffee"
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
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">Vertical: {paddingVertical}px</span>
                      </div>
                      <input
                        type="range"
                        min="4"
                        max="32"
                        value={paddingVertical}
                        onChange={(e) => {
                          setPaddingVertical(parseInt(e.target.value));
                          updatePadding();
                        }}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">Horizontal: {paddingHorizontal}px</span>
                      </div>
                      <input
                        type="range"
                        min="8"
                        max="48"
                        value={paddingHorizontal}
                        onChange={(e) => {
                          setPaddingHorizontal(parseInt(e.target.value));
                          updatePadding();
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Droplet className="w-5 h-5 text-indigo-400" />
                  <Label>Button Icon</Label>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={selectedIcon === "none" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleIconSelection("none")}
                    className="rounded-full"
                  >
                    No Icon
                  </Button>
                  
                  <Button
                    type="button"
                    variant={selectedIcon === "heart" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleIconSelection("heart")}
                    className="rounded-full flex items-center gap-1"
                  >
                    <Heart size={14} />
                    Heart
                  </Button>
                  
                  <Button
                    type="button"
                    variant={selectedIcon === "coffee" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleIconSelection("coffee")}
                    className="rounded-full flex items-center gap-1"
                  >
                    <Coffee size={14} />
                    Coffee
                  </Button>
                  
                  <Button
                    type="button"
                    variant={selectedIcon === "hand" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleIconSelection("hand")}
                    className="rounded-full flex items-center gap-1"
                  >
                    <Hand size={14} />
                    Hand
                  </Button>
                  
                  <Button
                    type="button"
                    variant={selectedIcon === "gift" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleIconSelection("gift")}
                    className="rounded-full flex items-center gap-1"
                  >
                    <Gift size={14} />
                    Gift
                  </Button>
                  
                  <Button
                    type="button"
                    variant={selectedIcon === "zap" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleIconSelection("zap")}
                    className="rounded-full flex items-center gap-1"
                  >
                    <Zap size={14} />
                    Zap
                  </Button>
                  
                  <Button
                    type="button"
                    variant={selectedIcon === "star" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleIconSelection("star")}
                    className="rounded-full flex items-center gap-1"
                  >
                    <Star size={14} />
                    Star
                  </Button>
                  
                  <Button
                    type="button"
                    variant={selectedIcon === "coins" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleIconSelection("coins")}
                    className="rounded-full flex items-center gap-1"
                  >
                    <Coins size={14} />
                    Coins
                  </Button>
                  
                  <Button
                    type="button"
                    variant={selectedIcon === "sparkles" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleIconSelection("sparkles")}
                    className="rounded-full flex items-center gap-1"
                  >
                    <Sparkles size={14} />
                    Sparkles
                  </Button>
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
                  className={errors["thankYouPage.message"] ? "border-destructive" : ""}
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
                <Label htmlFor="showConfetti">Show Confetti Animation</Label>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-slate-700/50">
                <h3 className="text-lg font-semibold">Social Media Links</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customLinkText">Link Text</Label>
                      <Input
                        id="customLinkText"
                        value={config.thankYouPage.customLink?.text || ""}
                        onChange={(e) => updateCustomLink("text", e.target.value)}
                        placeholder="Visit my website"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customLinkUrl">Link URL</Label>
                      <Input
                        id="customLinkUrl"
                        value={config.thankYouPage.customLink?.url || ""}
                        onChange={(e) => updateCustomLink("url", e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="social" className="space-y-6">
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 mb-4">
                <h3 className="text-lg font-semibold mb-4">Social Preview</h3>
                <SocialPreviewCard preview={config.socialPreview} />
              </div>
            
              <div className="space-y-2">
                <Label htmlFor="previewTitle">Page Title</Label>
                <Input
                  id="previewTitle"
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
              
              <div className="space-y-2">
                <Label htmlFor="previewDescription">Description</Label>
                <Textarea
                  id="previewDescription"
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
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="customImage">Custom Preview Image</Label>
                  <Switch 
                    id="customImage" 
                    checked={config.socialPreview.useCustomImage}
                    onCheckedChange={(checked) => updateSocialPreviewStyle("useCustomImage", checked)}
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
                    
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" onClick={() => document.getElementById('upload-image')?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </Button>
                      <input
                        id="upload-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="text-xs text-muted-foreground">
                        Recommended size: 1200 x 630 pixels (16:9 ratio)
                      </div>
                    </div>
                  </div>
                )}
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
