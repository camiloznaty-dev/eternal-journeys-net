import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Funerarias = () => {
  // Placeholder data - will be replaced with real data from Supabase
  const funerarias = [
    {
      id: "1",
      name: "Funeraria San José",
      address: "Av. Principal 123, Ciudad",
      phone: "+34 123 456 789",
      rating: 4.8,
      description: "Servicio funerario integral con más de 30 años de experiencia",
    },
    {
      id: "2",
      name: "Memorial del Valle",
      address: "Calle Central 456, Ciudad",
      phone: "+34 987 654 321",
      rating: 4.5,
      description: "Atención personalizada y servicios de calidad",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Funerarias</h1>
            <p className="text-lg text-muted-foreground">
              Encuentra la funeraria perfecta para tus necesidades
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {funerarias.map((funeraria) => (
              <Card key={funeraria.id} className="p-6 card-hover">
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{funeraria.name}</h3>
                    <p className="text-muted-foreground mb-4">{funeraria.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{funeraria.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{funeraria.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-accent fill-accent" />
                      <span className="font-semibold">{funeraria.rating}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Link to={`/funeraria/${funeraria.id}`} className="flex-1">
                      <Button className="w-full">Ver Detalles</Button>
                    </Link>
                    <Button variant="outline">Contactar</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Funerarias;
