# 🔧 DIAGNÓSTICO DE ERROS - SUPABASE

## 🎯 FERRAMENTAS CRIADAS:

### 1️⃣ Página de Diagnóstico
**URL:** `/diagnostic`

**O que faz:**
- ✅ Verifica se as variáveis de ambiente estão configuradas
- ✅ Testa conexão com o Supabase
- ✅ Testa sistema de autenticação
- ✅ Testa acesso ao banco de dados
- ✅ Mostra logs detalhados de cada teste

**Como usar:**
1. Acesse: `https://gohealth-survey-7lzdy.ondigitalocean.app/diagnostic`
2. Clique em "Executar Diagnóstico"
3. Veja os resultados de cada teste
4. Abra o console (F12) para ver logs detalhados

---

### 2️⃣ Logs Melhorados no Login
**URL:** `/admin/login`

**O que mudou:**
- ✅ Logs detalhados no console
- ✅ Mensagens de erro mais específicas
- ✅ Detecta problemas de configuração
- ✅ Diferencia entre erro 400 e 401

**Como usar:**
1. Acesse: `https://gohealth-survey-7lzdy.ondigitalocean.app/admin/login`
2. Abra o console do navegador (F12 → Console)
3. Tente fazer login
4. Veja os logs detalhados:
   - 🔐 Tentativa de login
   - 📧 Email usado
   - 🌐 URL do Supabase
   - 🔑 Se a ANON_KEY está configurada
   - ❌ Erro detalhado (se houver)

---

## 🧪 PASSO A PASSO PARA DIAGNOSTICAR:

### Após o próximo deploy da Digital Ocean:

#### Teste 1: Página de Diagnóstico
```
1. Acesse: https://gohealth-survey-7lzdy.ondigitalocean.app/diagnostic
2. Clique em "Executar Diagnóstico"
3. Tire um print dos resultados
4. Me envie o print
```

**Resultado esperado:**
```json
{
  "env": {
    "url": "https://lovncddlhqjbawiuigyx.supabase.co",
    "hasAnonKey": true,
    "anonKeyPreview": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi..."
  },
  "connection": {
    "success": true
  },
  "auth": {
    "success": true
  },
  "database": {
    "success": true,
    "recordCount": 1
  }
}
```

---

#### Teste 2: Login com Logs
```
1. Acesse: https://gohealth-survey-7lzdy.ondigitalocean.app/admin/login
2. Abra o console (F12 → Console)
3. Tente fazer login
4. Copie TODOS os logs que aparecerem
5. Me envie os logs
```

**Logs esperados:**
```
🔐 Tentando fazer login...
📧 Email: seu@email.com
🌐 Supabase URL: https://lovncddlhqjbawiuigyx.supabase.co
🔑 ANON_KEY configurada: true
✅ Login bem-sucedido! { userId: "...", email: "..." }
```

**OU se der erro:**
```
🔐 Tentando fazer login...
📧 Email: seu@email.com
🌐 Supabase URL: https://lovncddlhqjbawiuigyx.supabase.co
🔑 ANON_KEY configurada: true
❌ Erro de autenticação: {
  message: "Invalid login credentials",
  status: 400,
  name: "AuthApiError"
}
```

---

## 📊 POSSÍVEIS RESULTADOS:

### Cenário A: Variáveis NÃO configuradas
```
env.url: undefined
env.hasAnonKey: false
```
**Solução:** Verificar variáveis de ambiente na Digital Ocean

---

### Cenário B: Variáveis configuradas mas conexão falha
```
env.url: "https://lovncddlhqjbawiuigyx.supabase.co"
env.hasAnonKey: true
connection.success: false
connection.error: "Failed to fetch"
```
**Solução:** Problema de rede ou Supabase offline

---

### Cenário C: Conexão OK mas auth falha
```
connection.success: true
auth.success: false
auth.error: "Invalid API key"
```
**Solução:** ANON_KEY incorreta

---

### Cenário D: Tudo OK mas login falha
```
connection.success: true
auth.success: true
database.success: true
Login error: "Invalid login credentials"
```
**Solução:** Email/senha incorretos ou usuário não existe

---

## 🚀 PRÓXIMOS PASSOS:

1. ✅ **Código commitado e enviado para GitHub**
2. ⏳ **Aguarde deploy na Digital Ocean** (3-5 minutos)
3. ✅ **Acesse `/diagnostic`** e execute os testes
4. ✅ **Tente fazer login** com console aberto
5. ✅ **Me envie os resultados**

---

## 📝 INFORMAÇÕES IMPORTANTES:

**Variáveis configuradas na Digital Ocean:**
```
VITE_SUPABASE_URL=https://lovncddlhqjbawiuigyx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvdm5jZGRsaHFqYmF3aXVpZ3l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjQzMjksImV4cCI6MjA3OTA0MDMyOX0.7sYDSCwEVp_qWAUykUPaHacxm8VL3OL2qCAg0Fw8D5w
VITE_APP_URL=https://gohealth-survey.site
```

**URLs de teste:**
- Diagnóstico: https://gohealth-survey-7lzdy.ondigitalocean.app/diagnostic
- Login: https://gohealth-survey-7lzdy.ondigitalocean.app/admin/login
- Survey: https://gohealth-survey-7lzdy.ondigitalocean.app/survey/satisfacao-clinica-carlos-portela

---

**Me avise quando o deploy terminar e execute os testes!** 🔍
