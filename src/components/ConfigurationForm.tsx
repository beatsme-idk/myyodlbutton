
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
import { Check, AlertCircle, Lightbulb, Settings, Palette, Heart, Share2, Upload, ExternalLink, Book, Droplet, HandCoins, DollarSign, Coffee } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ColorPicker from "./ColorPicker";
import LoadingSpinner from "./LoadingSpinner";
import SocialPreviewCard from "./SocialPreviewCard";
import YodlConfig from "./YodlConfig";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MobileButtonPreview from "./MobileButtonPreview";
import { useIsMobile } from "@/hooks/use-mobile";

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
  buttonTextType: "custom",
  iconType: "coffee",
  tipText: "Tip me",
  donateText: "Donate",
  payText: "Pay now"
};

const DEFAULT_THANK_YOU_STYLE: ThankYouPageStyle = {
  backgroundColor: "#F9FAFB",
  textColor: "#111827",
  message: "Thank you for your support! It means a lot to me.",
  showConfetti: true,
  accentColor: "#8B5CF6",
  headerText: "Thank You!",
  showTransactionDetails: true,
  showReturnHomeButton: true,
  showShareButton: true,
  animation: "bounce"
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
    enabled: true,
    tokens: "USDC,USDT",
    chains: "base,oeth",
    currency: "USD",
    amount: "",
    memo: "",
    webhooks: []
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
  const isMobile = useIsMobile();

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
  }, [config.buttonStyle.padding, config.buttonStyle.backgroundColor]);

  const updateConfig = (key: keyof UserConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    
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

  const handleButtonTextTypeChange = (type: ButtonStyle["buttonTextType"]) => {
    let buttonText = config.buttonStyle.buttonText;
    
    // Set default text based on type
    switch (type) {
      case "tip":
        buttonText = config.buttonStyle.tipText || "Tip me";
        break;
      case "donate":
        buttonText = config.buttonStyle.donateText || "Donate";
        break;
      case "pay":
        buttonText = config.buttonStyle.payText || "Pay now";
        break;
      case "custom":
        // Keep current text
        break;
    }
    
    const newButtonStyle = { 
      ...config.buttonStyle, 
      buttonTextType: type,
      buttonText: buttonText
    };
    
    const newConfig = { ...config, buttonStyle: newButtonStyle };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const handleButtonIconTypeChange = (iconType: ButtonStyle["iconType"]) => {
    const newButtonStyle = { 
      ...config.buttonStyle, 
      iconType: iconType
    };
    
    const newConfig = { ...config, buttonStyle: newButtonStyle };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const handleAnimationChange = (animation: ThankYouPageStyle["animation"]) => {
    updateThankYouStyle("animation", animation);
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
                    https://tributee.lovable.app/pay/
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
                  This will be used in your payment URL: https://tributee.lovable.app/pay/<strong>{config.slug || "your-slug"}</strong>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="button" className="space-y-6">
              {!isMobile && (
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
                      {config.buttonStyle.buttonText}
                    </button>
                  </div>
                </div>
              )}
            
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
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Book className="w-5 h-5 text-indigo-400" />
                  <Label>Button Text Type</Label>
                </div>
                
                <RadioGroup 
                  value={config.buttonStyle.buttonTextType || "custom"} 
                  onValueChange={(value) => handleButtonTextTypeChange(value as ButtonStyle["buttonTextType"])}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tip" id="tip-text" />
                    <Label htmlFor="tip-text" className="flex items-center">
                      <HandCoins className="w-4 h-4 mr-2 text-green-400" />
                      Tip
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="donate" id="donate-text" />
                    <Label htmlFor="donate-text" className="flex items-center">
                      <Heart className="w-4 h-4 mr-2 text-pink-400" />
                      Donate
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pay" id="pay-text" />
                    <Label htmlFor="pay-text" className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-blue-400" />
                      Pay
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom-text" />
                    <Label htmlFor="custom-text" className="flex items-center">
                      <Coffee className="w-4 h-4 mr-2 text-amber-400" />
                      Custom
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={config.buttonStyle.buttonText}
                  onChange={(e) => updateButtonStyle("buttonText", e.target.value)}
                  placeholder="Yodl me a coffee"
                  className={errors["buttonStyle.buttonText"] ? "border-destructive" : ""}
                  disabled={config.buttonStyle.buttonTextType !== "custom"}
                />
                {config.buttonStyle.buttonTextType !== "custom" && (
                  <p className="text-xs text-slate-400 mt-1">
                    Select "Custom" to use your own button text
                  </p>
                )}
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
                  <h4 className="text-2xl font-bold mb-4">{config.thankYouPage.headerText || "Thank You!"}</h4>
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
              
              <div className="space-y-3">
                <Label htmlFor="tyAccentColor">Accent Color</Label>
                <ColorPicker 
                  color={config.thankYouPage.accentColor || "#8B5CF6"} 
                  onChange={(color) => updateThankYouStyle("accentColor", color)}
                />
                <p className="text-xs text-slate-400">
                  Used for highlights, icons, and decorative elements
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tyHeaderText">Header Text</Label>
                <Input
                  id="tyHeaderText"
                  value={config.thankYouPage.headerText || "Thank You!"}
                  onChange={(e) => updateThankYouStyle("headerText", e.target.value)}
                  placeholder="Thank You!"
                />
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

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Settings className="w-5 h-5 text-indigo-400" />
                  <Label>Animation Style</Label>
                </div>
                
                <RadioGroup 
                  value={config.thankYouPage.animation || "bounce"} 
                  onValueChange={(value) => handleAnimationChange(value as ThankYouPageStyle["animation"])}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bounce" id="bounce-anim" />
                    <Label htmlFor="bounce-anim">Bounce</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pulse" id="pulse-anim" />
                    <Label htmlFor="pulse-anim">Pulse</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wave" id="wave-anim" />
                    <Label htmlFor="wave-anim">Wave</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="no-anim" />
                    <Label htmlFor="no-anim">None</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-4">
                <Label>Display Options</Label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showConfetti"
                      checked={config.thankYouPage.showConfetti}
                      onCheckedChange={(checked) => updateThankYouStyle("showConfetti", checked)}
                    />
                    <Label htmlFor="showConfetti">Show confetti animation</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showTransactionDetails"
                      checked={config.thankYouPage.showTransactionDetails !== false}
                      onCheckedChange={(checked) => updateThankYouStyle("showTransactionDetails", checked)}
                    />
                    <Label htmlFor="showTransactionDetails">Show transaction details</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showReturnHomeButton"
                      checked={config.thankYouPage.showReturnHomeButton !== false}
                      onCheckedChange={(checked) => updateThankYouStyle("showReturnHomeButton", checked)}
                    />
                    <Label htmlFor="showReturnHomeButton">Show return home button</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showShareButton"
                      checked={config.thankYouPage.showShareButton !== false}
                      onCheckedChange={(checked) => updateThankYouStyle("showShareButton", checked)}
                    />
                    <Label htmlFor="showShareButton">Show share button</Label>
                  </div>
                </div>
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
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="max-w-sm"
                        />
                        <p className="text-xs text-slate-400 mt-1">
                          Recommended size: 1200x630 pixels
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="yodl" className="space-y-6">
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 mb-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <img 
                    src="https://yodl.me/_next/static/media/new_logo.be0c2fdb.svg" 
                    alt="Yodl"
                    className="w-5 h-5 mr-2 drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]"
                  />
                  Yodl Payment Settings
                </h3>
                <p className="text-sm text-slate-300 mb-2">
                  Yodl is a protocol that makes it easy to accept crypto payments across 
                  multiple chains and tokens.
                </p>
                <div className="flex items-center mt-4">
                  <a 
                    href="https://yodl.me" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <ExternalLink size={12} />
                    Learn more about Yodl
                  </a>
                </div>
              </div>

              <YodlConfig 
                config={config.yodlConfig || DEFAULT_CONFIG.yodlConfig!} 
                onChange={(yodlConfig) => updateConfig("yodlConfig", yodlConfig)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>

        <div className="px-6 py-4 border-t border-slate-700/20 flex justify-end">
          <Button 
            type="submit" 
            className="px-6 flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save and Create Button
              </>
            )}
          </Button>
        </div>
      </Card>
      
      {isMobile && <MobileButtonPreview buttonStyle={config.buttonStyle} />}
    </form>
  );
};

export default ConfigurationForm;
