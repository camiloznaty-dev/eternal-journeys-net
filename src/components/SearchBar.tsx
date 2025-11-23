import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SearchBar = () => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="border border-border rounded-lg p-1 bg-card">
        <div className="flex flex-col md:flex-row gap-1">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ubicación"
              className="pl-9 h-11 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar servicio"
              className="pl-9 h-11 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button size="lg" className="h-11 px-6">
            Buscar
          </Button>
        </div>
      </div>
    </div>
  );
};
