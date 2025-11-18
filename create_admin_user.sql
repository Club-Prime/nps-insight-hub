-- ============================================
-- CRIAR USUÁRIO ADMIN NO SUPABASE
-- Execute este SQL no SQL Editor do Supabase
-- ============================================

-- PASSO 1: Verificar se já existe o usuário
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'admin@gohealth.com';

-- Se retornar vazio, execute os próximos comandos:

-- PASSO 2: Criar perfil admin para o usuário que você criou
-- (O usuário já foi criado quando você executou a query anterior)
INSERT INTO public.profiles (id, role, email)
SELECT id, 'admin', email 
FROM auth.users 
WHERE email = 'admin@gohealth.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'admin';

-- PASSO 3: Verificar se foi criado
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.role,
  p.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@gohealth.com';

-- ============================================
-- RESULTADO ESPERADO:
-- Se aparecer uma linha com role = 'admin', está OK!
-- ============================================

-- CREDENCIAIS DE LOGIN:
-- Email: admin@gohealth.com
-- Senha: Admin123! (ou a que você definiu)
-- ============================================
