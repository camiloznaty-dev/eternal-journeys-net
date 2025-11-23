import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { CategoryCard } from "@/components/CategoryCard";
import { Button } from "@/components/ui/button";
import { Flower2, Truck, Package, Scale, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
        <section className="relative py-32 md:py-48">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                  En los momentos difíciles,
                  <span className="block text-accent mt-2">estamos contigo</span>
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Encuentra y compara servicios funerarios con dignidad y transparencia
                </p>
              </motion.div>
              
              <SearchBar />
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold">Servicios</h2>
              <p className="text-muted-foreground">
                Todo lo que necesitas
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {categories.map((category) => (
                <CategoryCard key={category.title} {...category} />
              ))}
            </div>
          </div>
        </section>

        {/* Comparator CTA */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <Scale className="h-12 w-12 text-accent mx-auto" />
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Comparador</h2>
                <p className="text-lg text-muted-foreground">
                  Compara precios y servicios de funerarias en tu zona
                </p>
              </div>
              <Link to="/comparar">
                <Button size="lg" className="px-8">
                  Comparar
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Obituaries Section */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <Heart className="h-12 w-12 text-accent mx-auto" />
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Obituarios</h2>
                <p className="text-lg text-muted-foreground">
                  Un espacio digital para honrar la memoria
                </p>
              </div>
              <Link to="/obituarios">
                <Button variant="outline" size="lg" className="px-8">
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
