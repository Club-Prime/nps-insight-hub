# �� GO HEALTH - Sistema de Pesquisa NPS

Sistema completo de pesquisa Net Promoter Score (NPS) para avaliar a satisfação dos clientes.

[![GitHub](https://img.shields.io/badge/GitHub-Club--Prime-blue)](https://github.com/Club-Prime/nps-insight-hub)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)

## 🎯 Características

- ✅ Gerenciamento completo de pesquisas NPS
- ✅ Gerador de QR Code para cada pesquisa
- ✅ Dashboards com gráficos interativos (Recharts)
- ✅ Exportação de dados (Excel/CSV)
- ✅ Autenticação segura com Supabase
- ✅ Interface responsiva com TailwindCSS

## 🚀 Tecnologias

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Supabase (PostgreSQL + Auth)
- **UI:** TailwindCSS + Shadcn/ui
- **Charts:** Recharts
- **Deploy:** Digital Ocean / Docker

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/Club-Prime/nps-insight-hub.git
cd nps-insight-hub

# Instale dependências
npm install

# Configure .env.local
VITE_SUPABASE_URL=sua_url
VITE_SUPABASE_ANON_KEY=sua_key

# Inicie o servidor
npm run dev
```

## 🚢 Deploy

Veja guias completos em:
- [DEPLOY_DIGITAL_OCEAN.md](DEPLOY_DIGITAL_OCEAN.md)
- [DEPLOY_QUICK.md](DEPLOY_QUICK.md)

## 📚 Documentação

- [Implementação QR Code](IMPLEMENTACAO_QR_CODE.md)
- [Build Info](BUILD_INFO.md)
- [Configuração Supabase](NOVO_SUPABASE.txt)

## 👥 Autores

**Club Prime** - [GitHub](https://github.com/Club-Prime)

## 📝 Licença

MIT License
