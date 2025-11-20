-- ===================================================================
-- FIX: Row-Level Security para survey_responses
-- Problema: Usuários públicos não conseguem enviar respostas
-- Solução: Permitir INSERT público na tabela survey_responses
-- ===================================================================

-- 1. Verificar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'survey_responses';

-- 2. REMOVER políticas antigas que podem estar bloqueando
DROP POLICY IF EXISTS "Allow public read access" ON survey_responses;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON survey_responses;
DROP POLICY IF EXISTS "Allow service role full access" ON survey_responses;

-- 3. CRIAR política que permite INSERT público (anônimo)
-- Qualquer pessoa pode criar uma resposta de survey
CREATE POLICY "Allow anonymous insert survey responses"
ON survey_responses
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. CRIAR política que permite leitura apenas para autenticados
-- Apenas usuários autenticados (admin) podem ver respostas
CREATE POLICY "Allow authenticated read survey responses"
ON survey_responses
FOR SELECT
TO authenticated
USING (true);

-- 5. CRIAR política que permite UPDATE/DELETE apenas para autenticados
CREATE POLICY "Allow authenticated update survey responses"
ON survey_responses
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated delete survey responses"
ON survey_responses
FOR DELETE
TO authenticated
USING (true);

-- 6. VERIFICAR se RLS está habilitado (deve estar)
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'survey_responses';

-- 7. GARANTIR que RLS está ativo
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- ===================================================================
-- TESTE: Verificar se as políticas foram criadas corretamente
-- ===================================================================

SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'survey_responses'
ORDER BY cmd, policyname;

-- ===================================================================
-- RESULTADO ESPERADO:
-- 
-- 4 políticas devem aparecer:
-- 1. Allow anonymous insert survey responses (INSERT, anon/authenticated)
-- 2. Allow authenticated read survey responses (SELECT, authenticated)
-- 3. Allow authenticated update survey responses (UPDATE, authenticated)
-- 4. Allow authenticated delete survey responses (DELETE, authenticated)
-- ===================================================================
