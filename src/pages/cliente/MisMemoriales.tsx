import { ClienteDashboardLayout } from "@/components/dashboard/ClienteDashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Plus, Calendar, Eye } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function MisMemoriales() {
  const [searchParams] = useSearchParams();
  const isDemoMode = searchParams.get("demo") === "true";
  const [memoriales, setMemoriales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      // Demo data
      setMemoriales([
        {
          id: "demo-1",
          nombre_ser_querido: "María González",
          relacion: "Abuela",
          fecha_fallecimiento: "2024-01-15",
          foto_principal: null,
        },
        {
          id: "demo-2",
          nombre_ser_querido: "Carlos Pérez",
          relacion: "Tío",
          fecha_fallecimiento: "2023-11-20",
          foto_principal: null,
        },
      ]);
      setLoading(false);
    } else {
      fetchMemoriales();
    }
  }, [isDemoMode]);

  const fetchMemoriales = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("memoriales")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMemoriales(data || []);
    } catch (error) {
      console.error("Error fetching memoriales:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClienteDashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Mis Memoriales</h1>
            <p className="text-muted-foreground">Espacios digitales para honrar a tus seres queridos</p>
          </div>
          <Button asChild>
            <Link to="/asistencia">
              <Plus className="mr-2 h-4 w-4" />
              Crear Memorial
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : memoriales.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No hay memoriales aún</h3>
              <p className="text-muted-foreground mb-4">
                Crea tu primer memorial digital para honrar a un ser querido
              </p>
              <Button asChild>
                <Link to="/asistencia">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primer Memorial
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {memoriales.map((memorial) => (
              <Card key={memorial.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                      <Heart className="h-8 w-8 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{memorial.nombre_ser_querido}</h3>
                      <p className="text-sm text-muted-foreground">{memorial.relacion}</p>
                    </div>
                  </div>
                  
                  {memorial.fecha_fallecimiento && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Calendar className="h-4 w-4" />
                      {new Date(memorial.fecha_fallecimiento).toLocaleDateString("es-CL")}
                    </div>
                  )}

                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/memorial/${memorial.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Memorial
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ClienteDashboardLayout>
  );
}
