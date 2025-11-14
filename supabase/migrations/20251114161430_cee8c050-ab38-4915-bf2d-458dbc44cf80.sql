-- Create enum for question types
CREATE TYPE question_type AS ENUM ('nps', 'scale', 'multiple_choice', 'text_short', 'text_long', 'yes_no');

-- Create questionnaires table
CREATE TABLE public.questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Pesquisa de Satisfação',
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id UUID NOT NULL REFERENCES public.questionnaires(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type question_type NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT true,
  options JSONB, -- For multiple choice options
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create survey_responses table
CREATE TABLE public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id UUID NOT NULL REFERENCES public.questionnaires(id) ON DELETE CASCADE,
  cpf TEXT NOT NULL,
  full_name TEXT NOT NULL,
  product TEXT NOT NULL,
  service TEXT NOT NULL,
  nps_score INTEGER CHECK (nps_score >= 0 AND nps_score <= 10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(cpf, questionnaire_id)
);

-- Create answers table
CREATE TABLE public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID NOT NULL REFERENCES public.survey_responses(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  answer_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- Policies for questionnaires (public read, admin write)
CREATE POLICY "Anyone can view active questionnaires"
  ON public.questionnaires FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage questionnaires"
  ON public.questionnaires FOR ALL
  USING (auth.role() = 'authenticated');

-- Policies for questions (public read active, admin write)
CREATE POLICY "Anyone can view questions from active questionnaires"
  ON public.questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.questionnaires
      WHERE questionnaires.id = questions.questionnaire_id
      AND questionnaires.is_active = true
    )
  );

CREATE POLICY "Authenticated users can manage questions"
  ON public.questions FOR ALL
  USING (auth.role() = 'authenticated');

-- Policies for survey_responses (public insert, admin read)
CREATE POLICY "Anyone can submit survey responses"
  ON public.survey_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all responses"
  ON public.survey_responses FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policies for answers (public insert, admin read)
CREATE POLICY "Anyone can submit answers"
  ON public.answers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all answers"
  ON public.answers FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_questions_questionnaire ON public.questions(questionnaire_id);
CREATE INDEX idx_responses_questionnaire ON public.survey_responses(questionnaire_id);
CREATE INDEX idx_responses_created ON public.survey_responses(created_at DESC);
CREATE INDEX idx_answers_response ON public.answers(response_id);
CREATE INDEX idx_answers_question ON public.answers(question_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for questionnaires
CREATE TRIGGER update_questionnaires_updated_at
  BEFORE UPDATE ON public.questionnaires
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default questionnaire
INSERT INTO public.questionnaires (title, description, is_active)
VALUES ('Pesquisa de Satisfação GO HEALTH', 'Avalie sua experiência com nossos produtos e serviços', true);

-- Get the questionnaire id for the default questions
DO $$
DECLARE
  questionnaire_uuid UUID;
BEGIN
  SELECT id INTO questionnaire_uuid FROM public.questionnaires WHERE title = 'Pesquisa de Satisfação GO HEALTH' LIMIT 1;
  
  -- Insert default NPS question
  INSERT INTO public.questions (questionnaire_id, question_text, question_type, is_required, order_index)
  VALUES (questionnaire_uuid, 'Em uma escala de 0 a 10, qual a probabilidade de você recomendar nossos produtos/serviços para um amigo ou familiar?', 'nps', true, 0);
  
  -- Insert additional default questions
  INSERT INTO public.questions (questionnaire_id, question_text, question_type, is_required, order_index)
  VALUES 
    (questionnaire_uuid, 'Como você avalia a qualidade do produto/serviço recebido?', 'scale', true, 1),
    (questionnaire_uuid, 'O atendimento foi satisfatório?', 'yes_no', true, 2),
    (questionnaire_uuid, 'Deixe seus comentários e sugestões', 'text_long', false, 3);
END $$;