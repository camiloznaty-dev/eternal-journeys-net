import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SearchBar = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold">
          Encuentra funerarias en todo Chile 🇨🇱
        </h2>
        <p className="text-muted-foreground">
          Compara servicios, precios y reseñas en tu región
        </p>
      </div>
      <div className="border border-border rounded-2xl p-2 bg-card shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Ingresa tu ubicación"
              className="pl-12 h-14 border-0 bg-muted/50 rounded-xl focus-visible:ring-1 focus-visible:ring-accent"
            />
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="¿Qué servicio necesitas?"
              className="pl-12 h-14 border-0 bg-muted/50 rounded-xl focus-visible:ring-1 focus-visible:ring-accent"
            />
          </div>
          <Button size="lg" className="h-14 px-8 rounded-xl font-semibold">
            Buscar
          </Button>
        </div>
      </div>
    </div>
  );
};
