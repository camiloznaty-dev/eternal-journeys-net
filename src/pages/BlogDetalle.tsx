import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, User, ArrowLeft, Share2, Eye } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import 'react-quill/dist/quill.snow.css';

export default function BlogDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", id)
        .eq("estado", "publicado")
        .single();

      if (error) throw error;
      
      // Increment view count
      if (data) {
        await supabase
          .from("blog_posts")
          .update({ views: (data.views || 0) + 1 })
          .eq("id", data.id);
      }
      
      return data;
    },
  });

  const { data: recentPosts } = useQuery({
    queryKey: ["recent-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, titulo, slug, imagen_portada, fecha_publicacion, created_at")
        .eq("estado", "publicado")
        .order("fecha_publicacion", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (error) {
      toast.error("No se pudo cargar el post");
      navigate("/blog");
    }
  }, [error, navigate]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.titulo,
        text: post?.subtitulo || post?.bajada,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-8" />
            <Skeleton className="h-96 w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-3xl font-bold mb-4">Post no encontrado</h1>
            <Button onClick={() => navigate("/blog")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al blog
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Hero Section with Image */}
      {post.imagen_portada && (
        <div className="relative w-full h-[50vh] min-h-[400px] bg-muted">
          <img 
            src={post.imagen_portada} 
            alt={post.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      )}
      
      <main className={`flex-1 ${post.imagen_portada ? '-mt-32' : 'py-12'}`}>
        <div className="container mx-auto px-4 max-w-4xl">
          <article className="relative bg-card rounded-lg shadow-lg p-8 md:p-12">
            {/* Back Button */}
            <Link to="/blog">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al blog
              </Button>
            </Link>

            {/* Title and Subtitle */}
            <header className="mb-8 border-b pb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {post.titulo}
              </h1>
              
              {post.subtitulo && (
                <p className="text-xl text-muted-foreground mb-6">
                  {post.subtitulo}
                </p>
              )}

              {post.bajada && (
                <p className="text-lg text-muted-foreground/80 italic">
                  {post.bajada}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted-foreground">
                {post.autor_nombre && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.autor_nombre}</span>
                  </div>
                )}
                
                {post.fecha_publicacion && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(post.fecha_publicacion), "d 'de' MMMM, yyyy", { locale: es })}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{post.views || 0} vistas</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="ml-auto"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </header>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:mb-4 prose-ul:mb-4 prose-ol:mb-4 prose-li:mb-2 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic ql-editor"
              dangerouslySetInnerHTML={{ __html: post.contenido }}
            />

            {/* Tags/Keywords */}
            {post.meta_keywords && post.meta_keywords.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">ETIQUETAS</h3>
                <div className="flex flex-wrap gap-2">
                  {post.meta_keywords.map((keyword: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Recent Posts */}
          {recentPosts && recentPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Artículos recientes</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {recentPosts
                  .filter((p: any) => p.slug !== id)
                  .slice(0, 3)
                  .map((recentPost: any) => (
                    <Card
                      key={recentPost.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/blog/${recentPost.slug}`)}
                    >
                      {recentPost.imagen_portada && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={recentPost.imagen_portada}
                            alt={recentPost.titulo}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2">
                          {recentPost.titulo}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            new Date(recentPost.fecha_publicacion || recentPost.created_at),
                            "d 'de' MMMM, yyyy",
                            { locale: es }
                          )}
                        </p>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}