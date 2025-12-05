import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/sections/CTASection";
import { ArrowLeft } from "lucide-react";

// Placeholder - will be replaced with dynamic content
const blogContent: Record<string, { title: string; content: string; date: string }> = {
  "signs-of-blocked-drain": {
    title: "5 Signs You Have a Blocked Drain",
    date: "2024-01-15",
    content: `
      <p>A blocked drain can quickly turn from a minor inconvenience into a major problem if left untreated. Here are five warning signs to watch out for:</p>
      
      <h2>1. Slow Draining Water</h2>
      <p>If water is taking longer than usual to drain from your sink, bath, or shower, it's often the first sign of a developing blockage.</p>
      
      <h2>2. Unpleasant Odours</h2>
      <p>Bad smells coming from your drains are a clear indicator that something is wrong. This is often caused by food waste, grease, or other debris decomposing in your pipes.</p>
      
      <h2>3. Gurgling Sounds</h2>
      <p>Strange gurgling noises from your drains or toilet can indicate that air is trapped in your drainage system due to a blockage.</p>
      
      <h2>4. Raised Water Levels</h2>
      <p>If the water level in your toilet bowl is higher or lower than usual, or fluctuates, this could signal a blockage in your drainage system.</p>
      
      <h2>5. Multiple Blocked Fixtures</h2>
      <p>If more than one fixture in your home is draining slowly or backing up, you may have a blockage in your main drain.</p>
      
      <h2>What To Do Next</h2>
      <p>If you're experiencing any of these symptoms, it's best to call in a professional before the problem gets worse. Our team can quickly diagnose and clear any blockage, getting your drains flowing freely again.</p>
    `,
  },
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogContent[slug] : null;

  if (!post) {
    return (
      <Layout>
        <div className="section-padding text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-primary hover:underline">
            View all posts
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="hero-section">
        <div className="hero-overlay py-16 md:py-20">
          <div className="container-narrow px-4">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              All Posts
            </Link>
            <div className="text-primary-foreground">
              <time className="text-primary-foreground/70">
                {new Date(post.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2">{post.title}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow px-4">
          <article
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default BlogPost;
