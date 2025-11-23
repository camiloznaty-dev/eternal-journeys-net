import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SearchBar = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card rounded-xl shadow-lg p-4 md:p-6 elegant-shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Ubicación (ciudad, código postal)"
              className="pl-10 h-12 text-base"
            />
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar servicio o funeraria"
              className="pl-10 h-12 text-base"
            />
          </div>
          <Button size="lg" className="h-12 px-8">
            Buscar
          </Button>
        </div>
      </div>
    </div>
  );
};
