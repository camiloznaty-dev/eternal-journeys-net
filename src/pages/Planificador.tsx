import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Calendar, Calculator, FileText, Download, Save } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const Planificador = () => {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const tramitesTasks = [
    { id: "cert-defuncion", title: "Obtener certificado de defunción", category: "Documentos" },
    { id: "registro-civil", title: "Inscribir defunción en Registro Civil", category: "Documentos" },
    { id: "notificar-banco", title: "Notificar a instituciones bancarias", category: "Financiero" },
    { id: "cancelar-servicios", title: "Cancelar servicios (luz, agua, internet)", category: "Administrativo" },
    { id: "pensiones", title: "Tramitar pensión de sobrevivencia", category: "Financiero" },
    { id: "testamento", title: "Revisar testamento y herencia", category: "Legal" },
    { id: "seguros", title: "Reclamar seguros de vida", category: "Financiero" },
    { id: "propiedad", title: "Transferencia de propiedades", category: "Legal" },
  ];

  const servicios = [
    { nombre: "Ataúd básico", precio: 150000 },
    { nombre: "Ataúd intermedio", precio: 350000 },
    { nombre: "Ataúd premium", precio: 800000 },
    { nombre: "Cremación", precio: 250000 },
    { nombre: "Sala velatorio", precio: 180000 },
    { nombre: "Flores", precio: 50000 },
    { nombre: "Música", precio: 30000 },
    { nombre: "Ceremonia", precio: 120000 },
    { nombre: "Traslado", precio: 80000 },
  ];

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (serviceName: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceName)
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const totalCost = servicios
    .filter(s => selectedServices.includes(s.nombre))
    .reduce((sum, s) => sum + s.precio, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Planificador para Familias 📋
            </h1>
            <p className="text-lg text-muted-foreground">
              Organiza todo lo necesario en un solo lugar. Planifica con anticipación o gestiona trámites post-funeral.
            </p>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="planificador" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="planificador" className="gap-2">
                <Calendar className="w-4 h-4" />
                Planificador
              </TabsTrigger>
              <TabsTrigger value="tramites" className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Trámites
              </TabsTrigger>
              <TabsTrigger value="calculadora" className="gap-2">
                <Calculator className="w-4 h-4" />
                Calculadora
              </TabsTrigger>
            </TabsList>

            {/* Planificador Anticipado */}
            <TabsContent value="planificador">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-accent" />
                    Preferencias y Deseos
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tipo de Ceremonia</label>
                        <select className="w-full p-3 rounded-lg border border-border bg-muted">
                          <option>Seleccionar...</option>
                          <option>Ceremonia religiosa</option>
                          <option>Ceremonia laica</option>
                          <option>Ceremonia íntima</option>
                          <option>Sin ceremonia</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Preferencia Final</label>
                        <select className="w-full p-3 rounded-lg border border-border bg-muted">
                          <option>Seleccionar...</option>
                          <option>Entierro tradicional</option>
                          <option>Cremación</option>
                          <option>Cremación con cenizas al mar</option>
                          <option>Mausoleo familiar</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Música Preferida</label>
                        <input 
                          type="text" 
                          placeholder="Ej: Ave María, música clásica..."
                          className="w-full p-3 rounded-lg border border-border bg-muted"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Flores Preferidas</label>
                        <input 
                          type="text" 
                          placeholder="Ej: Rosas blancas, lirios..."
                          className="w-full p-3 rounded-lg border border-border bg-muted"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Vestimenta</label>
                        <input 
                          type="text" 
                          placeholder="Ej: Traje azul, vestido favorito..."
                          className="w-full p-3 rounded-lg border border-border bg-muted"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Notas Adicionales</label>
                        <textarea 
                          rows={3}
                          placeholder="Cualquier otro deseo o preferencia especial..."
                          className="w-full p-3 rounded-lg border border-border bg-muted"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button className="gap-2">
                      <Save className="w-4 h-4" />
                      Guardar Preferencias
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      Descargar PDF
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Documentos Importantes 📄</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span>Testamento</span>
                      <Button variant="outline" size="sm">Subir</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span>Póliza de Seguro</span>
                      <Button variant="outline" size="sm">Subir</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span>Documentos de Propiedad</span>
                      <Button variant="outline" size="sm">Subir</Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Checklist de Trámites */}
            <TabsContent value="tramites">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-accent" />
                      Checklist de Trámites Post-Funeral
                    </h2>
                    <div className="text-sm text-muted-foreground">
                      {completedTasks.length} de {tramitesTasks.length} completados
                    </div>
                  </div>

                  <div className="space-y-2">
                    {tramitesTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
                        onClick={() => toggleTask(task.id)}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          completedTasks.includes(task.id) 
                            ? 'bg-accent border-accent' 
                            : 'border-muted-foreground'
                        }`}>
                          {completedTasks.includes(task.id) && (
                            <CheckCircle2 className="w-4 h-4 text-accent-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className={completedTasks.includes(task.id) ? 'line-through text-muted-foreground' : ''}>
                            {task.title}
                          </div>
                          <div className="text-xs text-muted-foreground">{task.category}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <p className="text-sm text-muted-foreground">
                      💡 <strong>Consejo:</strong> Algunos trámites tienen plazos legales. Consulta con un asesor si tienes dudas.
                    </p>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Calculadora de Costos */}
            <TabsContent value="calculadora">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 gap-6"
              >
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Calculator className="w-6 h-6 text-accent" />
                    Selecciona Servicios
                  </h2>
                  
                  <div className="space-y-2">
                    {servicios.map((servicio) => (
                      <motion.div
                        key={servicio.nombre}
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
                        onClick={() => toggleService(servicio.nombre)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            selectedServices.includes(servicio.nombre)
                              ? 'bg-accent border-accent'
                              : 'border-muted-foreground'
                          }`}>
                            {selectedServices.includes(servicio.nombre) && (
                              <CheckCircle2 className="w-4 h-4 text-accent-foreground" />
                            )}
                          </div>
                          <span>{servicio.nombre}</span>
                        </div>
                        <span className="font-semibold">
                          ${servicio.precio.toLocaleString('es-CL')}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                <div className="space-y-6">
                  <Card className="p-6 sticky top-6">
                    <h3 className="text-xl font-bold mb-4">Resumen de Costos 💰</h3>
                    
                    <div className="space-y-3 mb-6">
                      {selectedServices.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          Selecciona servicios para ver el resumen
                        </p>
                      ) : (
                        selectedServices.map(serviceName => {
                          const servicio = servicios.find(s => s.nombre === serviceName);
                          return (
                            <div key={serviceName} className="flex justify-between text-sm">
                              <span>{serviceName}</span>
                              <span>${servicio?.precio.toLocaleString('es-CL')}</span>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {selectedServices.length > 0 && (
                      <>
                        <div className="border-t border-border pt-4 mb-4">
                          <div className="flex justify-between items-center text-2xl font-bold">
                            <span>Total:</span>
                            <span className="text-accent">
                              ${totalCost.toLocaleString('es-CL')} CLP
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <p>• IVA incluido</p>
                          <p>• Precios referenciales</p>
                          <p>• Consulta con funerarias para cotización exacta</p>
                        </div>

                        <Button className="w-full gap-2">
                          <Download className="w-4 h-4" />
                          Descargar Cotización
                        </Button>
                      </>
                    )}
                  </Card>

                  <Card className="p-6">
                    <h4 className="font-bold mb-3">Opciones de Financiamiento 💳</h4>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 rounded bg-muted/50">
                        <div className="font-medium">3 cuotas sin interés</div>
                        <div className="text-muted-foreground">
                          ${(totalCost / 3).toLocaleString('es-CL')} CLP/mes
                        </div>
                      </div>
                      <div className="p-3 rounded bg-muted/50">
                        <div className="font-medium">6 cuotas</div>
                        <div className="text-muted-foreground">
                          ${(totalCost / 6).toLocaleString('es-CL')} CLP/mes
                        </div>
                      </div>
                      <div className="p-3 rounded bg-muted/50">
                        <div className="font-medium">12 cuotas</div>
                        <div className="text-muted-foreground">
                          ${(totalCost / 12).toLocaleString('es-CL')} CLP/mes
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Planificador;
