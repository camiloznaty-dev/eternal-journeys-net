import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { CategoryCard } from "@/components/CategoryCard";
import { HowItWorks } from "@/components/HowItWorks";
import { ForFunerarias } from "@/components/ForFunerarias";
import { PricingPlans } from "@/components/PricingPlans";
import { PricingComparison } from "@/components/PricingComparison";
import { Testimonials } from "@/components/Testimonials";
import { Stats } from "@/components/Stats";
import { FAQ } from "@/components/FAQ";
import { FeaturedFunerarias } from "@/components/FeaturedFunerarias";
import { ComoFunciona } from "@/components/ComoFunciona";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { Flower2, Truck, Package, Heart, Sparkles, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-memorial-park.jpg";

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
        <section className="relative py-6 sm:py-12 md:py-16 lg:py-20 overflow-hidden bg-gradient-hero">
          {/* Floating Emojis Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-20 left-[10%] text-4xl opacity-20"
            >
              ❤️
            </motion.div>
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute top-40 right-[15%] text-3xl opacity-20"
            >
              💙
            </motion.div>
            <motion.div
              animate={{ 
                y: [0, -25, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 7, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute bottom-40 left-[20%] text-3xl opacity-20"
            >
              ✨
            </motion.div>
            <motion.div
              animate={{ 
                y: [0, -18, 0],
                rotate: [0, 8, 0]
              }}
              transition={{ 
                duration: 5.5, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute top-60 left-[5%] text-2xl opacity-15"
            >
              🤍
            </motion.div>
            <motion.div
              animate={{ 
                y: [0, -22, 0],
                rotate: [0, -8, 0]
              }}
              transition={{ 
                duration: 6.5, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
              className="absolute bottom-20 right-[10%] text-3xl opacity-20"
            >
              🌸
            </motion.div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-7xl mx-auto">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div className="space-y-4 sm:space-y-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent/5 border border-accent/10 mb-2"
                  >
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                    <span className="text-xs sm:text-sm font-medium">Plataforma más humana de Chile ❤️</span>
                  </motion.div>
                  
                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                    En los momentos{" "}
                    <span className="relative inline-block">
                      difíciles,
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="absolute bottom-1 sm:bottom-2 left-0 h-3 sm:h-4 bg-gradient-warm opacity-20 -z-10 rounded-full"
                      />
                    </span>
                    <br />
                    <span className="text-gradient">
                      estamos contigo
                    </span>
                  </h1>
                  
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl">
                    Encuentra y compara servicios funerarios con dignidad y transparencia en todo Chile 🇨🇱
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent/10 border border-accent/20"
                  >
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-xs sm:text-sm font-medium">Atención 24/7 💬</span>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary border border-border"
                  >
                    <span className="text-xs sm:text-sm font-medium">+500 Funerarias 🏢</span>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary border border-border"
                  >
                    <span className="text-xs sm:text-sm font-medium">Cobertura Nacional 🗺️</span>
                  </motion.div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 group shadow-medium hover:shadow-glow transition-all" asChild>
                      <Link to="/funerarias">
                        Buscar Servicios
                        <motion.span
                          initial={{ x: 0 }}
                          whileHover={{ x: 5 }}
                          className="inline-block ml-2"
                        >
                          →
                        </motion.span>
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 border-2 hover:bg-accent/5"
                      onClick={() => {
                        document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Cómo funciona ✨
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8" asChild>
                      <Link to="/mi-cuenta?demo=true">
                        <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        Ver Panel Demo
                      </Link>
                    </Button>
                  </motion.div>
                </div>

                {/* Mini Stats */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                  >
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 sm:mb-1">100%</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">Transparente</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-center"
                  >
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 sm:mb-1">Gratis</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">Sin costo</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center"
                  >
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 sm:mb-1">Simple</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">Proceso fácil</div>
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
                  {/* Hero Image */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative rounded-2xl overflow-hidden shadow-2xl"
                  >
                    <img 
                      src={heroImage} 
                      alt="Parque memorial con familia, espacio de paz y memoria"
                      className="w-full h-auto object-cover"
                    />
                    
                    {/* Overlay Badge */}
                    <div className="absolute bottom-6 left-6 right-6 bg-card/95 backdrop-blur-sm border border-border rounded-xl p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                          <Heart className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <div className="font-semibold text-base">Espacios de Paz 🕊️</div>
                          <div className="text-sm text-muted-foreground">Para honrar memorias</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating Badge with Heart */}
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    className="absolute -top-4 -right-4 bg-accent text-accent-foreground rounded-full px-6 py-3 font-bold shadow-lg z-10 flex items-center gap-2"
                  >
                    <span>Verificado</span>
                    <motion.span
                      animate={{ 
                        scale: [1, 1.3, 1],
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      ❤️
                    </motion.span>
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
        <section className="py-8 sm:py-12 md:py-16 -mt-4 sm:-mt-6 md:-mt-8 relative z-10">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-card/80 backdrop-blur-sm shadow-large rounded-2xl p-2 border border-border/50">
                <SearchBar />
              </div>
            </motion.div>
          </div>
        </section>

        <FeaturedFunerarias />
        
        <Stats />
        <ComoFunciona />
        
        {/* Categories Section */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold"
              >
                Servicios y productos
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              >
                Todo lo que necesitas en un solo lugar, con transparencia y dignidad
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
        <PricingPlans />
        <PricingComparison />
        <ForFunerarias />
        <FAQ />
      </main>
      
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
