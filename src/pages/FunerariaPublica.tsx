import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Loader2, MapPin, Phone, Mail, Clock, Check, Facebook, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const { data: servicios } = useQuery({
    queryKey: ["funeraria-servicios", funeraria?.id],
    queryFn: async () => {
      if (!funeraria?.id) return [];
      const { data, error } = await supabase
        .from("servicios")
        .select("*")
        .eq("funeraria_id", funeraria.id)
        .eq("stock_available", true)
        .order("is_featured", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!funeraria?.id,
  });

  const { data: productos } = useQuery({
    queryKey: ["funeraria-productos", funeraria?.id],
    queryFn: async () => {
      if (!funeraria?.id) return [];
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("funeraria_id", funeraria.id)
        .gt("stock", 0)
        .order("price", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!funeraria?.id,
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
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                {funeraria.about_text}
              </p>
            </div>
          </section>
        )}

        {/* Servicios y Productos */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="servicios" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="servicios">Servicios</TabsTrigger>
                <TabsTrigger value="productos">Productos</TabsTrigger>
              </TabsList>

              <TabsContent value="servicios" className="mt-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {servicios?.map((servicio) => (
                    <Card key={servicio.id} className="overflow-hidden hover:shadow-lg transition-all">
                      {servicio.images && servicio.images[0] && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={servicio.images[0]}
                            alt={servicio.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold">{servicio.name}</h3>
                          {servicio.is_featured && (
                            <Badge variant="secondary">Destacado</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {servicio.description}
                        </p>
                        {servicio.features && (
                          <ul className="space-y-2 mb-4">
                            {(servicio.features as string[]).slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div>
                            <p className="text-2xl font-bold text-accent">
                              ${servicio.price.toLocaleString('es-CL')}
                            </p>
                            {servicio.duration && (
                              <p className="text-xs text-muted-foreground">
                                {servicio.duration}
                              </p>
                            )}
                          </div>
                          <Button size="sm">Consultar</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="productos" className="mt-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {productos?.map((producto) => (
                    <Card key={producto.id} className="overflow-hidden hover:shadow-lg transition-all">
                      {producto.images && producto.images[0] && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={producto.images[0]}
                            alt={producto.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <h3 className="font-bold mb-2">{producto.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {producto.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold text-accent">
                            ${producto.price.toLocaleString('es-CL')}
                          </p>
                          <Badge variant="outline">{producto.stock} en stock</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Gallery Section */}
        {funeraria.gallery_images && funeraria.gallery_images.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-center">Nuestras Instalaciones</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {funeraria.gallery_images.map((image, idx) => (
                  <div key={idx} className="h-64 overflow-hidden rounded-lg">
                    <img
                      src={image}
                      alt={`Instalación ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" variant="secondary" asChild>
                <a href={`tel:${funeraria.phone}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  Llamar Ahora
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={`mailto:${funeraria.email}`}>
                  <Mail className="mr-2 h-5 w-5" />
                  Enviar Mensaje
                </a>
              </Button>
            </div>
            {(funeraria.facebook_url || funeraria.instagram_url) && (
              <div className="flex gap-4 justify-center">
                {funeraria.facebook_url && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={funeraria.facebook_url} target="_blank" rel="noopener noreferrer">
                      <Facebook className="mr-2 h-4 w-4" />
                      Facebook
                    </a>
                  </Button>
                )}
                {funeraria.instagram_url && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={funeraria.instagram_url} target="_blank" rel="noopener noreferrer">
                      <Instagram className="mr-2 h-4 w-4" />
                      Instagram
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
