import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { CategoryCard } from "@/components/CategoryCard";
import { HowItWorks } from "@/components/HowItWorks";
import { ForFunerarias } from "@/components/ForFunerarias";
import { PricingPlans } from "@/components/PricingPlans";
import { Testimonials } from "@/components/Testimonials";
import { Stats } from "@/components/Stats";
import { FAQ } from "@/components/FAQ";
import { Button } from "@/components/ui/button";
import { Flower2, Truck, Package, Heart } from "lucide-react";
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
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-bold"
              >
                Servicios y productos
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-muted-foreground"
              >
                Todo lo que necesitas en un solo lugar
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {categories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CategoryCard {...category} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <HowItWorks />
        <Stats />
        <ForFunerarias />
        <PricingPlans />
        <Testimonials />
        <FAQ />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
