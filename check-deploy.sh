#!/bin/bash

# Script de Verificação Pré-Deploy
# Verifica se tudo está pronto para deploy

echo "🔍 Verificando ambiente de deploy..."
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

# Verificar Node.js
echo -n "Verificando Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js não encontrado"
    ERRORS=$((ERRORS + 1))
fi

# Verificar npm
echo -n "Verificando npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} v$NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm não encontrado"
    ERRORS=$((ERRORS + 1))
fi

# Verificar package.json
echo -n "Verificando package.json... "
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC} Encontrado"
else
    echo -e "${RED}✗${NC} Não encontrado"
    ERRORS=$((ERRORS + 1))
fi

# Verificar node_modules
echo -n "Verificando dependências... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Instaladas"
else
    echo -e "${YELLOW}⚠${NC} Não instaladas (execute: npm install)"
fi

# Verificar .env
echo -n "Verificando .env... "
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} Encontrado"
else
    echo -e "${YELLOW}⚠${NC} Não encontrado"
fi

# Verificar arquivos de deploy
echo -n "Verificando Dockerfile... "
if [ -f "Dockerfile" ]; then
    echo -e "${GREEN}✓${NC} Encontrado"
else
    echo -e "${RED}✗${NC} Não encontrado"
    ERRORS=$((ERRORS + 1))
fi

echo -n "Verificando nginx.conf... "
if [ -f "nginx.conf" ]; then
    echo -e "${GREEN}✓${NC} Encontrado"
else
    echo -e "${RED}✗${NC} Não encontrado"
    ERRORS=$((ERRORS + 1))
fi

echo -n "Verificando .do/app.yaml... "
if [ -f ".do/app.yaml" ]; then
    echo -e "${GREEN}✓${NC} Encontrado"
else
    echo -e "${YELLOW}⚠${NC} Não encontrado"
fi

# Verificar Git
echo -n "Verificando Git... "
if command -v git &> /dev/null; then
    if [ -d ".git" ]; then
        BRANCH=$(git branch --show-current)
        echo -e "${GREEN}✓${NC} Branch: $BRANCH"
    else
        echo -e "${YELLOW}⚠${NC} Repositório não inicializado"
    fi
else
    echo -e "${RED}✗${NC} Git não encontrado"
fi

# Verificar Docker (opcional)
echo -n "Verificando Docker... "
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker -v | cut -d' ' -f3 | tr -d ',')
    echo -e "${GREEN}✓${NC} $DOCKER_VERSION"
else
    echo -e "${YELLOW}⚠${NC} Docker não encontrado (opcional)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Ambiente pronto para deploy!${NC}"
    echo ""
    echo "Próximos passos:"
    echo "1. npm run build          # Testar build"
    echo "2. ./deploy.sh           # Deploy interativo"
    echo "3. ou seguir: DEPLOY_QUICK.md"
else
    echo -e "${RED}✗ $ERRORS erro(s) encontrado(s)${NC}"
    echo ""
    echo "Corrija os erros antes de prosseguir."
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
