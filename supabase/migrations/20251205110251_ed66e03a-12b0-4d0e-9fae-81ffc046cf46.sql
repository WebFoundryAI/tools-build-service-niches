-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read blog posts (public)
CREATE POLICY "Anyone can read blog posts"
ON public.blog_posts
FOR SELECT
USING (true);

-- Only authenticated users can create/update/delete blog posts
CREATE POLICY "Authenticated users can create blog posts"
ON public.blog_posts
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update blog posts"
ON public.blog_posts
FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blog posts"
ON public.blog_posts
FOR DELETE
USING (auth.role() = 'authenticated');

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_ai_content_updated_at();

-- Insert some seed blog posts
INSERT INTO public.blog_posts (slug, title, excerpt, content) VALUES
('signs-of-blocked-drain', '5 Signs You Have a Blocked Drain', 'Learn the early warning signs of a blocked drain and when to call in the professionals.', 'A blocked drain can quickly turn from a minor inconvenience into a major problem if left untreated. Here are five warning signs to watch out for:

**1. Slow Draining Water**
If water is taking longer than usual to drain from your sink, bath, or shower, it is often the first sign of a developing blockage.

**2. Unpleasant Odours**
Bad smells coming from your drains are a clear indicator that something is wrong. This is often caused by food waste, grease, or other debris decomposing in your pipes.

**3. Gurgling Sounds**
Strange gurgling noises from your drains or toilet can indicate that air is trapped in your drainage system due to a blockage.

**4. Raised Water Levels**
If the water level in your toilet bowl is higher or lower than usual, or fluctuates, this could signal a blockage in your drainage system.

**5. Multiple Blocked Fixtures**
If more than one fixture in your home is draining slowly or backing up, you may have a blockage in your main drain.

**What To Do Next**
If you are experiencing any of these symptoms, it is best to call in a professional before the problem gets worse. Our team can quickly diagnose and clear any blockage, getting your drains flowing freely again.'),

('prevent-drain-blockages', 'How to Prevent Drain Blockages', 'Simple tips to keep your drains flowing freely and avoid costly callouts.', 'Prevention is always better than cure when it comes to blocked drains. Here are some practical tips to keep your drains flowing freely:

**Kitchen Drains**
- Never pour cooking oil or grease down the sink. Let it cool and dispose of it in the bin.
- Use a sink strainer to catch food particles.
- Run hot water after washing up to help clear any residue.

**Bathroom Drains**
- Use a drain guard to catch hair in showers and baths.
- Clean drain covers regularly.
- Avoid flushing anything other than toilet paper.

**General Tips**
- Pour boiling water down drains weekly to help dissolve buildup.
- Consider using a biological drain cleaner monthly.
- Never pour chemicals like paint or cleaning products down drains.

**When to Call a Professional**
If you notice any signs of slow drainage despite taking preventive measures, it is best to call a professional before a small problem becomes a big one.'),

('when-to-get-cctv-survey', 'When Do You Need a CCTV Drain Survey?', 'Understanding when a CCTV drain survey is necessary and what it involves.', 'A CCTV drain survey uses specialist camera equipment to inspect your drainage system from the inside. Here is when you might need one:

**Buying a Property**
A pre-purchase drain survey can identify potential issues before you commit to buying. This could save you thousands in unexpected repair costs.

**Persistent Drainage Problems**
If you have recurring blockages or slow drains that keep coming back despite clearing, a CCTV survey can identify the root cause.

**Before Building Work**
If you are planning an extension or renovation, a survey will map your existing drainage and identify any issues that need addressing.

**Insurance Claims**
If you need to make a claim for drain damage, a CCTV survey provides documented evidence of the problem.

**What to Expect**
During a survey, a small camera is inserted into your drains to capture footage of the pipe condition. You will receive a full report with findings and recommendations.

**The Benefits**
- Accurate diagnosis of problems
- No digging required for investigation
- Documented evidence for insurance or legal purposes
- Peace of mind about your drainage system');
