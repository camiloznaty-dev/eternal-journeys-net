import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "Cómo planificar un servicio funerario con anticipación",
      excerpt: "Planificar un servicio funerario puede parecer difícil, pero hacerlo con anticipación alivia la carga emocional y financiera de tus seres queridos.",
      categoria: "Guías",
      autor: "Equipo Sirius",
      fecha: "15 de Marzo, 2024",
      tiempo: "5 min",
      imagen: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
    },
    {
      id: 2,
      title: "Diferencias entre cremación y sepultura tradicional",
      excerpt: "Entender las opciones disponibles es fundamental para tomar la mejor decisión. Exploramos las diferencias clave entre ambos servicios.",
      categoria: "Educación",
      autor: "Equipo Sirius",
      fecha: "10 de Marzo, 2024",
      tiempo: "7 min",
      imagen: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80"
    },
    {
      id: 3,
      title: "La importancia de los obituarios en el proceso de duelo",
      excerpt: "Los obituarios no solo informan sobre un fallecimiento, sino que también celebran la vida y ayudan en el proceso de sanación.",
      categoria: "Duelo",
      autor: "Equipo Sirius",
      fecha: "5 de Marzo, 2024",
      tiempo: "4 min",
      imagen: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80"
    },
    {
      id: 4,
      title: "Cómo comparar precios de servicios funerarios",
      excerpt: "Una guía práctica para entender los costos asociados con servicios funerarios y cómo tomar decisiones informadas.",
      categoria: "Guías",
      autor: "Equipo Sirius",
      fecha: "1 de Marzo, 2024",
      tiempo: "6 min",
      imagen: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80"
    },
    {
      id: 5,
      title: "Tendencias modernas en servicios funerarios",
      excerpt: "La industria funeraria está evolucionando. Descubre las nuevas tendencias que están transformando los servicios tradicionales.",
      categoria: "Tendencias",
      autor: "Equipo Sirius",
      fecha: "25 de Febrero, 2024",
      tiempo: "8 min",
      imagen: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80"
    },
    {
      id: 6,
      title: "Guía completa sobre documentación funeraria necesaria",
      excerpt: "Todo lo que necesitas saber sobre los documentos requeridos para organizar un servicio funerario en Chile.",
      categoria: "Guías",
      autor: "Equipo Sirius",
      fecha: "20 de Febrero, 2024",
      tiempo: "10 min",
      imagen: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80"
    }
  ];

  const categorias = ["Todas", "Guías", "Educación", "Duelo", "Tendencias"];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">Blog de Sirius</h1>
              <p className="text-xl text-muted-foreground">
                Información, guías y recursos para ayudarte en momentos difíciles.
              </p>
            </div>
          </div>
        </section>

        {/* Filtros */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {categorias.map((categoria) => (
                <Badge
                  key={categoria}
                  variant={categoria === "Todas" ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2"
                >
                  {categoria}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`}>
                  <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.imagen}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{post.categoria}</Badge>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{post.autor}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{post.fecha}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.tiempo}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
