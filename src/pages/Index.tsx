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
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                    En los momentos{" "}
                    <span className="relative inline-block">
                      difíciles,
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="absolute bottom-2 left-0 h-3 bg-accent/20 -z-10"
                      />
                    </span>
                    <br />
                    <span className="text-accent">estamos contigo</span>
                  </h1>
                  
                  <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                    Encuentra y compara servicios funerarios con dignidad y transparencia en todo Chile
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-3">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20"
                  >
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-sm font-medium">Atención 24/7</span>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="px-4 py-2 rounded-full bg-secondary border border-border"
                  >
                    <span className="text-sm font-medium">+500 Funerarias</span>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="px-4 py-2 rounded-full bg-secondary border border-border"
                  >
                    <span className="text-sm font-medium">Cobertura Nacional</span>
                  </motion.div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="text-base px-8 group">
                    Buscar Servicios
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      className="inline-block ml-2"
                    >
                      →
                    </motion.span>
                  </Button>
                  <Button size="lg" variant="outline" className="text-base px-8">
                    Cómo funciona
                  </Button>
                </div>

                {/* Mini Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                  >
                    <div className="text-2xl md:text-3xl font-bold mb-1">24h</div>
                    <div className="text-xs text-muted-foreground">Respuesta rápida</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-center"
                  >
                    <div className="text-2xl md:text-3xl font-bold mb-1">100%</div>
                    <div className="text-xs text-muted-foreground">Gratuito para familias</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center"
                  >
                    <div className="text-2xl md:text-3xl font-bold mb-1">4.9★</div>
                    <div className="text-xs text-muted-foreground">Calificación promedio</div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Visual */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative hidden lg:block"
              >
                <div className="relative">
                  {/* Main Card */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card border border-border rounded-2xl p-8 shadow-2xl"
                  >
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                          <Heart className="w-8 h-8 text-accent" />
                        </div>
                        <div>
                          <div className="font-semibold text-lg">Apoyo Integral</div>
                          <div className="text-sm text-muted-foreground">Todo en un solo lugar</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 rounded-full bg-accent" />
                          <span>Comparación de precios</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 rounded-full bg-accent" />
                          <span>Obituarios digitales</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 rounded-full bg-accent" />
                          <span>Gestión simplificada</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating Badge */}
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    className="absolute -top-4 -right-4 bg-accent text-accent-foreground rounded-full px-6 py-3 font-bold shadow-lg"
                  >
                    Verificado
                  </motion.div>

                  {/* Decorative Elements */}
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-accent/5 blur-xl"
                  />
                  <motion.div
                    animate={{ 
                      y: [0, 10, 0],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                    className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-accent/5 blur-xl"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quick Search Section */}
        <section className="py-12 -mt-8 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <SearchBar />
            </motion.div>
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
