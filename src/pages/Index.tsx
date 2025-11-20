import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
import logoBlack from "@/assets/logo-black.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16 space-y-6">
          <img src={logoBlack} alt="GO HEALTH" className="h-20 mx-auto" />
          <h1 className="text-5xl font-bold tracking-tight">
            Sistema de Pesquisa de Satisfação
          </h1>
        </div>

        <div className="flex justify-center max-w-md mx-auto">
          <Card className="hover:shadow-lg transition-shadow w-full">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
                <Settings className="w-8 h-8 text-accent-foreground" />
              </div>
              <h2 className="text-2xl font-bold">Gestão</h2>
              <p className="text-muted-foreground">
                Configure questionários e gerencie respostas
              </p>
              <Button onClick={() => navigate("/admin/login")} variant="secondary" className="w-full">
                Login Admin
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
