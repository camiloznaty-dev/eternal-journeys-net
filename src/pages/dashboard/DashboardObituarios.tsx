import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ObituarioDialog } from "@/components/dashboard/ObituarioDialog";

export default function DashboardObituarios() {
  const [obituarios, setObituarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingObituario, setEditingObituario] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { fetchObituarios(); }, []);

  const fetchObituarios = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: empleado } = await supabase.from("empleados").select("funeraria_id").eq("user_id", session.user.id).single();
      if (!empleado) return;
      const { data, error } = await supabase.from("obituarios").select("*").eq("funeraria_id", empleado.funeraria_id).order("created_at", { ascending: false });
      if (error) throw error;
      setObituarios(data || []);
    } catch (error: any) {
      toast.error("Error al cargar obituarios");
    } finally {
      setLoading(false);
    }
  };

  const filteredObituarios = obituarios.filter((o) => o.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Obituarios</h1><p className="text-muted-foreground">Gestiona obituarios</p></div>
          <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Nuevo Obituario</Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        {loading ? <Card className="p-6"><div className="h-32 bg-muted rounded animate-pulse" /></Card> : filteredObituarios.length === 0 ? (
          <Card className="p-12 text-center"><h3 className="text-lg font-semibold mb-2">No hay obituarios</h3><Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Agregar</Button></Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {filteredObituarios.map((o) => (
              <Card key={o.id} className="cursor-pointer" onClick={() => { setEditingObituario(o); setDialogOpen(true); }}>
                <CardHeader><CardTitle>{o.name}</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">{new Date(o.birth_date).toLocaleDateString("es-CL")} - {new Date(o.death_date).toLocaleDateString("es-CL")}</p></CardContent>
                <CardFooter>{o.is_premium && <Badge>Premium</Badge>}</CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      <ObituarioDialog open={dialogOpen} onOpenChange={setDialogOpen} obituario={editingObituario} onSuccess={fetchObituarios} />
    </DashboardLayout>
  );
}
