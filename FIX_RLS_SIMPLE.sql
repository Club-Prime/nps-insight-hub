-- FIX: Permitir que usuários anônimos enviem respostas da survey
-- Execute este SQL no Supabase SQL Editor

-- 1. REMOVER políticas antigas
DROP POLICY IF EXISTS "Allow public read access" ON survey_responses;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON survey_responses;
DROP POLICY IF EXISTS "Allow service role full access" ON survey_responses;
DROP POLICY IF EXISTS "Enable insert for anon users" ON survey_responses;

-- 2. CRIAR política que permite INSERT público
CREATE POLICY "Public can submit survey responses"
ON survey_responses
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 3. CRIAR política para admins lerem respostas
CREATE POLICY "Authenticated can read survey responses"
ON survey_responses
FOR SELECT
TO authenticated
USING (true);

-- 4. CRIAR políticas para admins atualizarem/deletarem
CREATE POLICY "Authenticated can update survey responses"
ON survey_responses
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated can delete survey responses"
ON survey_responses
FOR DELETE
TO authenticated
USING (true);

-- 5. Garantir que RLS está ativo
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- 6. VERIFICAR resultado
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'survey_responses'
ORDER BY cmd;
