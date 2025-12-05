-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Service role can manage content" ON public.ai_content;

-- Allow inserts from edge functions (they bypass RLS with service role)
-- But also allow inserts with a simple policy for testing
CREATE POLICY "Allow all inserts to ai_content" 
ON public.ai_content 
FOR INSERT 
WITH CHECK (true);

-- Allow updates for regeneration
CREATE POLICY "Allow all updates to ai_content" 
ON public.ai_content 
FOR UPDATE 
USING (true);