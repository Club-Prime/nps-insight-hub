-- ===================================================================
-- CONFIGURAR MODO ANÔNIMO POR QUESTIONÁRIO INDIVIDUAL
-- ===================================================================
-- Execute este SQL no Supabase SQL Editor

-- PASSO 1: Ver todos os questionários e seus estados atuais
SELECT 
  id,
  title,
  slug,
  require_identification as "Exige ID?",
  is_active as "Ativo?"
FROM questionnaires
ORDER BY created_at DESC;

-- ===================================================================
-- PASSO 2: Escolha UMA das opções abaixo:
-- ===================================================================

-- OPÇÃO A: Tornar questionário específico ANÔNIMO (por SLUG)
-- Descomente e substitua o slug pelo seu questionário
-- UPDATE questionnaires
-- SET require_identification = false
-- WHERE slug = 'apice-presentation';

-- OPÇÃO B: Tornar questionário específico ANÔNIMO (por ID)
-- Descomente e substitua o ID
-- UPDATE questionnaires
-- SET require_identification = false
-- WHERE id = 'SEU-ID-AQUI';

-- OPÇÃO C: Tornar questionário específico COM IDENTIFICAÇÃO (por SLUG)
-- UPDATE questionnaires
-- SET require_identification = true
-- WHERE slug = 'satisfacao-clinica-carlos-portela';

-- ===================================================================
-- PASSO 3: Verificar mudança
-- ===================================================================
SELECT 
  id,
  title, 
  slug,
  require_identification as "Exige ID?",
  CASE 
    WHEN require_identification = true THEN 'CPF + Nome obrigatórios'
    WHEN require_identification = false THEN 'Apenas nome opcional'
    ELSE 'Padrão (CPF + Nome)'
  END as "Modo"
FROM questionnaires
ORDER BY created_at DESC;

-- ===================================================================
-- EXEMPLOS DE USO:
-- ===================================================================

-- Para pesquisa de apresentação (anônima):
-- UPDATE questionnaires SET require_identification = false WHERE slug = 'apice-presentation';

-- Para pesquisa da clínica (com identificação):
-- UPDATE questionnaires SET require_identification = true WHERE slug = 'satisfacao-clinica-carlos-portela';

-- ===================================================================

