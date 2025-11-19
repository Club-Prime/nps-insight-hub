import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import logoWhite from "@/assets/logo-white.png";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔐 Tentando fazer login...');
      console.log('📧 Email:', formData.email);
      console.log('🌐 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('🔑 ANON_KEY configurada:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error('❌ Erro de autenticação:', {
          message: error.message,
          status: error.status,
          name: error.name,
        });
        throw error;
      }

      console.log('✅ Login bem-sucedido!', {
        userId: data.user?.id,
        email: data.user?.email,
      });

      toast.success("Login realizado com sucesso!");
      navigate("/admin");
    } catch (error: any) {
      console.error('❌ Erro completo:', error);
      
      let errorMessage = "Erro ao fazer login";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.status === 400) {
        errorMessage = "Email ou senha inválidos";
      } else if (error.status === 401) {
        errorMessage = "Credenciais inválidas. Verifique seu email e senha.";
      } else if (!import.meta.env.VITE_SUPABASE_URL) {
        errorMessage = "⚠️ ERRO DE CONFIGURAÇÃO: VITE_SUPABASE_URL não configurada!";
      } else if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
        errorMessage = "⚠️ ERRO DE CONFIGURAÇÃO: VITE_SUPABASE_ANON_KEY não configurada!";
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <img src={logoWhite} alt="GO HEALTH" className="h-16 mx-auto invert" />
          <CardTitle className="text-2xl">Painel Administrativo</CardTitle>
          <CardDescription>Entre com suas credenciais</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
