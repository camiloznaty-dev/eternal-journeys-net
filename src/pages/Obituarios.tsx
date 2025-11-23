import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Obituarios = () => {
  // Placeholder obituary data
  const obituarios = [
    {
      id: "1",
      name: "María González Pérez",
      birthDate: "1945-03-15",
      deathDate: "2024-11-20",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
      isPremium: true,
      views: 234,
      condolencias: 45,
    },
    {
      id: "2",
      name: "José Martínez López",
      birthDate: "1952-08-22",
      deathDate: "2024-11-18",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
      isPremium: false,
      views: 189,
      condolencias: 32,
    },
    {
      id: "3",
      name: "Carmen Rodríguez Silva",
      birthDate: "1938-12-10",
      deathDate: "2024-11-15",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop",
      isPremium: true,
      views: 421,
      condolencias: 78,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Obituarios</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Honrando la memoria de quienes partieron
            </p>
            <Button variant="outline">
              Crear Obituario
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {obituarios.map((obituario) => (
              <Link key={obituario.id} to={`/obituario/${obituario.id}`}>
                <Card className="overflow-hidden card-hover h-full">
                  <div className="relative">
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img
                        src={obituario.photo}
                        alt={obituario.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {obituario.isPremium && (
                      <Badge className="absolute top-4 right-4 bg-accent">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{obituario.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {new Date(obituario.birthDate).getFullYear()} -{" "}
                      {new Date(obituario.deathDate).getFullYear()}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{obituario.views} visitas</span>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{obituario.condolencias} condolencias</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Obituarios;
