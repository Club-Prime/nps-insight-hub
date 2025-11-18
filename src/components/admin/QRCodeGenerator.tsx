import { useState, useRef } from "react";
import QRCodeSVG from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface QRCodeGeneratorProps {
  questionnaireId: string;
  questionnaireTitle: string;
  slug?: string;
}

export const QRCodeGenerator = ({ questionnaireId, questionnaireTitle, slug }: QRCodeGeneratorProps) => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  
  // URL da pesquisa - usando variável de ambiente ou fallback para origin atual
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const surveyUrl = `${baseUrl}/survey/${slug || questionnaireId}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl);
      setCopied(true);
      toast.success("URL copiada!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Erro ao copiar URL");
    }
  };

  const handleDownloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    // Converter SVG para PNG
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    // Tamanho do QR Code
    canvas.width = 512;
    canvas.height = 512;

    img.onload = () => {
      if (!ctx) return;
      
      // Fundo branco
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Desenhar QR Code
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `qrcode-${slug || questionnaireId}.png`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("QR Code baixado!");
      });
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleDownloadSVG = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qrcode-${slug || questionnaireId}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("QR Code SVG baixado!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📱</span>
          {questionnaireTitle}
        </CardTitle>
        <CardDescription>
          Compartilhe este QR Code para que os usuários possam responder a pesquisa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* QR Code Display */}
        <div className="flex flex-col items-center gap-4">
          <div
            ref={qrRef}
            className="bg-white p-6 rounded-lg border-4 border-graphite shadow-lg"
          >
            <QRCodeSVG
              value={surveyUrl}
              size={256}
              level="H"
              fgColor="#000000"
              bgColor="#FFFFFF"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={handleDownloadQR} variant="default" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Baixar PNG
            </Button>
            <Button onClick={handleDownloadSVG} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Baixar SVG
            </Button>
          </div>
        </div>

        {/* URL Section */}
        <div className="space-y-3">
          <Label htmlFor="survey-url" className="text-base font-semibold">
            Link da Pesquisa
          </Label>
          <div className="flex gap-2">
            <Input
              id="survey-url"
              value={surveyUrl}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              onClick={handleCopyUrl}
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
            <Button
              onClick={() => window.open(surveyUrl, "_blank")}
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Este link pode ser compartilhado diretamente ou através do QR Code acima
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-secondary/50 p-4 rounded-lg border border-border">
          <h4 className="font-semibold mb-2 text-sm">📋 Como usar:</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Baixe o QR Code no formato PNG ou SVG</li>
            <li>Imprima e distribua em locais estratégicos</li>
            <li>Ou compartilhe o link diretamente nas redes sociais</li>
            <li>Os usuários podem escanear e responder instantaneamente</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
