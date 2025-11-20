-- ===================================================================
-- FIX DEFINITIVO: Remover TODAS políticas e recriar do zero
-- ===================================================================

-- 1. REMOVER **TODAS** AS POLÍTICAS EXISTENTES
DROP POLICY IF EXISTS "Allow anonymous insert survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Qualquer pessoa pode enviar respostas" ON survey_responses;
DROP POLICY IF EXISTS "Allow authenticated read survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar todas as respostas" ON survey_responses;
DROP POLICY IF EXISTS "Allow authenticated update survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Allow authenticated delete survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Allow public read access" ON survey_responses;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON survey_responses;
DROP POLICY IF EXISTS "Allow service role full access" ON survey_responses;
DROP POLICY IF EXISTS "Enable insert for anon users" ON survey_responses;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON survey_responses;
DROP POLICY IF EXISTS "Enable read access for all users" ON survey_responses;

-- 2. DESABILITAR RLS TEMPORARIAMENTE
ALTER TABLE survey_responses DISABLE ROW LEVEL SECURITY;

-- 3. RE-HABILITAR RLS
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- 4. CRIAR POLÍTICA PERMISSIVA PARA INSERT (ANON + AUTHENTICATED)
CREATE POLICY "survey_responses_insert_policy"
ON survey_responses
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 5. CRIAR POLÍTICA PARA SELECT (APENAS AUTHENTICATED)
CREATE POLICY "survey_responses_select_policy"
ON survey_responses
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (true);

-- 6. CRIAR POLÍTICA PARA UPDATE (APENAS AUTHENTICATED)
CREATE POLICY "survey_responses_update_policy"
ON survey_responses
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 7. CRIAR POLÍTICA PARA DELETE (APENAS AUTHENTICATED)
CREATE POLICY "survey_responses_delete_policy"
ON survey_responses
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (true);

-- ===================================================================
-- VERIFICAÇÃO FINAL
-- ===================================================================

-- Deve mostrar exatamente 4 políticas
SELECT 
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'survey_responses'
ORDER BY cmd;

-- Deve mostrar: rowsecurity = true
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'survey_responses';
