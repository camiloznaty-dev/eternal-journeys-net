import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClienteDashboardLayout } from "@/components/dashboard/ClienteDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Heart, Lightbulb, Plus } from "lucide-react";
import { format, differenceInWeeks } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export default function MiDiario() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState({
    titulo: "",
    contenido: "",
    estado_emocional: "",
    prompt_id: "",
  });

  // Get user session
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: prompts } = useQuery({
    queryKey: ["prompts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prompts_duelo")
        .select("*")
        .lte("semana", 4)
        .eq("activo", true)
        .order("semana", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const { data: entradas } = useQuery({
    queryKey: ["diario", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("diario_duelo")
        .select("*")
        .eq("user_id", session.user.id)
        .order("fecha", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const createEntry = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      const { error } = await supabase.from("diario_duelo").insert({
        user_id: user.id,
        memorial_id: null,
        ...newEntry,
        prompt_id: newEntry.prompt_id || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diario", session?.user?.id] });
      setNewEntry({ titulo: "", contenido: "", estado_emocional: "", prompt_id: "" });
      setIsWriting(false);
      toast.success("Entrada guardada exitosamente");
    },
    onError: () => {
      toast.error("Error al guardar la entrada");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEntry.mutate();
  };

  return (
    <ClienteDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Mi Diario de Duelo
          </h1>
          <p className="text-muted-foreground">
            Tu espacio personal para reflexionar sobre tu proceso de duelo
          </p>
        </div>

        {prompts && prompts.length > 0 && (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-primary" />
                Reflexiones Guiadas
              </CardTitle>
              <CardDescription>
                Preguntas para ayudarte en tu proceso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {prompts.map((prompt) => (
                <Card
                  key={prompt.id}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => {
                    setNewEntry({ ...newEntry, prompt_id: prompt.id });
                    setIsWriting(true);
                  }}
                >
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium">{prompt.pregunta}</p>
                    {prompt.descripcion && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {prompt.descripcion}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        {!isWriting ? (
          <Button onClick={() => setIsWriting(true)} size="lg" className="w-full">
            <Plus className="mr-2 h-5 w-5" />
            Nueva Entrada
          </Button>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Nueva Entrada</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título (opcional)</Label>
                  <Input
                    id="titulo"
                    value={newEntry.titulo}
                    onChange={(e) => setNewEntry({ ...newEntry, titulo: e.target.value })}
                    placeholder="Dale un título a tu reflexión"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contenido">¿Qué quieres escribir hoy?</Label>
                  <Textarea
                    id="contenido"
                    value={newEntry.contenido}
                    onChange={(e) => setNewEntry({ ...newEntry, contenido: e.target.value })}
                    placeholder="Escribe tus pensamientos y sentimientos..."
                    className="min-h-[200px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">¿Cómo te sientes hoy?</Label>
                  <Select
                    value={newEntry.estado_emocional}
                    onValueChange={(value) => setNewEntry({ ...newEntry, estado_emocional: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu estado emocional" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paz">En paz</SelectItem>
                      <SelectItem value="nostalgia">Nostálgico/a</SelectItem>
                      <SelectItem value="tristeza">Triste</SelectItem>
                      <SelectItem value="enojo">Enojado/a</SelectItem>
                      <SelectItem value="confusion">Confundido/a</SelectItem>
                      <SelectItem value="esperanza">Esperanzado/a</SelectItem>
                      <SelectItem value="agradecimiento">Agradecido/a</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={createEntry.isPending} className="flex-1">
                    {createEntry.isPending ? "Guardando..." : "Guardar Entrada"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsWriting(false);
                      setNewEntry({ titulo: "", contenido: "", estado_emocional: "", prompt_id: "" });
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            Mis Entradas
          </h2>

          {!entradas || entradas.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No hay entradas aún</h3>
                <p className="text-muted-foreground mb-4">
                  Comienza a escribir tu primera reflexión
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {entradas.map((entrada) => (
                <Card key={entrada.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        {entrada.titulo && (
                          <CardTitle className="text-lg mb-1">{entrada.titulo}</CardTitle>
                        )}
                        <CardDescription>
                          {format(new Date(entrada.fecha), "PPP", { locale: es })}
                          {entrada.estado_emocional && (
                            <span className="ml-2 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {entrada.estado_emocional}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{entrada.contenido}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ClienteDashboardLayout>
  );
}
