
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRCodeGeneratorProps {
  paymentUrl: string;
  title?: string;
}

const QRCodeGenerator = ({ paymentUrl, title = "Payment QR Code" }: QRCodeGeneratorProps) => {
  const { toast } = useToast();
  const [qrSize, setQrSize] = useState(180);
  
  const downloadQRCode = () => {
    const canvas = document.getElementById("payment-qr-code") as HTMLElement;
    const svgData = new XMLSerializer().serializeToString(canvas);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "payment-qr-code.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast({
      title: "QR Code Downloaded",
      description: "The QR code has been downloaded successfully.",
    });
  };
  
  const refreshQRCode = () => {
    // Toggle size slightly to force a re-render
    setQrSize(prev => prev === 180 ? 181 : 180);
    
    toast({
      title: "QR Code Refreshed",
      description: "The QR code has been regenerated.",
    });
  };
  
  return (
    <Card className="bg-black/40 border-indigo-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <QrCode className="h-5 w-5 text-indigo-400" />
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="bg-white p-3 rounded-lg">
          <QRCodeSVG
            id="payment-qr-code"
            value={paymentUrl}
            size={qrSize}
            level="H" // High error correction
            includeMargin={true}
            imageSettings={{
              src: "/placeholder.svg",
              x: undefined,
              y: undefined,
              height: 24,
              width: 24,
              excavate: true,
            }}
          />
        </div>
        
        <div className="flex gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-indigo-950/30 border-indigo-500/30 hover:bg-indigo-900/50"
            onClick={downloadQRCode}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-indigo-950/30 border-indigo-500/30 hover:bg-indigo-900/50"
            onClick={refreshQRCode}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
        
        <p className="text-xs text-slate-400 text-center pt-2">
          Scan this QR code to send a payment to {paymentUrl.split("/").pop()}
        </p>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
