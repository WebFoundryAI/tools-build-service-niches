import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/sections/CTASection";
import { SEOHead } from "@/components/seo/SEOHead";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { Skeleton } from "@/components/ui/skeleton";
import { getBlogSEO } from "@/config/seo";
import { BRAND } from "@/config/brand";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  created_at: string;
}

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${BRAND.brandName} Blog`,
    description: `Drainage tips, advice, and guides from ${BRAND.brandName}`,
    url: `https://${BRAND.domain}/blog`,
    publisher: {
      "@type": "Organization",
      name: BRAND.brandName,
    },
  };

  return (
    <Layout>
      <SEOHead metadata={getBlogSEO()} />
      <SchemaScript schema={blogSchema} />

      <section className="hero-section">
        <div className="hero-overlay py-16 md:py-20">
          <div className="container-wide px-4 text-center text-primary-foreground">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Drainage Tips & Advice
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Expert advice and tips on drainage maintenance and common issues
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl overflow-hidden card-elevated">
                  <Skeleton className="aspect-video" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group bg-card rounded-xl overflow-hidden card-elevated animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <span className="text-4xl">📝</span>
                  </div>
                  <div className="p-6">
                    <time className="text-sm text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    <h2 className="text-xl font-bold mt-2 mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      Read more
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts yet.</p>
            </div>
          )}

          {/* Internal links */}
          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              <Link to="/" className="text-primary hover:underline">
                Home
              </Link>
              {" · "}
              <Link to="/services" className="text-primary hover:underline">
                Services
              </Link>
              {" · "}
              <Link to="/locations" className="text-primary hover:underline">
                Areas
              </Link>
              {" · "}
              <Link to="/contact" className="text-primary hover:underline">
                Contact
              </Link>
            </p>
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default Blog;
