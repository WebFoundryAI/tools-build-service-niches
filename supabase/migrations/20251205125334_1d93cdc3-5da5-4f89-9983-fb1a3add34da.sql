-- Add metadata fields to ai_content for "Who/How/Why/Reviewed" tracking
ALTER TABLE public.ai_content
ADD COLUMN IF NOT EXISTS how_created text DEFAULT 'AI-assisted',
ADD COLUMN IF NOT EXISTS why_created text,
ADD COLUMN IF NOT EXISTS human_reviewed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS reviewed_by text,
ADD COLUMN IF NOT EXISTS reviewed_at timestamp with time zone;

-- Add metadata and indexing fields to blog_posts
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS how_created text DEFAULT 'AI-assisted',
ADD COLUMN IF NOT EXISTS why_created text,
ADD COLUMN IF NOT EXISTS human_reviewed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS reviewed_by text,
ADD COLUMN IF NOT EXISTS reviewed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS indexable boolean DEFAULT false;

-- Create index for quick filtering of unreviewed content
CREATE INDEX IF NOT EXISTS idx_ai_content_unreviewed ON public.ai_content (human_reviewed) WHERE human_reviewed = false;
CREATE INDEX IF NOT EXISTS idx_blog_posts_unreviewed ON public.blog_posts (human_reviewed) WHERE human_reviewed = false;
CREATE INDEX IF NOT EXISTS idx_blog_posts_indexable ON public.blog_posts (indexable);