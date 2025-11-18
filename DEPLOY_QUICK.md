# 🚀 Deploy Rápido - TL;DR

## Opção 1: Digital Ocean App Platform (5 minutos)

```bash
# 1. Push para o GitHub
git add .
git commit -m "Deploy para produção"
git push origin main

# 2. No painel da Digital Ocean:
# - Apps > Create App > GitHub
# - Selecione: nps-insight-hub
# - Configure variáveis de ambiente (veja .env.production.example)
# - Deploy!
```

**URL:** Será gerado automaticamente (ex: `go-health-nps.ondigitalocean.app`)

---

## Opção 2: Docker Local (testar primeiro)

```bash
# Build e rodar
npm run docker:build
npm run docker:run

# Acessar
open http://localhost

# Ver logs
npm run docker:logs

# Parar
npm run docker:stop
```

---

## Opção 3: Droplet + Docker (deploy manual)

```bash
# 1. Criar Droplet no Digital Ocean (Ubuntu 22.04)

# 2. Conectar via SSH
ssh root@SEU_IP

# 3. Instalar Docker
curl -fsSL https://get.docker.com | sh

# 4. Clonar repositório
git clone https://github.com/Luan-DataSpot/nps-insight-hub.git
cd nps-insight-hub

# 5. Deploy
docker-compose up -d

# Pronto! Acesse: http://SEU_IP
```

---

## Opção 4: Script Automatizado

```bash
# Executa build + deploy interativo
./deploy.sh
```

Escolha:
1. Docker local (testar)
2. Copiar para Droplet via SCP
3. Apenas build

---

## 🔧 Variáveis de Ambiente

Copie `.env.production.example` para `.env.production` ou configure no painel da Digital Ocean.

Necessário:
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`

---

## 📚 Documentação Completa

Veja **[DEPLOY_DIGITAL_OCEAN.md](./DEPLOY_DIGITAL_OCEAN.md)** para guia detalhado.

---

## 💰 Custos

- **App Platform:** $5/mês
- **Droplet Basic:** $6/mês
- **Domínio customizado:** ~$12/ano (opcional)

---

## ✅ Checklist Pré-Deploy

- [ ] Build local funciona: `npm run build`
- [ ] Variáveis de ambiente configuradas
- [ ] Código commitado no GitHub
- [ ] Supabase configurado e rodando

---

## 🆘 Troubleshooting

**Erro 404 nas rotas?**
→ Configure `catchall_document: index.html` (já está no `.do/app.yaml`)

**Build falha?**
→ Verifique Node.js versão: `node -v` (precisa 18+)

**Variáveis não carregam?**
→ Certifique-se de que começam com `VITE_`

---

**Feito! Deploy em menos de 10 minutos! 🎉**
