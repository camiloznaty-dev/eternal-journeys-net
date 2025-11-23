import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Loader2, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FunerariaPublica() {
  const { slug } = useParams<{ slug: string }>();

  const { data: funeraria, isLoading } = useQuery({
    queryKey: ["funeraria-publica", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funerarias")
        .select("*")
        .eq("slug", slug)
        .eq("website_active", true)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!funeraria) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Funeraria no encontrada</h1>
            <p className="text-muted-foreground">
              La funeraria que buscas no existe o no está disponible.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section
          className="relative h-96 bg-cover bg-center"
          style={{
            backgroundImage: funeraria.hero_image_url
              ? `url(${funeraria.hero_image_url})`
              : 'linear-gradient(to right, #000000, #333333)',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="container relative mx-auto px-4 h-full flex flex-col justify-center text-white">
            <h1 className="text-5xl font-bold mb-4">{funeraria.name}</h1>
            <p className="text-xl max-w-2xl">{funeraria.description}</p>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Ubicación</h3>
                    <p className="text-sm text-muted-foreground">{funeraria.address}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <Phone className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Teléfono</h3>
                    <p className="text-sm text-muted-foreground">{funeraria.phone}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-sm text-muted-foreground">{funeraria.email}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <Clock className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Horarios</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {funeraria.horarios}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* About Section */}
        {funeraria.about_text && (
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-3xl font-bold mb-6">Sobre Nosotros</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {funeraria.about_text}
              </p>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">¿Necesitas nuestros servicios?</h2>
            <p className="text-lg mb-8 opacity-90">
              Estamos disponibles 24/7 para ayudarte en estos momentos difíciles
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Phone className="mr-2 h-5 w-5" />
                Llamar Ahora
              </Button>
              <Button size="lg" variant="outline">
                <Mail className="mr-2 h-5 w-5" />
                Enviar Mensaje
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
