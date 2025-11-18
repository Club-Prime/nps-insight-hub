# 🚀 Guia de Deploy - Digital Ocean

Este guia mostra como fazer deploy do **GO HEALTH - Sistema de Pesquisa NPS** na Digital Ocean usando diferentes métodos.

## 📋 Pré-requisitos

- Conta na Digital Ocean
- Git instalado localmente
- Node.js 20+ instalado (para testes locais)
- Docker instalado (opcional, apenas para método Docker)

## 🎯 Métodos de Deploy

### Método 1: Digital Ocean App Platform (Recomendado - Mais Fácil)

O App Platform é a opção mais simples, com deploy automático do GitHub.

#### Passo 1: Preparar o Repositório

```bash
# Certifique-se de que o código está no GitHub
git add .
git commit -m "Preparando para deploy"
git push origin main
```

#### Passo 2: Criar App no Digital Ocean

1. Acesse [Digital Ocean App Platform](https://cloud.digitalocean.com/apps)
2. Clique em **"Create App"**
3. Selecione **GitHub** como source
4. Escolha o repositório: `nps-insight-hub`
5. Escolha o branch: `main`

#### Passo 3: Configurar Build Settings

Na seção **"Build and Deploy"**, configure:

- **Build Command:**
  ```bash
  npm install && npm run build
  ```

- **Output Directory:**
  ```
  dist
  ```

- **HTTP Port:** `8080` (ou deixe em branco para usar 80)

#### Passo 4: Configurar Variáveis de Ambiente

Na seção **"Environment Variables"**, adicione:

```
VITE_SUPABASE_PROJECT_ID=tiogvhhkfvtjzkwpfpeg
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpb2d2aGhrZnZ0anprd3BmcGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzM2MzIsImV4cCI6MjA3ODcwOTYzMn0.GUNw1rfowXcByKL9gvC-qT4IG890VTWO_mmFyHN9XjI
VITE_SUPABASE_URL=https://tiogvhhkfvtjzkwpfpeg.supabase.co
```

#### Passo 5: Configurar como Site Estático

1. Em **"Resource Type"**, selecione **"Static Site"**
2. Em **"Routes"**, configure a rota de fallback para SPA:
   - Adicione um arquivo `.do/app.yaml` no repositório (veja abaixo)

#### Passo 6: Review e Deploy

1. Revise as configurações
2. Clique em **"Create Resources"**
3. Aguarde o build e deploy (5-10 minutos)
4. Seu site estará disponível em: `https://seu-app.ondigitalocean.app`

---

### Método 2: Digital Ocean Droplet com Docker (Controle Total)

Para mais controle sobre a infraestrutura, use um Droplet com Docker.

#### Passo 1: Criar Droplet

1. Acesse [Digital Ocean Droplets](https://cloud.digitalocean.com/droplets)
2. Clique em **"Create Droplet"**
3. Escolha:
   - **Imagem:** Ubuntu 22.04 LTS
   - **Plan:** Basic ($6/mês - 1GB RAM, 1 vCPU)
   - **Datacenter:** Escolha mais próximo do Brasil (NY ou TOR)
   - **Authentication:** SSH Key (recomendado) ou Password
4. Clique em **"Create Droplet"**

#### Passo 2: Conectar ao Droplet

```bash
# Conecte via SSH (substitua o IP)
ssh root@seu_ip_do_droplet
```

#### Passo 3: Instalar Docker

```bash
# Atualizar sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
apt install docker-compose -y

# Verificar instalação
docker --version
docker-compose --version
```

#### Passo 4: Clonar o Repositório

```bash
# Instalar Git
apt install git -y

# Clonar repositório
cd /opt
git clone https://github.com/Luan-DataSpot/nps-insight-hub.git
cd nps-insight-hub
```

#### Passo 5: Configurar Variáveis de Ambiente

```bash
# Criar arquivo .env.production
cat > .env.production << 'EOF'
VITE_SUPABASE_PROJECT_ID=tiogvhhkfvtjzkwpfpeg
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpb2d2aGhrZnZ0anprd3BmcGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzM2MzIsImV4cCI6MjA3ODcwOTYzMn0.GUNw1rfowXcByKL9gvC-qT4IG890VTWO_mmFyHN9XjI
VITE_SUPABASE_URL=https://tiogvhhkfvtjzkwpfpeg.supabase.co
EOF
```

#### Passo 6: Build e Deploy com Docker

```bash
# Build da imagem
docker build -t go-health-nps:latest .

# Rodar container
docker run -d \
  --name go-health-nps \
  --restart unless-stopped \
  -p 80:80 \
  go-health-nps:latest

# Ou usar Docker Compose (mais simples)
docker-compose up -d
```

#### Passo 7: Verificar Status

```bash
# Ver logs
docker logs go-health-nps

# Ver containers rodando
docker ps

# Testar localmente
curl http://localhost/health
```

#### Passo 8: Configurar Firewall

```bash
# Permitir HTTP e HTTPS
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

#### Passo 9: Configurar Domínio (Opcional)

1. No Digital Ocean, vá em **Networking > Domains**
2. Adicione seu domínio
3. Crie um registro A apontando para o IP do Droplet
4. Aguarde propagação DNS (até 48h)

---

### Método 3: Build Manual e Upload (Mais Simples)

Se preferir não usar Docker, pode fazer build local e fazer upload dos arquivos.

#### Passo 1: Build Local

```bash
# No seu computador local
cd /home/luanps/nps-hub-go-health

# Instalar dependências
npm install

# Build de produção
npm run build

# Arquivos gerados estarão em: ./dist/
```

#### Passo 2: Criar Droplet

Siga os passos 1-3 do Método 2 (Criar Droplet e Conectar)

#### Passo 3: Instalar Nginx

```bash
# No Droplet
apt update
apt install nginx -y
```

#### Passo 4: Upload dos Arquivos

```bash
# No seu computador local, use SCP para enviar arquivos
scp -r dist/* root@seu_ip:/var/www/html/
```

#### Passo 5: Configurar Nginx

```bash
# No Droplet, criar config do Nginx
cat > /etc/nginx/sites-available/go-health << 'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Ativar site
ln -s /etc/nginx/sites-available/go-health /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Testar configuração
nginx -t

# Reiniciar Nginx
systemctl restart nginx
```

---

## 🔧 Arquivo de Configuração para App Platform

Crie o arquivo `.do/app.yaml` na raiz do projeto:

```yaml
name: go-health-nps
region: nyc
static_sites:
  - name: web
    github:
      repo: Luan-DataSpot/nps-insight-hub
      branch: main
      deploy_on_push: true
    build_command: npm install && npm run build
    output_dir: dist
    environment_slug: node-js
    envs:
      - key: VITE_SUPABASE_PROJECT_ID
        value: tiogvhhkfvtjzkwpfpeg
        scope: BUILD_TIME
      - key: VITE_SUPABASE_PUBLISHABLE_KEY
        value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpb2d2aGhrZnZ0anprd3BmcGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzM2MzIsImV4cCI6MjA3ODcwOTYzMn0.GUNw1rfowXcByKL9gvC-qT4IG890VTWO_mmFyHN9XjI
        scope: BUILD_TIME
      - key: VITE_SUPABASE_URL
        value: https://tiogvhhkfvtjzkwpfpeg.supabase.co
        scope: BUILD_TIME
    routes:
      - path: /
    catchall_document: index.html
```

---

## 🔒 Configurar HTTPS (SSL/TLS)

### Para App Platform
O App Platform já fornece HTTPS automaticamente! ✅

### Para Droplet (usando Certbot)

```bash
# Instalar Certbot
apt install certbot python3-certbot-nginx -y

# Obter certificado SSL (substitua seu-dominio.com)
certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Renovação automática (já configurada)
certbot renew --dry-run
```

---

## 📊 Monitoramento e Manutenção

### Ver Logs (Docker)
```bash
docker logs -f go-health-nps
```

### Ver Logs (Nginx)
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Atualizar Aplicação (Docker)
```bash
cd /opt/nps-insight-hub
git pull
docker-compose down
docker-compose up -d --build
```

### Atualizar Aplicação (Manual)
```bash
# Local: build novo
npm run build

# Upload para servidor
scp -r dist/* root@seu_ip:/var/www/html/
```

---

## 💰 Custos Estimados na Digital Ocean

| Método | Custo Mensal | Recursos |
|--------|--------------|----------|
| **App Platform - Basic** | $5 USD | 512MB RAM, Auto-scaling |
| **App Platform - Pro** | $12 USD | 1GB RAM, Custom domains |
| **Droplet Basic** | $6 USD | 1GB RAM, 1 vCPU, 25GB SSD |
| **Droplet Standard** | $18 USD | 2GB RAM, 1 vCPU, 50GB SSD |

**Recomendação:** Para começar, use o **App Platform Basic** ($5/mês) ou **Droplet Basic** ($6/mês).

---

## ⚡ Performance e Otimizações

O build já está otimizado com:
- ✅ Code splitting automático
- ✅ Tree shaking
- ✅ Minificação de JS/CSS
- ✅ Compressão Gzip
- ✅ Cache de assets estáticos
- ✅ Lazy loading de componentes

---

## 🐛 Troubleshooting

### Problema: Erro 404 ao acessar rotas
**Solução:** Certifique-se de que o `catchall_document` está configurado para `index.html`

### Problema: Variáveis de ambiente não carregam
**Solução:** Variáveis do Vite devem começar com `VITE_` e estar presentes no build time

### Problema: Docker build falha
**Solução:** Verifique se o `.dockerignore` está excluindo `node_modules`

### Problema: Site muito lento
**Solução:** 
- Verifique se Gzip está ativado
- Use CDN (Cloudflare) na frente
- Aumente o plano do Droplet

---

## 📞 Suporte

- **Digital Ocean Docs:** https://docs.digitalocean.com/
- **Community:** https://www.digitalocean.com/community/
- **Support Tickets:** Disponível para contas pagas

---

## ✅ Checklist Final

Antes de considerar o deploy completo:

- [ ] Build local funciona sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] HTTPS configurado (para domínio customizado)
- [ ] Firewall configurado
- [ ] Backups automáticos ativados (Digital Ocean)
- [ ] Monitoramento configurado
- [ ] DNS propagado (se usar domínio)
- [ ] Testes funcionais realizados

---

**Pronto! Seu sistema de NPS GO HEALTH está no ar! 🚀**
