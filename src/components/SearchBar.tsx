import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SearchBar = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card rounded-2xl shadow-2xl p-6 md:p-8 elegant-shadow border border-border/50 backdrop-blur-sm hero-glow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
            <Input
              placeholder="Ubicación (ciudad, código postal)"
              className="pl-12 h-14 text-base bg-background/50 border-border/50 focus:border-accent"
            />
          </div>
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
            <Input
              placeholder="Buscar servicio o funeraria"
              className="pl-12 h-14 text-base bg-background/50 border-border/50 focus:border-accent"
            />
          </div>
          <Button size="lg" className="h-14 px-10 text-base hover:scale-105 transition-transform">
            Buscar
          </Button>
        </div>
      </div>
    </div>
  );
};
