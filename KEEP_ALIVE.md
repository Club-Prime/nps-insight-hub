# 🔄 Keep Supabase Alive

## 📋 O que é?

Script automatizado que mantém o banco de dados Supabase ativo, evitando que ele pause por inatividade.

## 🎯 Por que?

O Supabase Free Tier pausa após **7 dias de inatividade**. Este script faz um "ping" a cada 4 dias para manter o banco ativo.

## ⚙️ Como funciona?

1. **GitHub Actions** executa automaticamente a cada 4 dias
2. Faz uma requisição simples ao banco de dados
3. Verifica se o Supabase está respondendo
4. Registra o resultado nos logs

## 🚀 Configuração

### Passo 1: Adicionar Secrets no GitHub

1. Acesse: https://github.com/Club-Prime/nps-insight-hub/settings/secrets/actions
2. Clique em **"New repository secret"**
3. Adicione os seguintes secrets:

#### Secret 1: VITE_SUPABASE_URL
```
Name: VITE_SUPABASE_URL
Value: https://lovncddlhqjbawiuigyx.supabase.co
```

#### Secret 2: VITE_SUPABASE_ANON_KEY
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvdm5jZGRsaHFqYmF3aXVpZ3l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2MTQ2NjksImV4cCI6MjA0NzE5MDY2OX0.bDwN9xkCwD3MmY76FEE3DIQ-Uh-cMCu0Ij1j_ksZB9E
```

### Passo 2: Commit e Push

```bash
cd /home/luanps/nps-hub-go-health
git add .github/workflows/keep-supabase-alive.yml
git commit -m "feat: Adiciona script keep-alive para Supabase"
git push clubprime main
```

### Passo 3: Ativar GitHub Actions

1. Acesse: https://github.com/Club-Prime/nps-insight-hub/actions
2. Se necessário, clique em **"Enable Actions"**
3. Veja o workflow: **"Keep Supabase Alive"**

## 📅 Agendamento

```
Frequência: A cada 4 dias
Horário: 8:00 UTC (5:00 AM Brasília)
Próximas execuções:
  - Dia 1
  - Dia 5
  - Dia 9
  - Etc...
```

## 🧪 Testar Manualmente

1. Acesse: https://github.com/Club-Prime/nps-insight-hub/actions
2. Selecione **"Keep Supabase Alive"**
3. Clique em **"Run workflow"**
4. Aguarde 10-20 segundos
5. Veja o resultado nos logs

## 📊 Monitoramento

### Ver Logs

1. Acesse: https://github.com/Club-Prime/nps-insight-hub/actions
2. Clique no workflow mais recente
3. Clique em **"ping-database"**
4. Veja os logs:

```
✅ Supabase está ativo! (HTTP 200)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Keep-Alive executado com sucesso!
📅 Data: 2025-11-18 08:00:00 UTC
🔄 Próxima execução: Daqui a 4 dias
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Notificações

- ✅ **Sucesso:** Silencioso (veja nos logs)
- ❌ **Falha:** Aparece na aba Actions do GitHub

## 🔧 Troubleshooting

### ❌ Workflow não está executando

**Solução:**
- Verifique se GitHub Actions está ativado
- Verifique se os secrets estão configurados
- Rode manualmente uma vez

### ❌ HTTP 401 (Unauthorized)

**Solução:**
- Verifique o secret `VITE_SUPABASE_ANON_KEY`
- Confirme se a chave está correta

### ❌ HTTP 404 (Not Found)

**Solução:**
- Verifique o secret `VITE_SUPABASE_URL`
- Confirme se a URL está correta

## 💡 Alternativas

### Opção 2: Cron-Job.org (Grátis)

1. Acesse: https://cron-job.org/
2. Crie uma conta
3. Adicione um job:
   - URL: `https://lovncddlhqjbawiuigyx.supabase.co/rest/v1/questionnaires?limit=1`
   - Headers: `apikey: eyJhbGci...`
   - Frequência: A cada 4 dias

### Opção 3: UptimeRobot (Grátis)

1. Acesse: https://uptimerobot.com/
2. Adicione um monitor HTTP
3. URL: Seu site na Digital Ocean
4. Intervalo: A cada 5 minutos (mantém tudo ativo)

## ✅ Status

- [x] Script criado
- [ ] Secrets configurados
- [ ] Push para GitHub
- [ ] Workflow ativo
- [ ] Primeiro teste manual executado

---

🎯 **Resultado:** Supabase nunca vai pausar por inatividade!
