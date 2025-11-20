-- ===================================================================
-- FEATURE: Identificação Opcional nos Questionários
-- ===================================================================
-- Adiciona configuração para tornar CPF/Nome opcionais por questionário
-- ===================================================================

-- 1. ADICIONAR COLUNA NA TABELA QUESTIONNAIRES
ALTER TABLE questionnaires
ADD COLUMN IF NOT EXISTS require_identification BOOLEAN DEFAULT true;

COMMENT ON COLUMN questionnaires.require_identification IS 
'Se true, CPF e Nome são obrigatórios. Se false, usuário pode responder anonimamente.';

-- 2. PERMITIR NULL EM CPF E FULL_NAME NA TABELA SURVEY_RESPONSES
ALTER TABLE survey_responses
ALTER COLUMN cpf DROP NOT NULL;

ALTER TABLE survey_responses
ALTER COLUMN full_name DROP NOT NULL;

COMMENT ON COLUMN survey_responses.cpf IS 
'CPF do respondente (opcional se questionário permitir respostas anônimas)';

COMMENT ON COLUMN survey_responses.full_name IS 
'Nome completo do respondente (opcional se questionário permitir respostas anônimas)';

-- 3. ATUALIZAR QUESTIONÁRIOS EXISTENTES (MANTER COMPORTAMENTO ATUAL)
UPDATE questionnaires
SET require_identification = true
WHERE require_identification IS NULL;

-- 4. VERIFICAR RESULTADO
SELECT 
  id,
  title,
  require_identification,
  is_active
FROM questionnaires
ORDER BY created_at DESC;

-- 5. VERIFICAR CONSTRAINTS DA TABELA SURVEY_RESPONSES
SELECT 
  column_name,
  is_nullable,
  data_type
FROM information_schema.columns
WHERE table_name = 'survey_responses'
  AND column_name IN ('cpf', 'full_name')
ORDER BY column_name;

-- ===================================================================
-- RESULTADO ESPERADO:
-- - questionnaires.require_identification = true (para todos existentes)
-- - survey_responses.cpf = nullable (YES)
-- - survey_responses.full_name = nullable (YES)
-- ===================================================================
