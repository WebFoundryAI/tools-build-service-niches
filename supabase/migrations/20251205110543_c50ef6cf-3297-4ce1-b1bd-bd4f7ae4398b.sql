-- Allow anonymous users to insert/update/delete blog posts and ai_content for admin functionality
-- In production, this should be protected by proper authentication

DROP POLICY IF EXISTS "Authenticated users can create blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON public.blog_posts;

CREATE POLICY "Anyone can create blog posts"
ON public.blog_posts
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update blog posts"
ON public.blog_posts
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete blog posts"
ON public.blog_posts
FOR DELETE
USING (true);

-- Also ensure ai_content can be deleted for cache clearing
DROP POLICY IF EXISTS "Anyone can delete ai_content" ON public.ai_content;

CREATE POLICY "Anyone can delete ai_content"
ON public.ai_content
FOR DELETE
USING (true);