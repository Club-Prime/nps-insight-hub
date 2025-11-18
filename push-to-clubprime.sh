#!/bin/bash

# ============================================
# SCRIPT: Push para GitHub do Club Prime
# ============================================

echo "🚀 Preparando push para Club Prime..."
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 1. Adicionar todos os arquivos
echo -e "${BLUE}📦 Adicionando arquivos...${NC}"
git add .

# 2. Commit
echo -e "${BLUE}💾 Fazendo commit...${NC}"
git commit -m "Migração para novo Supabase e configuração de deploy completa

- Atualizado credenciais do Supabase (lovncddlhqjbawiuigyx)
- Adicionado sistema completo de gerenciamento de pesquisas
- Configurado Docker e deploy para Digital Ocean
- Criado QR Code generator para cada pesquisa
- Adicionado gráficos avançados com Recharts
- Implementado exportação Excel/CSV
- Documentação completa de deploy"

# 3. Adicionar novo remote (Club Prime)
echo -e "${BLUE}🔗 Configurando remote do Club Prime...${NC}"
git remote add clubprime https://github.com/Club-Prime/nps-insight-hub.git 2>/dev/null || \
git remote set-url clubprime https://github.com/Club-Prime/nps-insight-hub.git

# 4. Push para Club Prime
echo -e "${BLUE}⬆️  Fazendo push para Club Prime...${NC}"
echo -e "${YELLOW}Você precisará autenticar no GitHub...${NC}"
git push clubprime main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Push concluído com sucesso!${NC}"
    echo ""
    echo "🔗 Repositório: https://github.com/Club-Prime/nps-insight-hub"
else
    echo ""
    echo -e "${RED}❌ Erro no push!${NC}"
    echo ""
    echo "Possíveis soluções:"
    echo "1. Criar repositório no GitHub: https://github.com/organizations/Club-Prime/repositories/new"
    echo "   Nome: nps-insight-hub"
    echo ""
    echo "2. Ou fazer push manual:"
    echo "   git push clubprime main --force"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
