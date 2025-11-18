#!/bin/bash

# Script de Deploy Rápido para Digital Ocean
# Autor: GO HEALTH
# Data: 18/11/2025

set -e

echo "🚀 Iniciando deploy do GO HEALTH NPS..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função de log
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

error() {
    echo -e "${RED}[ERRO]${NC} $1"
    exit 1
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    error "Execute este script na raiz do projeto!"
fi

# Limpar builds anteriores
log "Limpando builds anteriores..."
rm -rf dist node_modules/.vite

# Instalar dependências
log "Instalando dependências..."
npm install || error "Falha ao instalar dependências"

# Build de produção
log "Gerando build de produção..."
npm run build || error "Falha no build"

# Verificar se build foi criado
if [ ! -d "dist" ]; then
    error "Diretório dist não foi criado!"
fi

success "Build concluído com sucesso!"

# Estatísticas do build
log "Estatísticas do build:"
du -sh dist
echo "Arquivos gerados: $(find dist -type f | wc -l)"

# Perguntar método de deploy
echo ""
echo "Escolha o método de deploy:"
echo "1) Docker Local (testar localmente)"
echo "2) Copiar para Droplet (via SCP)"
echo "3) Apenas build (já fiz)"
read -p "Opção [1-3]: " DEPLOY_METHOD

case $DEPLOY_METHOD in
    1)
        log "Construindo imagem Docker..."
        docker build -t go-health-nps:latest . || error "Falha no build Docker"
        
        log "Parando container anterior (se existir)..."
        docker stop go-health-nps 2>/dev/null || true
        docker rm go-health-nps 2>/dev/null || true
        
        log "Iniciando container..."
        docker run -d --name go-health-nps -p 80:80 go-health-nps:latest || error "Falha ao iniciar container"
        
        success "Deploy local concluído!"
        echo ""
        echo "Acesse: http://localhost"
        echo "Logs: docker logs -f go-health-nps"
        ;;
    
    2)
        read -p "IP do Droplet: " DROPLET_IP
        read -p "Usuário SSH [root]: " SSH_USER
        SSH_USER=${SSH_USER:-root}
        
        log "Copiando arquivos para o servidor..."
        scp -r dist/* ${SSH_USER}@${DROPLET_IP}:/var/www/html/ || error "Falha ao copiar arquivos"
        
        log "Reiniciando Nginx no servidor..."
        ssh ${SSH_USER}@${DROPLET_IP} "systemctl restart nginx" || error "Falha ao reiniciar Nginx"
        
        success "Deploy para Droplet concluído!"
        echo ""
        echo "Acesse: http://${DROPLET_IP}"
        ;;
    
    3)
        success "Build concluído! Arquivos em: ./dist"
        echo ""
        echo "Próximos passos:"
        echo "1. Upload manual via FTP/SFTP"
        echo "2. Usar Git para deploy"
        echo "3. Usar Docker: npm run docker:build && npm run docker:run"
        ;;
    
    *)
        error "Opção inválida!"
        ;;
esac

echo ""
success "Deploy finalizado! 🎉"
