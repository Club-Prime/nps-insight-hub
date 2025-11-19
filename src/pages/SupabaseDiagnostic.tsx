import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SupabaseDiagnostic() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult(null);

    const tests = {
      env: {
        url: import.meta.env.VITE_SUPABASE_URL,
        hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        anonKeyPreview: import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 50) + '...',
      },
      connection: null as any,
      auth: null as any,
      database: null as any,
    };

    // Teste 1: Verificar variáveis de ambiente
    console.log('🔍 Variáveis de ambiente:', tests.env);

    // Teste 2: Testar conexão básica
    try {
      const { data, error } = await supabase.from('questionnaires').select('count').limit(1);
      tests.connection = {
        success: !error,
        error: error?.message,
        data: data,
      };
      console.log('🔌 Teste de conexão:', tests.connection);
    } catch (err: any) {
      tests.connection = {
        success: false,
        error: err.message,
      };
      console.error('❌ Erro de conexão:', err);
    }

    // Teste 3: Testar autenticação (sem fazer login)
    try {
      const { data, error } = await supabase.auth.getSession();
      tests.auth = {
        success: !error,
        error: error?.message,
        hasSession: !!data.session,
      };
      console.log('🔐 Teste de auth:', tests.auth);
    } catch (err: any) {
      tests.auth = {
        success: false,
        error: err.message,
      };
      console.error('❌ Erro de auth:', err);
    }

    // Teste 4: Testar query específica
    try {
      const { data, error } = await supabase
        .from('questionnaires')
        .select('id, title, slug')
        .limit(1);
      
      tests.database = {
        success: !error,
        error: error?.message,
        recordCount: data?.length || 0,
        sampleData: data?.[0],
      };
      console.log('💾 Teste de database:', tests.database);
    } catch (err: any) {
      tests.database = {
        success: false,
        error: err.message,
      };
      console.error('❌ Erro de database:', err);
    }

    setResult(tests);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>🔧 Diagnóstico Supabase</CardTitle>
          <CardDescription>
            Teste de conexão e variáveis de ambiente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testConnection} disabled={loading}>
            {loading ? 'Testando...' : 'Executar Diagnóstico'}
          </Button>

          {result && (
            <div className="space-y-4">
              {/* Variáveis de Ambiente */}
              <div className="border rounded-lg p-4">
                <h3 className="font-bold mb-2">📋 Variáveis de Ambiente</h3>
                <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-xs overflow-x-auto">
                  {JSON.stringify(result.env, null, 2)}
                </pre>
              </div>

              {/* Teste de Conexão */}
              <div className="border rounded-lg p-4">
                <h3 className="font-bold mb-2">
                  {result.connection?.success ? '✅' : '❌'} Conexão com Supabase
                </h3>
                <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-xs overflow-x-auto">
                  {JSON.stringify(result.connection, null, 2)}
                </pre>
              </div>

              {/* Teste de Auth */}
              <div className="border rounded-lg p-4">
                <h3 className="font-bold mb-2">
                  {result.auth?.success ? '✅' : '❌'} Sistema de Autenticação
                </h3>
                <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-xs overflow-x-auto">
                  {JSON.stringify(result.auth, null, 2)}
                </pre>
              </div>

              {/* Teste de Database */}
              <div className="border rounded-lg p-4">
                <h3 className="font-bold mb-2">
                  {result.database?.success ? '✅' : '❌'} Acesso ao Banco de Dados
                </h3>
                <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-xs overflow-x-auto">
                  {JSON.stringify(result.database, null, 2)}
                </pre>
              </div>

              {/* Resumo */}
              <div className="border-2 rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                <h3 className="font-bold mb-2 text-lg">📊 Resumo</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    <strong>URL configurada:</strong>{' '}
                    {result.env.url ? '✅' : '❌'}
                  </li>
                  <li>
                    <strong>ANON_KEY configurada:</strong>{' '}
                    {result.env.hasAnonKey ? '✅' : '❌'}
                  </li>
                  <li>
                    <strong>Conexão OK:</strong>{' '}
                    {result.connection?.success ? '✅' : '❌'}
                  </li>
                  <li>
                    <strong>Auth OK:</strong>{' '}
                    {result.auth?.success ? '✅' : '❌'}
                  </li>
                  <li>
                    <strong>Database OK:</strong>{' '}
                    {result.database?.success ? '✅' : '❌'}
                  </li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
