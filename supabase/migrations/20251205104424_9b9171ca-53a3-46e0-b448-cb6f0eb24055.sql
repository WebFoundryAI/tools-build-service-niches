-- Create ai_content table for caching AI-generated content
CREATE TABLE public.ai_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ai_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access to cached content
CREATE POLICY "Anyone can read cached content" 
ON public.ai_content 
FOR SELECT 
USING (true);

-- Allow service role to insert/update content (edge functions)
CREATE POLICY "Service role can manage content" 
ON public.ai_content 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create index on key for fast lookups
CREATE INDEX idx_ai_content_key ON public.ai_content(key);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_ai_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ai_content_updated_at
BEFORE UPDATE ON public.ai_content
FOR EACH ROW
EXECUTE FUNCTION public.update_ai_content_updated_at();