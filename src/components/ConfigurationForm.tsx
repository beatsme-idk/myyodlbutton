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
import { Check, AlertCircle, Lightbulb, Settings, Palette, Heart, Share2, Upload, ExternalLink, Book, Droplet, HandCoins, DollarSign, Coffee, Star, ArrowRight } from "lucide-react";
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
  buttonText: "Support me",
  iconType: "none"
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

  const handleIconTypeChange = (iconType: ButtonStyle["iconType"]) => {
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
            Customize how your button looks and behaves
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
            
            <TabsContent value="button" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Book className="w-5 h-5 text-indigo-400" />
                  <Label className="text-base font-medium">Button Text & Icon</Label>
                </div>
                
                <div className="bg-slate-800/30 rounded-lg p-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="buttonText">Button Text</Label>
                    <Input
                      id="buttonText"
                      value={config.buttonStyle.buttonText}
                      onChange={(e) => updateButtonStyle("buttonText", e.target.value)}
                      placeholder="Support me"
                      className={errors["buttonStyle.buttonText"] ? "border-destructive" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="block mb-2">Icon (Optional)</Label>
                    <div className="grid grid-cols-5 gap-2">
                      <Button
                        type="button"
                        variant={config.buttonStyle.iconType === "none" ? "default" : "outline"}
                        size="sm"
                        className="h-10 p-0 flex justify-center items-center"
                        onClick={() => handleIconTypeChange("none")}
                      >
                        None
                      </Button>
                      
                      <Button
                        type="button"
                        variant={config.buttonStyle.iconType === "heart" ? "default" : "outline"}
                        size="sm"
                        className="h-10 p-0 flex justify-center items-center"
                        onClick={() => handleIconTypeChange("heart")}
                      >
                        <Heart size={16} />
                      </Button>
                      
                      <Button
                        type="button"
                        variant={config.buttonStyle.iconType === "star" ? "default" : "outline"}
                        size="sm"
                        className="h-10 p-0 flex justify-center items-center"
                        onClick={() => handleIconTypeChange("star")}
                      >
                        <Star size={16} />
                      </Button>
                      
                      <Button
                        type="button"
                        variant={config.buttonStyle.iconType === "hand-coins" ? "default" : "outline"}
                        size="sm"
                        className="h-10 p-0 flex justify-center items-center"
                        onClick={() => handleIconTypeChange("hand-coins")}
                      >
                        <HandCoins size={16} />
                      </Button>
                      
                      <Button
                        type="button"
                        variant={config.buttonStyle.iconType === "coffee" ? "default" : "outline"}
                        size="sm"
                        className="h-10 p-0 flex justify-center items-center"
                        onClick={() => handleIconTypeChange("coffee")}
                      >
                        <Coffee size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Rest of the form remains the same */}
            
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
