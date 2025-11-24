import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, BookOpen, Heart, Lightbulb, Plus } from "lucide-react";
import { format, differenceInWeeks } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

const DiarioDuelo = () => {
  const { memorialId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState({
    titulo: "",
    contenido: "",
    estado_emocional: "",
    prompt_id: "",
  });

  const { data: memorial } = useQuery({
    queryKey: ["memorial", memorialId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("memoriales")
        .select("*")
        .eq("id", memorialId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const weeksSince = memorial?.fecha_fallecimiento
    ? differenceInWeeks(new Date(), new Date(memorial.fecha_fallecimiento))
    : 0;

  const { data: prompts } = useQuery({
    queryKey: ["prompts", weeksSince],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prompts_duelo")
        .select("*")
        .lte("semana", Math.max(weeksSince, 1))
        .eq("activo", true)
        .order("semana", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const { data: entradas } = useQuery({
    queryKey: ["diario", memorialId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("diario_duelo")
        .select("*")
        .eq("memorial_id", memorialId)
        .order("fecha", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createEntry = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      const { error } = await supabase.from("diario_duelo").insert({
        user_id: user.id,
        memorial_id: memorialId,
        ...newEntry,
        prompt_id: newEntry.prompt_id || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diario", memorialId] });
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(`/asistencia/memorial/${memorialId}`)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Memorial
          </Button>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Diario de Duelo - {memorial?.nombre_ser_querido}
              </CardTitle>
              <CardDescription>
                {weeksSince > 0
                  ? `Han pasado ${weeksSince} semana${weeksSince !== 1 ? 's' : ''} desde su partida`
                  : "Tu espacio personal para reflexionar"}
              </CardDescription>
            </CardHeader>
          </Card>

          {prompts && prompts.length > 0 && (
            <Card className="mb-8 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Reflexiones Guiadas
                </CardTitle>
                <CardDescription>
                  Preguntas adaptadas a tu proceso de duelo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {prompts.map((prompt) => (
                  <Card
                    key={prompt.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setIsWriting(true);
                      setNewEntry({
                        ...newEntry,
                        prompt_id: prompt.id,
                        titulo: prompt.pregunta.replace("[nombre]", memorial?.nombre_ser_querido || ""),
                      });
                    }}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="font-medium mb-1">
                            {prompt.pregunta.replace("[nombre]", memorial?.nombre_ser_querido || "")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {prompt.descripcion}
                          </p>
                        </div>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">
                          {prompt.etapa}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}

          {!isWriting ? (
            <Button onClick={() => setIsWriting(true)} className="mb-8 w-full">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Entrada Libre
            </Button>
          ) : (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Nueva Entrada</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="titulo">Título (opcional)</Label>
                    <Input
                      id="titulo"
                      value={newEntry.titulo}
                      onChange={(e) =>
                        setNewEntry({ ...newEntry, titulo: e.target.value })
                      }
                      placeholder="Dale un título a esta reflexión"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contenido">¿Qué quieres compartir hoy? *</Label>
                    <Textarea
                      id="contenido"
                      required
                      value={newEntry.contenido}
                      onChange={(e) =>
                        setNewEntry({ ...newEntry, contenido: e.target.value })
                      }
                      placeholder="Escribe tus pensamientos, sentimientos, recuerdos..."
                      rows={8}
                    />
                  </div>

                  <div>
                    <Label htmlFor="estado">¿Cómo te sientes?</Label>
                    <Select
                      value={newEntry.estado_emocional}
                      onValueChange={(value) =>
                        setNewEntry({ ...newEntry, estado_emocional: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu estado emocional" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en_paz">En paz</SelectItem>
                        <SelectItem value="nostalgico">Nostálgico/a</SelectItem>
                        <SelectItem value="triste">Triste</SelectItem>
                        <SelectItem value="enojado">Enojado/a</SelectItem>
                        <SelectItem value="confundido">Confundido/a</SelectItem>
                        <SelectItem value="agradecido">Agradecido/a</SelectItem>
                        <SelectItem value="esperanzado">Esperanzado/a</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-4">
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
                    <Button type="submit" disabled={createEntry.isPending} className="flex-1">
                      {createEntry.isPending ? "Guardando..." : "Guardar Entrada"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Mis Entradas</h2>
            {entradas && entradas.length > 0 ? (
              entradas.map((entrada) => (
                <Card key={entrada.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {entrada.titulo && (
                          <CardTitle className="text-lg mb-2">{entrada.titulo}</CardTitle>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{format(new Date(entrada.fecha), "d 'de' MMMM, yyyy", { locale: es })}</span>
                          {entrada.estado_emocional && (
                            <>
                              <span>•</span>
                              <span className="capitalize">{entrada.estado_emocional.replace("_", " ")}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-muted-foreground">
                      {entrada.contenido}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Aún no has escrito ninguna entrada en tu diario
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DiarioDuelo;
