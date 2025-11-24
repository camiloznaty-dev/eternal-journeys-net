import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart, Music, Flower2, Users, BookOpen, Camera, MessageCircle, Download, Save, Calendar } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { AnimatedHero } from "@/components/AnimatedHero";
import heroImage from "@/assets/hero-planificador.jpg";

const Planificador = () => {
  const [formData, setFormData] = useState({
    // Información Personal
    nombreCompleto: "",
    rut: "",
    fechaNacimiento: "",
    ciudad: "",
    region: "",
    
    // Preferencia Principal
    tipoServicio: "",
    
    // Sepultura Tradicional
    cementerio: "",
    tipoTumba: "",
    
    // Cremación
    destinoCenizas: "",
    urna: "",
    
    // Ceremonia
    tipoCeremonia: "",
    lugarCeremonia: "",
    
    // Servicios Adicionales
    velorio: "",
    flores: "",
    musica: "",
    
    // Presupuesto
    presupuestoEstimado: "",
    
    // Contacto Familiar
    nombreContacto: "",
    telefonoContacto: "",
    emailContacto: "",
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
      
      <AnimatedHero
        title="Planificador Funeral"
        subtitle="Planifica con Anticipación"
        description="Organiza y planifica tu servicio funeral. Define preferencias concretas y facilita la toma de decisiones para tu familia."
        icon={<Calendar className="w-10 h-10" />}
        backgroundImage={heroImage}
      />
      
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Información Personal */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Información Personal</h2>
                  <p className="text-sm text-muted-foreground">Datos básicos del planificador</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombreCompleto">Nombre Completo</Label>
                  <Input
                    id="nombreCompleto"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    placeholder="Nombre completo"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="rut">RUT</Label>
                  <Input
                    id="rut"
                    name="rut"
                    value={formData.rut}
                    onChange={handleChange}
                    placeholder="12.345.678-9"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                  <Input
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input
                    id="ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    placeholder="Santiago"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="region">Región</Label>
                  <select
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full mt-2 p-3 rounded-lg border border-border bg-background"
                  >
                    <option value="">Seleccionar región...</option>
                    <option value="metropolitana">Región Metropolitana</option>
                    <option value="valparaiso">Valparaíso</option>
                    <option value="biobio">Biobío</option>
                    <option value="araucania">La Araucanía</option>
                    <option value="maule">Maule</option>
                    <option value="los-lagos">Los Lagos</option>
                    <option value="coquimbo">Coquimbo</option>
                    <option value="ohiggins">O'Higgins</option>
                    <option value="antofagasta">Antofagasta</option>
                    <option value="los-rios">Los Ríos</option>
                    <option value="tarapaca">Tarapacá</option>
                    <option value="arica">Arica y Parinacota</option>
                    <option value="atacama">Atacama</option>
                    <option value="aysen">Aysén</option>
                    <option value="magallanes">Magallanes</option>
                    <option value="nuble">Ñuble</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Tipo de Servicio */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Preferencia Principal</h2>
                  <p className="text-sm text-muted-foreground">¿Sepultura o cremación?</p>
                </div>
              </div>

              <div>
                <Label htmlFor="tipoServicio">Selecciona tu preferencia</Label>
                <select
                  id="tipoServicio"
                  name="tipoServicio"
                  value={formData.tipoServicio}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 rounded-lg border border-border bg-background text-base"
                >
                  <option value="">Seleccionar...</option>
                  <option value="sepultura">Sepultura Tradicional</option>
                  <option value="cremacion">Cremación</option>
                </select>
              </div>
            </Card>

            {/* Opciones de Sepultura */}
            {formData.tipoServicio === "sepultura" && (
              <Card className="p-6 border-primary/30">
                <h3 className="text-lg font-bold mb-4">Detalles de Sepultura</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cementerio">Cementerio preferido</Label>
                    <Input
                      id="cementerio"
                      name="cementerio"
                      value={formData.cementerio}
                      onChange={handleChange}
                      placeholder="Nombre del cementerio o ubicación"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tipoTumba">Tipo de tumba</Label>
                    <select
                      id="tipoTumba"
                      name="tipoTumba"
                      value={formData.tipoTumba}
                      onChange={handleChange}
                      className="w-full mt-2 p-3 rounded-lg border border-border bg-background"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="nicho">Nicho</option>
                      <option value="tumba-tierra">Tumba en tierra</option>
                      <option value="mausoleo">Mausoleo familiar</option>
                      <option value="cripta">Cripta</option>
                    </select>
                  </div>
                </div>
              </Card>
            )}

            {/* Opciones de Cremación */}
            {formData.tipoServicio === "cremacion" && (
              <Card className="p-6 border-primary/30">
                <h3 className="text-lg font-bold mb-4">Detalles de Cremación</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="destinoCenizas">Destino de las cenizas</Label>
                    <select
                      id="destinoCenizas"
                      name="destinoCenizas"
                      value={formData.destinoCenizas}
                      onChange={handleChange}
                      className="w-full mt-2 p-3 rounded-lg border border-border bg-background"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="urna-familia">Urna entregada a la familia</option>
                      <option value="nicho">Nicho en cementerio</option>
                      <option value="esparcir-mar">Esparcir en el mar</option>
                      <option value="esparcir-montana">Esparcir en la montaña</option>
                      <option value="esparcir-jardin">Esparcir en jardín memorial</option>
                      <option value="otro">Otro lugar específico</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="urna">Tipo de urna</Label>
                    <select
                      id="urna"
                      name="urna"
                      value={formData.urna}
                      onChange={handleChange}
                      className="w-full mt-2 p-3 rounded-lg border border-border bg-background"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="madera">Urna de madera</option>
                      <option value="metal">Urna de metal</option>
                      <option value="ceramica">Urna de cerámica</option>
                      <option value="biodegradable">Urna biodegradable</option>
                      <option value="personalizada">Urna personalizada</option>
                    </select>
                  </div>
                </div>
              </Card>
            )}

            {/* Ceremonia */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Ceremonia</h2>
                  <p className="text-sm text-muted-foreground">Preferencias para la ceremonia</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="tipoCeremonia">Tipo de ceremonia</Label>
                  <select
                    id="tipoCeremonia"
                    name="tipoCeremonia"
                    value={formData.tipoCeremonia}
                    onChange={handleChange}
                    className="w-full mt-2 p-3 rounded-lg border border-border bg-background"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="catolica">Ceremonia católica</option>
                    <option value="evangelica">Ceremonia evangélica</option>
                    <option value="otra-religion">Otra religión</option>
                    <option value="laica">Ceremonia laica</option>
                    <option value="sin-ceremonia">Sin ceremonia</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="lugarCeremonia">Lugar de la ceremonia</Label>
                  <Input
                    id="lugarCeremonia"
                    name="lugarCeremonia"
                    value={formData.lugarCeremonia}
                    onChange={handleChange}
                    placeholder="Ej: Iglesia San Francisco, capilla del cementerio..."
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>

            {/* Servicios Adicionales */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Flower2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Servicios Adicionales</h2>
                  <p className="text-sm text-muted-foreground">Opciones complementarias</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="velorio">Velorio</Label>
                  <select
                    id="velorio"
                    name="velorio"
                    value={formData.velorio}
                    onChange={handleChange}
                    className="w-full mt-2 p-3 rounded-lg border border-border bg-background"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="sala-funeraria">En sala de funeraria</option>
                    <option value="hogar">En el hogar</option>
                    <option value="sin-velorio">Sin velorio</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="flores">Preferencia de flores</Label>
                  <Input
                    id="flores"
                    name="flores"
                    value={formData.flores}
                    onChange={handleChange}
                    placeholder="Ej: Rosas blancas, o sin flores"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="musica">Música para la ceremonia</Label>
                  <Input
                    id="musica"
                    name="musica"
                    value={formData.musica}
                    onChange={handleChange}
                    placeholder="Ej: Música clásica, Ave María..."
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>

            {/* Presupuesto */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Presupuesto</h2>
                  <p className="text-sm text-muted-foreground">Rango de presupuesto estimado</p>
                </div>
              </div>

              <div>
                <Label htmlFor="presupuestoEstimado">Presupuesto aproximado</Label>
                <select
                  id="presupuestoEstimado"
                  name="presupuestoEstimado"
                  value={formData.presupuestoEstimado}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 rounded-lg border border-border bg-background"
                >
                  <option value="">Seleccionar...</option>
                  <option value="500-1000">$500.000 - $1.000.000</option>
                  <option value="1000-2000">$1.000.000 - $2.000.000</option>
                  <option value="2000-3000">$2.000.000 - $3.000.000</option>
                  <option value="3000+">Más de $3.000.000</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </Card>

            {/* Contacto Familiar */}
            <Card className="p-6 bg-muted/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Contacto Familiar</h2>
                  <p className="text-sm text-muted-foreground">Persona de contacto principal</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombreContacto">Nombre del contacto</Label>
                  <Input
                    id="nombreContacto"
                    name="nombreContacto"
                    value={formData.nombreContacto}
                    onChange={handleChange}
                    placeholder="Nombre completo"
                    className="mt-2"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefonoContacto">Teléfono</Label>
                    <Input
                      id="telefonoContacto"
                      name="telefonoContacto"
                      type="tel"
                      value={formData.telefonoContacto}
                      onChange={handleChange}
                      placeholder="+56 9 1234 5678"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="emailContacto">Email</Label>
                    <Input
                      id="emailContacto"
                      name="emailContacto"
                      type="email"
                      value={formData.emailContacto}
                      onChange={handleChange}
                      placeholder="email@ejemplo.com"
                      className="mt-2"
                    />
                  </div>
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

            {/* Nota informativa */}
            <Card className="p-4 bg-muted/30 border-primary/20">
              <p className="text-sm text-muted-foreground text-center">
                Esta planificación facilita a tu familia la toma de decisiones. Puedes actualizar esta información en cualquier momento.
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
