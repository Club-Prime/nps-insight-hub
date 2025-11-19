# 🚀 Deploy na Digital Ocean - Guia Completo

Este guia mostra como fazer o deploy do **NPS Insight Hub** na Digital Ocean usando **App Platform**.

**🌐 Domínio:** `gohealth-survey.site`

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter:

1. ✅ **Conta na Digital Ocean** ([criar conta](https://www.digitalocean.com/))
2. ✅ **Repositório GitHub** com o código (já temos!)
3. ✅ **Supabase configurado** com as credenciais
4. ✅ **Domínio próprio:** `gohealth-survey.site` ✅

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

## 🌐 Configuração do Domínio `gohealth-survey.site`

### Passo 1: Configurar DNS

**No seu provedor de domínio (onde você registrou gohealth-survey.site):**

#### Opção A: Usar CNAME (Mais simples)

```
Tipo: CNAME
Nome: @
Valor: [aguardar URL da Digital Ocean]
TTL: 3600
```

#### Opção B: Usar Nameservers da Digital Ocean (Mais controle)

Configure os nameservers:

```
ns1.digitalocean.com
ns2.digitalocean.com
ns3.digitalocean.com
```

### Passo 2: Adicionar Domínio no App Platform

1. **No Digital Ocean App Platform:**
   - Após o deploy, vá em **Settings** → **Domains**
   - Clique em **"Add Domain"**
   - Digite: `gohealth-survey.site`
   - Clique em **"Add Domain"**

2. **Configure subdomínio www (opcional):**
   - Adicione também: `www.gohealth-survey.site`
   - Marque **"Redirect www to non-www"**

3. **SSL Automático:**
   - A Digital Ocean configura SSL (Let's Encrypt) automaticamente
   - Aguarde 5-10 minutos para propagação

### Passo 3: URLs Finais

Após configuração, suas URLs serão:

```
🌐 Survey Pública:
https://gohealth-survey.site/survey/satisfacao-clinica-carlos-portela

🔐 Admin:
https://gohealth-survey.site/admin/login

📊 Dashboard:
https://gohealth-survey.site/admin

🎯 QR Code:
Gerar no admin após login
```

### (Opcional) Subdomínio para Admin

Se quiser separar admin e survey:

```
admin.gohealth-survey.site → Painel administrativo
gohealth-survey.site → Survey pública
```

Configure mais um CNAME:

```
Tipo: CNAME
Nome: admin
Valor: [mesma URL da Digital Ocean]
```

---

## 🔗 Links Importantes

- **Survey:** `https://gohealth-survey.site/survey/satisfacao-clinica-carlos-portela`
- **Admin:** `https://gohealth-survey.site/admin/login`
- **Dashboard DO:** https://cloud.digitalocean.com/apps

---

## 💰 Custo Mensal

- App Platform Basic: **$5/mês**
- Supabase Free Tier: **$0/mês**
- **Total: $5/mês**

---

## ✅ Checklist Pós-Deploy

- [ ] Deploy concluído com sucesso
- [ ] Domínio `gohealth-survey.site` configurado
- [ ] SSL funcionando (https://)
- [ ] Testar survey pública em `https://gohealth-survey.site/survey/satisfacao-clinica-carlos-portela`
- [ ] Fazer login no admin em `https://gohealth-survey.site/admin/login`
  - **Email:** `admin@gohealth.com`
  - **Senha:** `Admin123!`
- [ ] Gerar QR Code da pesquisa
- [ ] Imprimir QR Code para clínica
- [ ] Testar uma resposta completa
- [ ] Verificar resposta no dashboard
- [ ] Compartilhar link com Clínica Carlos Portela
- [ ] Configurar backup automático (opcional)
- [ ] Configurar monitoramento (opcional)

---

## 🎯 Próximos Passos

1. **Imprimir QR Code:**
   - Acesse o admin
   - Visualize a pesquisa
   - Clique no QR Code
   - Baixe a imagem
   - Imprima em alta qualidade

2. **Orientar a Clínica:**
   - Coloque o QR Code na recepção
   - Treine a equipe
   - Monitore as primeiras respostas

3. **Análise de Dados:**
   - Acesse o dashboard regularmente
   - Exporte relatórios CSV
   - Tome ações baseadas no feedback

---

## 🆘 Suporte

**Problemas comuns:**

- **Build falhou:** Verifique as variáveis de ambiente
- **Domínio não carrega:** Aguarde propagação DNS (até 24h)
- **SSL não ativa:** Aguarde 10 minutos após adicionar domínio
- **Survey não carrega:** Verifique URL do Supabase

**Precisa de ajuda?**
- Digital Ocean Docs: https://docs.digitalocean.com/products/app-platform/
- Supabase Docs: https://supabase.com/docs

---

🎉 **Parabéns! Seu sistema NPS está no ar!** 🎉
