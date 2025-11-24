import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";
import { ConsultaSepulturaDialog } from "@/components/ConsultaSepulturaDialog";

interface AnuncioSepulturaCardProps {
  anuncio: {
    id: string;
    titulo: string;
    descripcion: string | null;
    cementerio: string;
    comuna: string;
    tipo_sepultura: string;
    precio: number;
    fotos: string[];
    destacado: boolean;
  };
}

export const AnuncioSepulturaCard = ({ anuncio }: AnuncioSepulturaCardProps) => {
  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(precio);
  };

  const imagenPrincipal = anuncio.fotos && anuncio.fotos.length > 0 
    ? anuncio.fotos[0] 
    : "https://images.unsplash.com/photo-1580130732478-1d2f2f6d5e9f?w=600&h=400&fit=crop";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={imagenPrincipal}
          alt={anuncio.titulo}
          className="w-full h-48 object-cover"
        />
        {anuncio.destacado && (
          <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Destacado
          </Badge>
        )}
        <Badge className="absolute top-2 left-2 bg-background/90 text-foreground">
          {anuncio.tipo_sepultura}
        </Badge>
      </div>
      
      <CardHeader className="pb-3">
        <h3 className="font-semibold text-lg line-clamp-1">{anuncio.titulo}</h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-1" />
          {anuncio.cementerio}, {anuncio.comuna}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {anuncio.descripcion && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {anuncio.descripcion}
          </p>
        )}
        <div className="text-2xl font-bold text-primary">
          {formatPrecio(anuncio.precio)}
        </div>
      </CardContent>

      <CardFooter>
        <ConsultaSepulturaDialog anuncioId={anuncio.id} />
      </CardFooter>
    </Card>
  );
};