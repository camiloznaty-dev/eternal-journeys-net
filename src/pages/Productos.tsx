import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { AnimatedHero } from "@/components/AnimatedHero";
import heroImage from "@/assets/hero-productos.jpg";
import { SEO } from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Productos = () => {
  const { data: funerariasConServicios, isLoading } = useQuery({
    queryKey: ['funerarias-servicios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('funerarias')
        .select(`
          id,
          name,
          logo_url,
          description,
          slug,
          servicios(
            id,
            name,
            description,
            price,
            category,
            images,
            duration,
            features,
            is_featured
          )
        `)
        .eq('website_active', true)
        .not('servicios', 'is', null);

      if (error) throw error;
      
      // Filter out funerarias with no servicios
      return data?.filter(f => f.servicios && f.servicios.length > 0) || [];
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const categoryLabels: Record<string, string> = {
    plan_funerario: "Plan Funerario",
    traslado: "Traslado",
    cremacion: "Cremación",
    arreglo_floral: "Arreglo Floral",
    velorio: "Velorio",
    ceremonia: "Ceremonia",
    lapida: "Lápida",
    urna: "Urna",
    otro: "Otro"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Servicios Funerarios | Compara Planes y Servicios | ConectaFunerarias"
        description="Descubre y compara servicios funerarios de las principales funerarias en Chile: planes completos, traslados, cremación, velorios y más."
        keywords={[
          "servicios funerarios",
          "planes funerarios chile",
          "cremación",
          "servicios de velatorio",
          "traslado funerario",
          "arreglos florales"
        ]}
      />
      <Header />
      
      <AnimatedHero
        title="Servicios Funerarios"
        subtitle="Compara y Elige"
        description="Explora los servicios funerarios de nuestras funerarias adscritas y encuentra el que mejor se adapte a tus necesidades."
        icon={<Building2 className="w-10 h-10" />}
        backgroundImage={heroImage}
      />
      
      <main className="flex-1 py-8 sm:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !funerariasConServicios || funerariasConServicios.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No hay servicios disponibles</h3>
              <p className="text-muted-foreground">
                Actualmente no hay funerarias con servicios publicados.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {funerariasConServicios.map((funeraria) => (
                <div key={funeraria.id}>
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                    {funeraria.logo_url && (
                      <img 
                        src={funeraria.logo_url} 
                        alt={funeraria.name}
                        className="w-16 h-16 object-contain rounded-lg bg-background p-2 border"
                      />
                    )}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold">{funeraria.name}</h2>
                      {funeraria.description && (
                        <p className="text-muted-foreground">{funeraria.description}</p>
                      )}
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        if (funeraria.slug) {
                          window.location.href = `/funeraria/${funeraria.slug}`;
                        }
                      }}
                    >
                      Ver Funeraria
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {funeraria.servicios?.map((servicio: any) => (
                      <Card key={servicio.id} className="overflow-hidden card-hover h-full flex flex-col">
                        {servicio.images && servicio.images.length > 0 && (
                          <div className="aspect-video relative overflow-hidden bg-muted">
                            <img
                              src={servicio.images[0]}
                              alt={servicio.name}
                              className="w-full h-full object-cover"
                            />
                            {servicio.is_featured && (
                              <Badge className="absolute top-2 right-2" variant="default">
                                Destacado
                              </Badge>
                            )}
                          </div>
                        )}
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-lg line-clamp-2 flex-1">
                              {servicio.name}
                            </CardTitle>
                            <Badge variant="secondary" className="text-xs whitespace-nowrap">
                              {categoryLabels[servicio.category] || servicio.category}
                            </Badge>
                          </div>
                          {servicio.description && (
                            <CardDescription className="line-clamp-2">
                              {servicio.description}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                          <div className="space-y-2 mb-4">
                            {servicio.duration && (
                              <p className="text-sm text-muted-foreground">
                                Duración: {servicio.duration}
                              </p>
                            )}
                            {servicio.features && Array.isArray(servicio.features) && servicio.features.length > 0 && (
                              <ul className="text-sm space-y-1">
                                {servicio.features.slice(0, 3).map((feature: string, idx: number) => (
                                  <li key={idx} className="text-muted-foreground">• {feature}</li>
                                ))}
                                {servicio.features.length > 3 && (
                                  <li className="text-xs text-muted-foreground italic">
                                    +{servicio.features.length - 3} más...
                                  </li>
                                )}
                              </ul>
                            )}
                          </div>
                          <div className="mt-auto pt-4 border-t">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-primary">
                                {formatPrice(servicio.price)}
                              </span>
                              <Button size="sm" variant="outline">
                                Consultar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Productos;
