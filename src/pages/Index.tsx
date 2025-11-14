import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardCheck, BarChart3, Settings } from "lucide-react";
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
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Plataforma completa para coleta e análise de NPS com insights em tempo real
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <ClipboardCheck className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold">Pesquisa</h2>
              <p className="text-muted-foreground">
                Interface intuitiva para coleta de feedback dos clientes
              </p>
              <Button onClick={() => navigate("/survey")} className="w-full">
                Responder Pesquisa
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 bg-graphite rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <p className="text-muted-foreground">
                Análise completa de métricas e visualização de dados
              </p>
              <Button onClick={() => navigate("/admin")} variant="outline" className="w-full">
                Acessar Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
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

        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Principais Recursos</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">✓ Score NPS Automático</h3>
              <p className="text-muted-foreground">
                Cálculo em tempo real com categorização de promotores, neutros e detratores
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">✓ Validação de CPF</h3>
              <p className="text-muted-foreground">
                Sistema de máscara e validação para evitar respostas duplicadas
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">✓ Perguntas Dinâmicas</h3>
              <p className="text-muted-foreground">
                Múltiplos tipos de questões configuráveis pelo administrador
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">✓ Exportação de Dados</h3>
              <p className="text-muted-foreground">
                Exporte todas as respostas em formato CSV para análise externa
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
