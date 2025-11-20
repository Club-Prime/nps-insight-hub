-- ===================================================================
-- TORNAR QUESTIONÁRIOS ANÔNIMOS (SEM EXIGIR CPF/NOME)
-- ===================================================================

-- OPÇÃO 1: Tornar TODOS os questionários anônimos
UPDATE questionnaires
SET require_identification = false;

-- OPÇÃO 2: Tornar apenas um questionário específico anônimo
-- UPDATE questionnaires
-- SET require_identification = false
-- WHERE slug = 'satisfacao-clinica-carlos-portela';

-- OPÇÃO 3: Tornar apenas questionários ativos anônimos
-- UPDATE questionnaires
-- SET require_identification = false
-- WHERE is_active = true;

-- VERIFICAR RESULTADO
SELECT 
  id,
  title,
  slug,
  require_identification,
  is_active,
  created_at
FROM questionnaires
ORDER BY created_at DESC;

-- ===================================================================
-- RESULTADO ESPERADO:
-- Todos os questionários devem ter require_identification = false
-- ===================================================================
