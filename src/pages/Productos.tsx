import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import { AnimatedHero } from "@/components/AnimatedHero";

const Productos = () => {
  // Placeholder product data
  const productos = [
    {
      id: "1",
      name: "Ataúd Clásico Roble",
      category: "Ataúdes",
      price: "€1,200",
      image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop",
      stock: 5,
    },
    {
      id: "2",
      name: "Urna Cerámica Artesanal",
      category: "Urnas",
      price: "€350",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      stock: 12,
    },
    {
      id: "3",
      name: "Arreglo Floral Premium",
      category: "Flores",
      price: "€180",
      image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop",
      stock: 20,
    },
    {
      id: "4",
      name: "Servicio de Traslado Local",
      category: "Traslados",
      price: "€450",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
      stock: 8,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <AnimatedHero
        title="Productos y Servicios"
        subtitle="Catálogo Completo"
        description="Explora nuestra selección de productos y servicios funerarios de la más alta calidad."
        icon={<ShoppingBag className="w-10 h-10" />}
      />
      
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <Card key={producto.id} className="overflow-hidden card-hover">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={producto.image}
                    alt={producto.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="mb-2">
                    {producto.category}
                  </Badge>
                  <h3 className="font-semibold text-lg mb-2">{producto.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-accent">{producto.price}</span>
                    <span className="text-sm text-muted-foreground">
                      Stock: {producto.stock}
                    </span>
                  </div>
                  <Button className="w-full">Ver Detalles</Button>
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

export default Productos;
