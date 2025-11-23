import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { CategoryCard } from "@/components/CategoryCard";
import { Button } from "@/components/ui/button";
import { Flower2, Truck, Package, Scale, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const categories = [
    {
      title: "Traslados",
      description: "Servicios de traslado seguros y respetuosos",
      icon: Truck,
      href: "/productos?category=traslado",
    },
    {
      title: "Ataúdes",
      description: "Amplia selección de ataúdes de calidad",
      icon: Package,
      href: "/productos?category=ataud",
    },
    {
      title: "Cremaciones",
      description: "Servicios de cremación con dignidad",
      icon: Heart,
      href: "/productos?category=cremacion",
    },
    {
      title: "Arreglos Florales",
      description: "Hermosos arreglos para honrar la memoria",
      icon: Flower2,
      href: "/productos?category=flores",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 hero-gradient opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                En los momentos difíciles,
                <span className="block text-accent mt-2">estamos contigo</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Encuentra y compara servicios funerarios de calidad con dignidad y respeto
              </p>
            </div>
            <SearchBar />
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Servicios y Productos</h2>
              <p className="text-lg text-muted-foreground">
                Todo lo que necesitas en un solo lugar
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.title} {...category} />
              ))}
            </div>
          </div>
        </section>

        {/* Comparator CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-card rounded-2xl p-8 md:p-12 elegant-shadow border border-border">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center md:text-left">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 mx-auto md:mx-0">
                    <Scale className="h-8 w-8 text-accent" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Comparador de Funerarias</h2>
                  <p className="text-lg text-muted-foreground">
                    Compara precios, servicios y valoraciones de las mejores funerarias en tu zona
                  </p>
                </div>
                <Link to="/comparar">
                  <Button size="lg" className="text-lg px-8">
                    Comparar Ahora
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Obituaries Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Obituarios Digitales</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Honra la memoria de tus seres queridos con un espacio digital permanente
              </p>
              <Link to="/obituarios">
                <Button variant="outline" size="lg">
                  Ver Obituarios
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
