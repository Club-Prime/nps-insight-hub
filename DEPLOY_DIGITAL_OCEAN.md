# 🚀 Deploy na Digital Ocean - NPS Hub Go Health

## 📋 Pré-requisitos

- [ ] Conta na Digital Ocean
- [ ] Código commitado no GitHub ✅
- [ ] Supabase configurado e rodando ✅
- [ ] Variáveis de ambiente prontas ✅

---

## 🎯 Opção 1: Deploy com App Platform (RECOMENDADO)

### Passo 1: Criar App

1. Acesse: https://cloud.digitalocean.com/apps
2. Clique em **"Create App"**
3. Selecione **"GitHub"** como source
4. Conecte sua conta GitHub
5. Selecione o repositório: **`Luan-DataSpot/nps-insight-hub`**
6. Branch: **`main`**
7. Clique em **"Next"**

### Passo 2: Configurar Build

**Detecta automaticamente Vite!**

- **Type:** Web Service
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **HTTP Port:** `8080`

Clique em **"Next"**

### Passo 3: Adicionar Variáveis de Ambiente

Clique em **"Environment Variables"** e adicione:

```env
VITE_SUPABASE_URL=https://lovncddlhqjbawiuigyx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvdm5jZGRsaHFqYmF3aXVpZ3l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2MTQ2NjksImV4cCI6MjA0NzE5MDY2OX0.bDwN9xkCwD3MmY76FEE3DIQ-Uh-cMCu0Ij1j_ksZB9E
```

### Passo 4: Escolher Plano

**Opções:**

1. **Basic - $5/mês** (RECOMENDADO)
   - 512 MB RAM
   - 1 vCPU

2. **Professional - $12/mês**
   - 1 GB RAM
   - Melhor performance

### Passo 5: Deploy

1. Review configurações
2. Clique em **"Create Resources"**
3. Aguarde build (2-5 minutos)
4. ✅ URL: `nps-hub-xxxxx.ondigitalocean.app`

---

## 🔗 Links Importantes

- **Survey:** `https://seu-app.ondigitalocean.app/survey/satisfacao-clinica-carlos-portela`
- **Admin:** `https://seu-app.ondigitalocean.app/admin/login`
- **Dashboard DO:** https://cloud.digitalocean.com/apps

---

## 💰 Custo Mensal

- App Platform Basic: **$5/mês**
- Supabase Free Tier: **$0/mês**
- **Total: $5/mês**

---

## ✅ Checklist Pós-Deploy

- [ ] Testar survey pública
- [ ] Fazer login no admin
- [ ] Gerar QR Code
- [ ] Compartilhar com clínica
- [ ] Monitorar primeiras respostas
