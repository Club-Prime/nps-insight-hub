-- ============================================
-- MIGRATION: Pesquisa Clínica Carlos Portela
-- Data: 18/11/2025
-- Descrição: Criação completa do sistema de pesquisas NPS
--            com pesquisa padrão da Clínica Carlos Portela
-- ============================================

-- ============================================
-- 1. TIPOS E ENUMS
-- ============================================

-- Tipo de pergunta
CREATE TYPE question_type AS ENUM (
  'nps',              -- Escala 0-10 (NPS)
  'scale',            -- Escala customizada
  'multiple_choice',  -- Múltipla escolha (radio)
  'checkbox',         -- Múltipla seleção (checkbox)
  'text_short',       -- Texto curto
  'text_long',        -- Texto longo (textarea)
  'yes_no'            -- Sim/Não
);

-- ============================================
-- 2. TABELAS PRINCIPAIS
-- ============================================

-- Tabela de questionários
CREATE TABLE public.questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Pesquisa de Satisfação',
  description TEXT,
  slug TEXT UNIQUE, -- URL amigável (ex: satisfacao-clinica)
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de perguntas
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id UUID NOT NULL REFERENCES public.questionnaires(id) ON DELETE CASCADE,
  section_title TEXT, -- Título da seção (ex: "1. Sobre a sua experiência geral")
  question_text TEXT NOT NULL,
  question_type question_type NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT true,
  options JSONB, -- Opções para multiple_choice/checkbox (ex: ["Excelente", "Boa", "Regular"])
  placeholder TEXT, -- Placeholder para campos de texto
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de respostas da pesquisa
CREATE TABLE public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id UUID NOT NULL REFERENCES public.questionnaires(id) ON DELETE CASCADE,
  cpf TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  nps_score INTEGER CHECK (nps_score >= 0 AND nps_score <= 10),
  wants_contact BOOLEAN DEFAULT false, -- Se deseja ser contatado
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(cpf, questionnaire_id) -- Evita duplicatas (1 resposta por CPF por pesquisa)
);

-- Tabela de respostas individuais
CREATE TABLE public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID NOT NULL REFERENCES public.survey_responses(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  answer_value TEXT NOT NULL, -- Valor da resposta (pode ser JSON para checkboxes)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 3. SEGURANÇA (RLS - Row Level Security)
-- ============================================

ALTER TABLE public.questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- Políticas para questionários
CREATE POLICY "Qualquer pessoa pode visualizar questionários ativos"
  ON public.questionnaires FOR SELECT
  USING (is_active = true);

CREATE POLICY "Usuários autenticados podem gerenciar questionários"
  ON public.questionnaires FOR ALL
  USING (auth.role() = 'authenticated');

-- Políticas para perguntas
CREATE POLICY "Qualquer pessoa pode visualizar perguntas de questionários ativos"
  ON public.questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.questionnaires
      WHERE questionnaires.id = questions.questionnaire_id
      AND questionnaires.is_active = true
    )
  );

CREATE POLICY "Usuários autenticados podem gerenciar perguntas"
  ON public.questions FOR ALL
  USING (auth.role() = 'authenticated');

-- Políticas para respostas
CREATE POLICY "Qualquer pessoa pode enviar respostas"
  ON public.survey_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem visualizar todas as respostas"
  ON public.survey_responses FOR SELECT
  USING (auth.role() = 'authenticated');

-- Políticas para respostas individuais
CREATE POLICY "Qualquer pessoa pode enviar respostas individuais"
  ON public.answers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem visualizar todas as respostas individuais"
  ON public.answers FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================
-- 4. ÍNDICES (Performance)
-- ============================================

CREATE INDEX idx_questionnaires_slug ON public.questionnaires(slug);
CREATE INDEX idx_questionnaires_active ON public.questionnaires(is_active);
CREATE INDEX idx_questions_questionnaire ON public.questions(questionnaire_id);
CREATE INDEX idx_questions_order ON public.questions(questionnaire_id, order_index);
CREATE INDEX idx_responses_questionnaire ON public.survey_responses(questionnaire_id);
CREATE INDEX idx_responses_created ON public.survey_responses(created_at DESC);
CREATE INDEX idx_responses_cpf ON public.survey_responses(cpf);
CREATE INDEX idx_answers_response ON public.answers(response_id);
CREATE INDEX idx_answers_question ON public.answers(question_id);

-- ============================================
-- 5. FUNÇÕES E TRIGGERS
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para questionários
CREATE TRIGGER update_questionnaires_updated_at
  BEFORE UPDATE ON public.questionnaires
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função para gerar slug automaticamente
CREATE OR REPLACE FUNCTION public.generate_slug_from_title()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(
      regexp_replace(
        regexp_replace(
          unaccent(NEW.title),
          '[^a-zA-Z0-9\s-]', '', 'g'
        ),
        '\s+', '-', 'g'
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar slug
CREATE TRIGGER generate_questionnaire_slug
  BEFORE INSERT OR UPDATE ON public.questionnaires
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_slug_from_title();

-- ============================================
-- 6. DADOS INICIAIS - CLÍNICA CARLOS PORTELA
-- ============================================

-- Inserir questionário principal
INSERT INTO public.questionnaires (title, description, slug, is_active)
VALUES (
  'Pesquisa de Satisfação - Clínica Carlos Portela',
  'Queremos ouvir você! Sua opinião é muito importante para que possamos continuar oferecendo uma experiência de excelência em cada detalhe.',
  'satisfacao-clinica-carlos-portela',
  true
) RETURNING id;

-- Inserir perguntas (usando variável para o questionnaire_id)
DO $$
DECLARE
  q_id UUID;
BEGIN
  -- Pegar o ID do questionário criado
  SELECT id INTO q_id 
  FROM public.questionnaires 
  WHERE slug = 'satisfacao-clinica-carlos-portela' 
  LIMIT 1;

  -- ==========================================
  -- SEÇÃO 1: Sobre a sua experiência geral
  -- ==========================================
  
  INSERT INTO public.questions (questionnaire_id, section_title, question_text, question_type, is_required, options, order_index)
  VALUES 
  (q_id, '👤 1. Sobre a sua experiência geral', 
   'Como você descreveria, em poucas palavras, sua experiência geral com a clínica?', 
   'multiple_choice', true, 
   '["Excelente", "Boa", "Regular", "Ruim"]'::jsonb, 
   1),

  (q_id, '👤 1. Sobre a sua experiência geral', 
   'Em uma escala de 0 a 10, o quanto você se sente satisfeito(a) com a sua jornada aqui na clínica?', 
   'nps', true, 
   NULL, 
   2),

  (q_id, '👤 1. Sobre a sua experiência geral', 
   'O que mais te marcou positivamente na sua experiência conosco?', 
   'checkbox', true, 
   '["Atendimento humano", "Estrutura física e conforto", "Profissionalismo da equipe médica", "Comunicação e acompanhamento", "Resultados percebidos", "Outros"]'::jsonb, 
   3);

  -- ==========================================
  -- SEÇÃO 2: Sobre o atendimento médico
  -- ==========================================
  
  INSERT INTO public.questions (questionnaire_id, section_title, question_text, question_type, is_required, options, order_index)
  VALUES 
  (q_id, '🧑‍⚕️ 2. Sobre o atendimento médico', 
   'Como você avalia o cuidado, a escuta e a atenção dos nossos médicos durante o atendimento?', 
   'multiple_choice', true, 
   '["Excelente", "Boa", "Regular", "Precisa melhorar"]'::jsonb, 
   4),

  (q_id, '🧑‍⚕️ 2. Sobre o atendimento médico', 
   'Você sente que seu plano de cuidado foi explicado de forma clara e personalizada?', 
   'multiple_choice', true, 
   '["Sim", "Parcialmente", "Não"]'::jsonb, 
   5);

  -- ==========================================
  -- SEÇÃO 3: Sobre o atendimento institucional
  -- ==========================================
  
  INSERT INTO public.questions (questionnaire_id, section_title, question_text, question_type, is_required, options, order_index)
  VALUES 
  (q_id, '💼 3. Sobre o atendimento institucional', 
   'Como você avalia o acolhimento da recepção e equipe de atendimento?', 
   'multiple_choice', true, 
   '["Excelente", "Boa", "Regular", "Precisa melhorar"]'::jsonb, 
   6),

  (q_id, '💼 3. Sobre o atendimento institucional', 
   'E quanto ao suporte do concierge, acompanhamento e atenção durante seu programa?', 
   'multiple_choice', true, 
   '["Excelente", "Boa", "Regular", "Precisa melhorar"]'::jsonb, 
   7),

  (q_id, '💼 3. Sobre o atendimento institucional', 
   'Você sente que nossa equipe transmite empatia, paciência e comprometimento?', 
   'multiple_choice', true, 
   '["Sempre", "Às vezes", "Raramente"]'::jsonb, 
   8);

  -- ==========================================
  -- SEÇÃO 4: Sobre o setor financeiro
  -- ==========================================
  
  INSERT INTO public.questions (questionnaire_id, section_title, question_text, question_type, is_required, options, order_index)
  VALUES 
  (q_id, '💳 4. Sobre o setor financeiro e processos', 
   'Como você avalia a clareza nas informações sobre valores, planos e formas de pagamento?', 
   'multiple_choice', true, 
   '["Muito clara", "Parcialmente clara", "Confusa"]'::jsonb, 
   9),

  (q_id, '💳 4. Sobre o setor financeiro e processos', 
   'Em caso de dúvidas ou negociações, você se sentiu bem atendido(a) pelo financeiro?', 
   'multiple_choice', true, 
   '["Sim", "Parcialmente", "Não"]'::jsonb, 
   10);

  -- ==========================================
  -- SEÇÃO 5: Sobre tecnologia e estrutura
  -- ==========================================
  
  INSERT INTO public.questions (questionnaire_id, section_title, question_text, question_type, is_required, options, order_index)
  VALUES 
  (q_id, '🖥️ 5. Sobre tecnologia e estrutura', 
   'Como você avalia a organização, limpeza e conforto dos ambientes da clínica?', 
   'multiple_choice', true, 
   '["Excelente", "Boa", "Regular", "Precisa melhorar"]'::jsonb, 
   11),

  (q_id, '🖥️ 5. Sobre tecnologia e estrutura', 
   'Como você percebe a qualidade e o uso das nossas tecnologias e equipamentos durante os atendimentos?', 
   'multiple_choice', true, 
   '["Excelente", "Boa", "Regular", "Precisa melhorar"]'::jsonb, 
   12),

  (q_id, '🖥️ 5. Sobre tecnologia e estrutura', 
   'Você percebe o ambiente da clínica como agradável e acolhedor (cheiro, música, iluminação, conforto)?', 
   'multiple_choice', true, 
   '["Sim", "Parcialmente", "Não"]'::jsonb, 
   13);

  -- ==========================================
  -- SEÇÃO 6: Sobre os bastidores do cuidado
  -- ==========================================
  
  INSERT INTO public.questions (questionnaire_id, section_title, question_text, question_type, is_required, placeholder, order_index)
  VALUES 
  (q_id, '☕ 6. Sobre os bastidores do cuidado', 
   'Você gostaria de deixar algum elogio, sugestão ou observação sobre a equipe da Copa, limpeza ou suporte interno?', 
   'text_long', false,
   'Digite sua resposta aqui...',
   14);

  -- ==========================================
  -- SEÇÃO 7: Sugestões e percepções finais
  -- ==========================================
  
  INSERT INTO public.questions (questionnaire_id, section_title, question_text, question_type, is_required, placeholder, order_index)
  VALUES 
  (q_id, '💬 7. Sugestões e percepções finais', 
   'Existe algo que poderíamos melhorar na sua experiência conosco?', 
   'text_long', false,
   'Suas sugestões são muito importantes para nós...',
   15),

  (q_id, '💬 7. Sugestões e percepções finais', 
   'Você recomendaria a Clínica Carlos Portela a outras pessoas?', 
   'multiple_choice', true, 
   '["Com certeza", "Talvez", "Não"]'::jsonb, 
   16),

  (q_id, '💬 7. Sugestões e percepções finais', 
   'Gostaria de ser contatado(a) para falar mais sobre sua experiência?', 
   'multiple_choice', true, 
   '["Sim, desejo contato", "Não, apenas deixando meu feedback"]'::jsonb, 
   17);

END $$;

-- ============================================
-- 7. VERIFICAÇÃO
-- ============================================

-- Comentário para verificação
COMMENT ON TABLE public.questionnaires IS 'Tabela de questionários/pesquisas';
COMMENT ON TABLE public.questions IS 'Tabela de perguntas dos questionários';
COMMENT ON TABLE public.survey_responses IS 'Tabela de respostas dos usuários';
COMMENT ON TABLE public.answers IS 'Tabela de respostas individuais por pergunta';

-- Fim da migration
