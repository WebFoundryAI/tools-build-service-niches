import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/sections/CTASection";
import { SEOHead } from "@/components/seo/SEOHead";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { BRAND } from "@/config/brand";
import { generateBlogPostSchema } from "@/lib/schema";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  created_at: string;
  indexable: boolean | null;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data as BlogPostData | null;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <section className="hero-section">
          <div className="hero-overlay py-16 md:py-20">
            <div className="container-narrow px-4">
              <Skeleton className="h-6 w-24 mb-6" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </section>
        <section className="section-padding">
          <div className="container-narrow px-4 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-full" />
          </div>
        </section>
      </Layout>
    );
  }

  if (!post || error) {
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

  const breadcrumbItems = [
    { label: "Blog", href: "/blog" },
    { label: post.title },
  ];

  // Convert markdown-style bold to HTML
  const formatContent = (content: string) => {
    return content
      .split("\n\n")
      .map((paragraph) => {
        const formatted = paragraph
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\n/g, "<br />");
        return `<p>${formatted}</p>`;
      })
      .join("");
  };

  // Determine if page should be indexed
  const shouldIndex = post.indexable === true;

  return (
    <Layout>
      <SEOHead
        metadata={{
          title: `${post.title} | ${BRAND.brandName} Blog`,
          description: post.excerpt,
          canonicalUrl: `/blog/${post.slug}`,
          noIndex: !shouldIndex,
        }}
      />
      <SchemaScript
        schema={generateBlogPostSchema(
          post.title,
          post.excerpt,
          post.slug,
          post.created_at
        )}
      />

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
                {new Date(post.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow px-4">
          <Breadcrumbs items={breadcrumbItems} />

          <article
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />

          {/* Internal links */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <Link to="/" className="text-primary hover:underline">
                Home
              </Link>
              {" · "}
              <Link to="/blog" className="text-primary hover:underline">
                All Posts
              </Link>
              {" · "}
              <Link to="/services" className="text-primary hover:underline">
                Services
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

export default BlogPost;
