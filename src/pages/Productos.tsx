import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Check } from "lucide-react";
import { AnimatedHero } from "@/components/AnimatedHero";
import heroImage from "@/assets/hero-productos.jpg";
import { SEO } from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Productos = () => {
  const { data: funerariasConPlanes, isLoading } = useQuery({
    queryKey: ['funerarias-planes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('funerarias')
        .select(`
          id,
          name,
          logo_url,
          description,
          slug,
          funeraria_planes!inner(
            id,
            planes(
              id,
              nombre,
              descripcion,
              precio_mensual,
              precio_anual,
              caracteristicas
            )
          )
        `)
        .eq('website_active', true)
        .not('funeraria_planes', 'is', null);

      if (error) throw error;
      return data;
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Planes Funerarios | Compara Servicios de Funerarias | ConectaFunerarias"
        description="Descubre y compara planes funerarios de las principales funerarias en Chile. Encuentra el plan que mejor se adapte a tus necesidades."
        keywords={[
          "planes funerarios",
          "servicios funerarios chile",
          "planes de funeral",
          "comparar funerarias",
          "servicios de velatorio",
          "planes cremación"
        ]}
      />
      <Header />
      
      <AnimatedHero
        title="Planes Funerarios"
        subtitle="Compara y Elige"
        description="Explora los planes funerarios de nuestras funerarias adscritas y encuentra el que mejor se adapte a tus necesidades."
        icon={<Building2 className="w-10 h-10" />}
        backgroundImage={heroImage}
      />
      
      <main className="flex-1 py-8 sm:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !funerariasConPlanes || funerariasConPlanes.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No hay planes disponibles</h3>
              <p className="text-muted-foreground">
                Actualmente no hay funerarias con planes publicados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {funerariasConPlanes.map((funeraria) => (
                <Card key={funeraria.id} className="overflow-hidden card-hover">
                  <CardHeader className="border-b bg-muted/30">
                    <div className="flex items-start gap-4">
                      {funeraria.logo_url && (
                        <img 
                          src={funeraria.logo_url} 
                          alt={funeraria.name}
                          className="w-16 h-16 object-contain rounded-lg bg-background p-2"
                        />
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{funeraria.name}</CardTitle>
                        {funeraria.description && (
                          <CardDescription className="line-clamp-2">
                            {funeraria.description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {funeraria.funeraria_planes.map((fp: any) => {
                        const plan = fp.planes;
                        if (!plan) return null;
                        
                        return (
                          <div key={fp.id} className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-lg">{plan.nombre}</h4>
                                {plan.descripcion && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {plan.descripcion}
                                  </p>
                                )}
                              </div>
                              <Badge variant="secondary">
                                {formatPrice(plan.precio_mensual)}/mes
                              </Badge>
                            </div>
                            
                            {plan.caracteristicas && Array.isArray(plan.caracteristicas) && plan.caracteristicas.length > 0 && (
                              <div className="space-y-2 mb-4">
                                {plan.caracteristicas.map((caracteristica: string, idx: number) => (
                                  <div key={idx} className="flex items-start gap-2 text-sm">
                                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span>{caracteristica}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {plan.precio_anual && (
                              <p className="text-xs text-muted-foreground mb-3">
                                Pago anual: {formatPrice(plan.precio_anual)}
                              </p>
                            )}
                            
                            <Button 
                              className="w-full" 
                              size="sm"
                              onClick={() => {
                                if (funeraria.slug) {
                                  window.location.href = `/funeraria/${funeraria.slug}`;
                                }
                              }}
                            >
                              Ver Funeraria
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
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
