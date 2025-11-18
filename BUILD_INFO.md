# 📦 Informações do Build de Produção

**Data do Build:** 18/11/2025  
**Versão:** 1.0.0  
**Projeto:** GO HEALTH - Sistema NPS

---

## 📊 Estatísticas do Build

```
Tamanho total: 1.5MB
Arquivos gerados: 12
Tempo de build: ~8.66s
Compressão Gzip: Ativa
```

### Chunks Gerados:

| Chunk | Tamanho | Gzipped | Conteúdo |
|-------|---------|---------|----------|
| `index.html` | 1.57 KB | 0.60 KB | HTML principal |
| `index.css` | 59.43 KB | 10.48 KB | Estilos globais |
| `ui-vendor.js` | 106.64 KB | 35.60 KB | Radix UI components |
| `react-vendor.js` | 160.49 KB | 52.26 KB | React + React Router |
| `supabase-vendor.js` | 170.85 KB | 42.40 KB | Supabase client |
| `chart-vendor.js` | 411.62 KB | 110.22 KB | Recharts library |
| `index.js` | 534.57 KB | 167.61 KB | Código da aplicação |

**Total JavaScript Gzipped:** ~408 KB

---

## 🚀 Performance

### Otimizações Aplicadas:

✅ **Code Splitting**
- Vendors separados por categoria
- Lazy loading de rotas
- Tree shaking automático

✅ **Compressão**
- Minificação com esbuild
- Gzip ativado no Nginx
- Assets com hash para cache

✅ **Cache Strategy**
- Assets estáticos: 1 ano
- HTML: Sem cache
- Versionamento automático

✅ **Bundle Analysis**
- React/Router: 160KB (gzip)
- UI Components: 106KB (gzip)
- Charts: 411KB (gzip)
- Supabase: 170KB (gzip)

---

## 🌐 URLs de Deploy

### Digital Ocean App Platform
```
https://go-health-nps.ondigitalocean.app
```

### Droplet (após configurar)
```
http://SEU_IP_AQUI
```

### Com Domínio Customizado
```
https://seu-dominio.com.br
```

---

## 🔧 Comandos Úteis

### Desenvolvimento
```bash
npm run dev              # Servidor local (porta 8080)
npm run build           # Build de produção
npm run preview         # Preview do build
npm run lint            # Verificar código
```

### Docker
```bash
npm run docker:build    # Construir imagem
npm run docker:run      # Rodar container
npm run docker:logs     # Ver logs
npm run docker:stop     # Parar container
```

### Deploy
```bash
./deploy.sh             # Script interativo
npm run build:analyze   # Analisar bundle
```

---

## 🔐 Variáveis de Ambiente Necessárias

```env
VITE_SUPABASE_PROJECT_ID=tiogvhhkfvtjzkwpfpeg
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_URL=https://tiogvhhkfvtjzkwpfpeg.supabase.co
```

⚠️ **Importante:** Essas variáveis são públicas (client-side) e já estão commitadas.

---

## 📁 Estrutura do Deploy

```
dist/
├── index.html              # Entrada principal
├── assets/
│   ├── index-[hash].css   # Estilos
│   ├── index-[hash].js    # Código principal
│   ├── *-vendor-[hash].js # Chunks de vendors
│   └── logo-*.png         # Assets
├── favicon.ico
├── robots.txt
└── placeholder.svg
```

---

## 🎯 Requisitos de Sistema

### Servidor
- **OS:** Ubuntu 22.04 LTS (recomendado)
- **RAM:** 512MB mínimo (1GB recomendado)
- **Storage:** 1GB disponível
- **Software:** Nginx 1.18+ ou Docker 20+

### Browser (Usuários)
- **Chrome:** 90+
- **Firefox:** 88+
- **Safari:** 14+
- **Edge:** 90+

---

## 📈 Métricas de Performance Esperadas

### Lighthouse Score (estimado)
- **Performance:** 90+
- **Accessibility:** 95+
- **Best Practices:** 100
- **SEO:** 90+

### Core Web Vitals
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Load Times
- **First Paint:** ~800ms
- **Time to Interactive:** ~2.5s
- **Full Load:** ~3.5s

*(Valores em rede 4G, servidor US/BR)*

---

## 🔄 Processo de Atualização

### 1. Desenvolvimento Local
```bash
# Fazer alterações
git add .
git commit -m "Descrição"
```

### 2. Build e Teste
```bash
npm run build
npm run preview
```

### 3. Deploy

**App Platform (automático):**
```bash
git push origin main
# Deploy automático via webhook
```

**Droplet (manual):**
```bash
./deploy.sh
# Escolher opção 2
```

**Docker:**
```bash
docker-compose down
docker-compose up -d --build
```

---

## 🐛 Debugging em Produção

### Ver Logs do Nginx
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Ver Logs do Docker
```bash
docker logs -f go-health-nps
```

### Testar Endpoints
```bash
curl -I http://SEU_IP/
curl http://SEU_IP/health
```

### Browser DevTools
- Console: Verificar erros JavaScript
- Network: Verificar requests
- Application: Verificar storage/cache

---

## 📞 Suporte e Recursos

### Documentação
- **Deploy Completo:** [DEPLOY_DIGITAL_OCEAN.md](./DEPLOY_DIGITAL_OCEAN.md)
- **Deploy Rápido:** [DEPLOY_QUICK.md](./DEPLOY_QUICK.md)
- **Implementações:** [IMPLEMENTACOES_FINAIS.md](./IMPLEMENTACOES_FINAIS.md)

### Links Úteis
- [Digital Ocean Docs](https://docs.digitalocean.com/)
- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router SPA](https://reactrouter.com/en/main/start/tutorial)
- [Supabase Docs](https://supabase.com/docs)

---

## ✅ Checklist de Deploy

- [ ] Build local sem erros
- [ ] Testes funcionais passando
- [ ] Variáveis de ambiente configuradas
- [ ] Código commitado no GitHub
- [ ] Domínio configurado (se aplicável)
- [ ] SSL/HTTPS ativo
- [ ] Firewall configurado
- [ ] Monitoramento ativo
- [ ] Backups configurados
- [ ] DNS propagado

---

**Build finalizado com sucesso! ✅**  
**Pronto para deploy em produção! 🚀**
