import { useState, useEffect } from "react";
import { ClienteDashboardLayout } from "@/components/dashboard/ClienteDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, BookOpen, MessageSquare, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function MiCuenta() {
  const [searchParams] = useSearchParams();
  const isDemoMode = searchParams.get("demo") === "true";
  
  const [stats, setStats] = useState({
    memoriales: 0,
    entradas_diario: 0,
    consultas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      // Demo data
      setStats({
        memoriales: 2,
        entradas_diario: 15,
        consultas: 3,
      });
      setLoading(false);
    } else {
      fetchStats();
    }
  }, [isDemoMode]);

  const fetchStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [memorialesRes, diarioRes, consultasRes] = await Promise.all([
        supabase.from("memoriales").select("id", { count: "exact" }).eq("user_id", session.user.id),
        supabase.from("diario_duelo").select("id", { count: "exact" }).eq("user_id", session.user.id),
        supabase.from("consultas_sepulturas").select("id", { count: "exact" }).eq("email", session.user.email),
      ]);

      setStats({
        memoriales: memorialesRes.count || 0,
        entradas_diario: diarioRes.count || 0,
        consultas: consultasRes.count || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Mis Memoriales",
      value: stats.memoriales,
      description: "Memoriales digitales creados",
      icon: Heart,
      link: "/mi-cuenta/memoriales",
    },
    {
      title: "Entradas de Diario",
      value: stats.entradas_diario,
      description: "Reflexiones escritas",
      icon: BookOpen,
      link: "/mi-cuenta/diario",
    },
    {
      title: "Mis Consultas",
      value: stats.consultas,
      description: "Consultas realizadas",
      icon: MessageSquare,
      link: "/mi-cuenta/consultas",
    },
  ];

  return (
    <ClienteDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mi Cuenta</h1>
          <p className="text-muted-foreground">
            Bienvenido a tu espacio personal. Aquí puedes gestionar tus memoriales y tu proceso de duelo.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-muted rounded w-20" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {statsCards.map((stat) => (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mb-4">
                    {stat.description}
                  </p>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to={stat.link}>Ver más</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Accesos Rápidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/asistencia">
                    <Heart className="mr-2 h-4 w-4" />
                    Crear Nuevo Memorial
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/diario-duelo">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Escribir en mi Diario
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/vende-sepultura">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Consultar Sepulturas
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recursos de Apoyo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
                  <h3 className="font-semibold mb-2">Guía de Duelo</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Recursos y consejos para tu proceso de duelo
                  </p>
                  <Button variant="link" className="p-0 h-auto">
                    Leer más →
                  </Button>
                </div>
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
                  <h3 className="font-semibold mb-2">Comunidad de Apoyo</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Conéctate con otros en procesos similares
                  </p>
                  <Button variant="link" className="p-0 h-auto">
                    Explorar →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClienteDashboardLayout>
  );
}
