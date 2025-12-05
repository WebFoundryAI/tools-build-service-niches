import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/sections/CTASection";
import { ArrowRight } from "lucide-react";

// Placeholder blog posts - will be replaced with dynamic content later
const blogPosts = [
  {
    slug: "signs-of-blocked-drain",
    title: "5 Signs You Have a Blocked Drain",
    excerpt: "Learn the early warning signs of a blocked drain and when to call in the professionals.",
    date: "2024-01-15",
  },
  {
    slug: "prevent-drain-blockages",
    title: "How to Prevent Drain Blockages",
    excerpt: "Simple tips to keep your drains flowing freely and avoid costly callouts.",
    date: "2024-01-10",
  },
  {
    slug: "when-to-get-cctv-survey",
    title: "When Do You Need a CCTV Drain Survey?",
    excerpt: "Understanding when a CCTV drain survey is necessary and what it involves.",
    date: "2024-01-05",
  },
];

const Blog = () => {
  return (
    <Layout>
      <section className="hero-section">
        <div className="hero-overlay py-16 md:py-20">
          <div className="container-wide px-4 text-center text-primary-foreground">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Drainage Tips & Advice</h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Expert advice and tips on drainage maintenance and common issues
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group bg-card rounded-xl overflow-hidden card-elevated animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-video bg-muted" />
                <div className="p-6">
                  <time className="text-sm text-muted-foreground">
                    {new Date(post.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                  <h2 className="text-xl font-bold mt-2 mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
                  <span className="inline-flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                    Read more
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default Blog;
