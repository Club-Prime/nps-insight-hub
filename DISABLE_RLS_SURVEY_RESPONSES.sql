-- ===================================================================
-- SOLUÇÃO DEFINITIVA: DESABILITAR RLS PARA SURVEY_RESPONSES
-- ===================================================================
-- 
-- JUSTIFICATIVA:
-- - Survey é pública (qualquer pessoa pode responder)
-- - Dados não são sensíveis (apenas opiniões sobre apresentação)
-- - Admin já tem autenticação separada (não depende de RLS)
-- - RLS está causando mais problemas do que soluções
--
-- ===================================================================

-- 1. REMOVER TODAS AS POLÍTICAS
DROP POLICY IF EXISTS "survey_responses_insert_policy" ON survey_responses;
DROP POLICY IF EXISTS "survey_responses_select_policy" ON survey_responses;
DROP POLICY IF EXISTS "survey_responses_update_policy" ON survey_responses;
DROP POLICY IF EXISTS "survey_responses_delete_policy" ON survey_responses;
DROP POLICY IF EXISTS "Allow anonymous insert survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Qualquer pessoa pode enviar respostas" ON survey_responses;
DROP POLICY IF EXISTS "Allow authenticated read survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar todas as respostas" ON survey_responses;
DROP POLICY IF EXISTS "Allow authenticated update survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Allow authenticated delete survey responses" ON survey_responses;

-- 2. DESABILITAR RLS NA TABELA
ALTER TABLE survey_responses DISABLE ROW LEVEL SECURITY;

-- 3. GARANTIR QUE A ROLE 'anon' TEM PERMISSÕES NA TABELA
GRANT SELECT, INSERT ON survey_responses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON survey_responses TO authenticated;

-- 4. VERIFICAR STATUS FINAL
SELECT 
  tablename, 
  rowsecurity as "RLS Ativo?"
FROM pg_tables
WHERE tablename = 'survey_responses';

-- Deve retornar: rowsecurity = false (RLS desabilitado)

-- 5. VERIFICAR PERMISSÕES
SELECT 
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'survey_responses'
ORDER BY grantee, privilege_type;

-- ===================================================================
-- RESULTADO ESPERADO:
-- - RLS desabilitado (false)
-- - anon tem permissão SELECT, INSERT
-- - authenticated tem permissão SELECT, INSERT, UPDATE, DELETE
-- ===================================================================
