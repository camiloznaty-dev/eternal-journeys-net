import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart, Music, Flower2, Users, BookOpen, Camera, MessageCircle, Download, Save } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Planificador = () => {
  const [formData, setFormData] = useState({
    // Ceremonia
    tipoCeremonia: "",
    lugarCeremonia: "",
    atmosfera: "",
    
    // Música
    cancionesFavoritas: "",
    musicaAmbiente: "",
    
    // Flores y decoración
    floresPreferidas: "",
    colores: "",
    
    // Personas importantes
    personasInvitar: "",
    personaHablar: "",
    
    // Legado
    mensajeDespedida: "",
    valoresCompartir: "",
    historiaContar: "",
    
    // Recuerdos
    fotosCompartir: "",
    objetosSignificativos: "",
    
    // Preferencia final
    preferenciaFinal: "",
    lugarDescanso: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = () => {
    toast.success("Tus preferencias han sido guardadas");
  };

  const handleDownload = () => {
    toast.success("Descargando tu planificación...");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Mi Despedida Ideal
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comparte tus deseos, preferencias y cómo quieres ser recordado. 
              Este es un espacio para expresar lo que realmente importa.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* La Ceremonia */}
            <Card className="p-8 border-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">La Ceremonia</h2>
                  <p className="text-sm text-muted-foreground">¿Cómo te gustaría que fuera?</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="tipoCeremonia">Tipo de ceremonia que prefiero</Label>
                  <select
                    id="tipoCeremonia"
                    name="tipoCeremonia"
                    value={formData.tipoCeremonia}
                    onChange={handleChange}
                    className="w-full mt-2 p-3 rounded-lg border border-border bg-background"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="religiosa">Ceremonia religiosa</option>
                    <option value="laica">Ceremonia laica o humanista</option>
                    <option value="intima">Ceremonia íntima con familia cercana</option>
                    <option value="celebracion">Celebración de vida</option>
                    <option value="sin">Prefiero algo muy simple, sin ceremonia</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="lugarCeremonia">Lugar especial (opcional)</Label>
                  <Input
                    id="lugarCeremonia"
                    name="lugarCeremonia"
                    value={formData.lugarCeremonia}
                    onChange={handleChange}
                    placeholder="Ej: En el jardín de mi casa, junto al mar, en la iglesia..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="atmosfera">¿Qué atmósfera te gustaría?</Label>
                  <Textarea
                    id="atmosfera"
                    name="atmosfera"
                    value={formData.atmosfera}
                    onChange={handleChange}
                    placeholder="Describe cómo te imaginas el ambiente: solemne, alegre, reflexivo, con naturaleza..."
                    rows={3}
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>

            {/* Música y Sonidos */}
            <Card className="p-8 border-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Music className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Música y Sonidos</h2>
                  <p className="text-sm text-muted-foreground">Las canciones que te acompañaron</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="cancionesFavoritas">Canciones que me representan</Label>
                  <Textarea
                    id="cancionesFavoritas"
                    name="cancionesFavoritas"
                    value={formData.cancionesFavoritas}
                    onChange={handleChange}
                    placeholder='Ej: "Imagine" de John Lennon, "What a Wonderful World" de Louis Armstrong...'
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="musicaAmbiente">Ambiente musical</Label>
                  <Input
                    id="musicaAmbiente"
                    name="musicaAmbiente"
                    value={formData.musicaAmbiente}
                    onChange={handleChange}
                    placeholder="Ej: Música clásica suave, jazz, música de mi tierra..."
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>

            {/* Flores y Colores */}
            <Card className="p-8 border-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Flower2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Flores y Colores</h2>
                  <p className="text-sm text-muted-foreground">Los colores y aromas que amas</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="floresPreferidas">Mis flores preferidas</Label>
                  <Input
                    id="floresPreferidas"
                    name="floresPreferidas"
                    value={formData.floresPreferidas}
                    onChange={handleChange}
                    placeholder="Ej: Rosas blancas, girasoles, lirios..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="colores">Colores que me gustan</Label>
                  <Input
                    id="colores"
                    name="colores"
                    value={formData.colores}
                    onChange={handleChange}
                    placeholder="Ej: Colores pasteles, tonos tierra, mi color favorito es..."
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>

            {/* Las Personas */}
            <Card className="p-8 border-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Las Personas</h2>
                  <p className="text-sm text-muted-foreground">Quiénes son importantes para ti</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="personasInvitar">Personas especiales que me gustaría que estuvieran</Label>
                  <Textarea
                    id="personasInvitar"
                    name="personasInvitar"
                    value={formData.personasInvitar}
                    onChange={handleChange}
                    placeholder="Puedes mencionar personas específicas, grupos o simplemente 'mi familia cercana'..."
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="personaHablar">¿Hay alguien especial que quisieras que hable o comparta algo?</Label>
                  <Input
                    id="personaHablar"
                    name="personaHablar"
                    value={formData.personaHablar}
                    onChange={handleChange}
                    placeholder="Ej: Mi mejor amigo, mi hermana..."
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>

            {/* Mi Legado */}
            <Card className="p-8 border-2 bg-primary/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Mi Legado</h2>
                  <p className="text-sm text-muted-foreground">Lo que quiero compartir y ser recordado</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="mensajeDespedida">Un mensaje de despedida</Label>
                  <Textarea
                    id="mensajeDespedida"
                    name="mensajeDespedida"
                    value={formData.mensajeDespedida}
                    onChange={handleChange}
                    placeholder="Unas palabras para quienes amo..."
                    rows={4}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="valoresCompartir">Valores que quiero transmitir</Label>
                  <Textarea
                    id="valoresCompartir"
                    name="valoresCompartir"
                    value={formData.valoresCompartir}
                    onChange={handleChange}
                    placeholder="Ej: La importancia de la familia, la bondad, vivir con pasión..."
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="historiaContar">Una historia o anécdota que me representa</Label>
                  <Textarea
                    id="historiaContar"
                    name="historiaContar"
                    value={formData.historiaContar}
                    onChange={handleChange}
                    placeholder="Un momento especial de mi vida que refleja quién fui..."
                    rows={4}
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>

            {/* Recuerdos */}
            <Card className="p-8 border-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Recuerdos Visuales</h2>
                  <p className="text-sm text-muted-foreground">Las imágenes que cuentan tu historia</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="fotosCompartir">Fotos que me gustaría compartir</Label>
                  <Textarea
                    id="fotosCompartir"
                    name="fotosCompartir"
                    value={formData.fotosCompartir}
                    onChange={handleChange}
                    placeholder="Describe qué tipo de fotos: con mi familia, viajando, en momentos felices..."
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="objetosSignificativos">Objetos que tienen significado especial</Label>
                  <Input
                    id="objetosSignificativos"
                    name="objetosSignificativos"
                    value={formData.objetosSignificativos}
                    onChange={handleChange}
                    placeholder="Ej: Un libro, una pintura, mi guitarra..."
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>

            {/* Preferencia Final */}
            <Card className="p-8 border-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Descanso Final</h2>
                  <p className="text-sm text-muted-foreground">Tus preferencias sobre el destino final</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="preferenciaFinal">Mi preferencia</Label>
                  <select
                    id="preferenciaFinal"
                    name="preferenciaFinal"
                    value={formData.preferenciaFinal}
                    onChange={handleChange}
                    className="w-full mt-2 p-3 rounded-lg border border-border bg-background"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="entierro">Entierro tradicional</option>
                    <option value="cremacion">Cremación</option>
                    <option value="cenizas-naturaleza">Cenizas esparcidas en la naturaleza</option>
                    <option value="cenizas-mar">Cenizas al mar</option>
                    <option value="mausoleo">Mausoleo o cripta familiar</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="lugarDescanso">Lugar especial (si lo hay)</Label>
                  <Input
                    id="lugarDescanso"
                    name="lugarDescanso"
                    value={formData.lugarDescanso}
                    onChange={handleChange}
                    placeholder="Ej: Junto a mis padres, en el cementerio de mi pueblo, en las montañas..."
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button size="lg" className="flex-1 gap-2" onClick={handleSave}>
                <Save className="w-5 h-5" />
                Guardar mis Preferencias
              </Button>
              <Button size="lg" variant="outline" className="flex-1 gap-2" onClick={handleDownload}>
                <Download className="w-5 h-5" />
                Descargar PDF
              </Button>
            </div>

            {/* Mensaje Final */}
            <Card className="p-6 bg-muted/30 border-primary/20 text-center">
              <p className="text-sm text-muted-foreground">
                Esta información es personal y privada. Puedes compartirla con tu familia cuando estés listo,
                o simplemente guardarla como una guía para que en el futuro tus seres queridos conozcan tus deseos.
              </p>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Planificador;
