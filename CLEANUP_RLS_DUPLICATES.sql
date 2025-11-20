-- OPCIONAL: Remover políticas duplicadas antigas
-- Execute apenas se quiser limpar as políticas redundantes

DROP POLICY IF EXISTS "Qualquer pessoa pode enviar respostas" ON survey_responses;
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar todas as respostas" ON survey_responses;

-- Verificar resultado final (deve ter apenas 4 políticas)
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'survey_responses'
ORDER BY cmd, policyname;
