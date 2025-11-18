-- Add slug column to questionnaires table
ALTER TABLE public.questionnaires
ADD COLUMN slug TEXT UNIQUE;

-- Create index for slug
CREATE INDEX idx_questionnaires_slug ON public.questionnaires(slug);

-- Update existing questionnaire with a default slug
UPDATE public.questionnaires
SET slug = 'pesquisa-satisfacao'
WHERE slug IS NULL AND is_active = true;

-- Add comment
COMMENT ON COLUMN public.questionnaires.slug IS 'URL-friendly identifier for the questionnaire';
