-- DIAGNÓSTICO COMPLETO: Ver todas as políticas RLS

-- 1. Ver políticas detalhadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'survey_responses'
ORDER BY cmd, policyname;

-- 2. Verificar se RLS está ativo
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'survey_responses';

-- 3. Testar se 'anon' role tem permissão
SELECT 
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'survey_responses';
