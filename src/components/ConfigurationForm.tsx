
import { useState } from "react";
import { UserConfig, ButtonStyle, ThankYouPageStyle } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { validateHexColor, isValidEnsOrAddress, isValidSlug } from "@/utils/validation";
import { Check, ChevronsUpDown, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

const DEFAULT_CONFIG: UserConfig = {
  ensNameOrAddress: "",
  buttonStyle: DEFAULT_BUTTON_STYLE,
  thankYouPage: DEFAULT_THANK_YOU_STYLE,
  slug: ""
};

const ConfigurationForm = ({
  initialConfig = DEFAULT_CONFIG,
  onConfigChange,
  onSave
}: ConfigurationFormProps) => {
  const [config, setConfig] = useState<UserConfig>(initialConfig);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateConfig = (key: keyof UserConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigChange(newConfig);
    validateField(key, value);
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
      "thankYouPage.message": validateField("thankYouPage.message", config.thankYouPage.message)
    };
    
    return Object.values(fieldValidations).every(valid => valid);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(config);
      toast({
        title: "Configuration saved",
        description: "Your payment button has been successfully created",
      });
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
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="button">Button Style</TabsTrigger>
              <TabsTrigger value="thankYou">Thank You Page</TabsTrigger>
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
                  placeholder="vitalik.eth or 0x123..."
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
                <Input
                  id="slug"
                  value={config.slug}
                  onChange={(e) => updateConfig("slug", e.target.value)}
                  placeholder="my-coffee-button"
                  className={errors.slug ? "border-destructive" : ""}
                />
                {errors.slug && (
                  <div className="text-destructive text-sm flex items-center gap-1 mt-1">
                    <AlertCircle size={14} />
                    {errors.slug}
                  </div>
                )}
                <div className="text-muted-foreground text-xs mt-1">
                  This will be used in your payment URL: yourdomain.com/pay/<strong>{config.slug || "your-slug"}</strong>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="button" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded border" 
                      style={{ backgroundColor: config.buttonStyle.backgroundColor }}
                    />
                    <Input
                      id="backgroundColor"
                      value={config.buttonStyle.backgroundColor}
                      onChange={(e) => updateButtonStyle("backgroundColor", e.target.value)}
                      placeholder="#000000"
                      className={errors["buttonStyle.backgroundColor"] ? "border-destructive" : ""}
                    />
                  </div>
                  {errors["buttonStyle.backgroundColor"] && (
                    <div className="text-destructive text-sm flex items-center gap-1 mt-1">
                      <AlertCircle size={14} />
                      {errors["buttonStyle.backgroundColor"]}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded border" 
                      style={{ backgroundColor: config.buttonStyle.textColor }}
                    />
                    <Input
                      id="textColor"
                      value={config.buttonStyle.textColor}
                      onChange={(e) => updateButtonStyle("textColor", e.target.value)}
                      placeholder="#FFFFFF"
                      className={errors["buttonStyle.textColor"] ? "border-destructive" : ""}
                    />
                  </div>
                  {errors["buttonStyle.textColor"] && (
                    <div className="text-destructive text-sm flex items-center gap-1 mt-1">
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
                  <Input
                    id="borderRadius"
                    value={config.buttonStyle.borderRadius}
                    onChange={(e) => updateButtonStyle("borderRadius", e.target.value)}
                    placeholder="4px"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Input
                    id="fontSize"
                    value={config.buttonStyle.fontSize}
                    onChange={(e) => updateButtonStyle("fontSize", e.target.value)}
                    placeholder="16px"
                  />
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
            
            <TabsContent value="thankYou" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tyBackgroundColor">Background Color</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded border" 
                      style={{ backgroundColor: config.thankYouPage.backgroundColor }}
                    />
                    <Input
                      id="tyBackgroundColor"
                      value={config.thankYouPage.backgroundColor}
                      onChange={(e) => updateThankYouStyle("backgroundColor", e.target.value)}
                      placeholder="#F9FAFB"
                      className={errors["thankYouPage.backgroundColor"] ? "border-destructive" : ""}
                    />
                  </div>
                  {errors["thankYouPage.backgroundColor"] && (
                    <div className="text-destructive text-sm flex items-center gap-1 mt-1">
                      <AlertCircle size={14} />
                      {errors["thankYouPage.backgroundColor"]}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tyTextColor">Text Color</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded border" 
                      style={{ backgroundColor: config.thankYouPage.textColor }}
                    />
                    <Input
                      id="tyTextColor"
                      value={config.thankYouPage.textColor}
                      onChange={(e) => updateThankYouStyle("textColor", e.target.value)}
                      placeholder="#111827"
                      className={errors["thankYouPage.textColor"] ? "border-destructive" : ""}
                    />
                  </div>
                  {errors["thankYouPage.textColor"] && (
                    <div className="text-destructive text-sm flex items-center gap-1 mt-1">
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
          </Tabs>
          
          <Button type="submit" className="mt-6 w-full">
            Create Payment Button
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default ConfigurationForm;
