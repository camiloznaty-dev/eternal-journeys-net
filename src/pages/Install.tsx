import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Smartphone, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8 sm:mb-12">
            <Download className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 text-primary" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Instala Sirius
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Accede más rápido a nuestros servicios instalando la app en tu dispositivo
            </p>
          </div>

          {isInstalled ? (
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Check className="w-8 h-8 text-primary" />
                  <div>
                    <CardTitle>¡App Instalada!</CardTitle>
                    <CardDescription>
                      Sirius ya está instalado en tu dispositivo
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ) : (
            <>
              {isInstallable && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 sm:mb-8"
                >
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">¡Instala Ahora!</CardTitle>
                      <CardDescription>
                        Tu navegador soporta la instalación directa
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={handleInstall} 
                        size="lg" 
                        className="w-full"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Instalar App
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Smartphone className="w-5 h-5" />
                      Beneficios de Instalar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm sm:text-base">Acceso Rápido</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Abre la app directamente desde tu pantalla de inicio</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm sm:text-base">Funciona Offline</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Consulta información guardada sin conexión a internet</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm sm:text-base">Experiencia Nativa</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Interfaz optimizada como una app instalada</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm sm:text-base">Sin Tiendas de Apps</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">No necesitas descargar desde App Store o Google Play</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {isIOS && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">Instrucciones para iOS</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm sm:text-base">
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Toca el botón <strong>Compartir</strong> en Safari</li>
                        <li>Desplázate y selecciona <strong>Agregar a pantalla de inicio</strong></li>
                        <li>Toca <strong>Agregar</strong> en la esquina superior derecha</li>
                      </ol>
                    </CardContent>
                  </Card>
                )}

                {isAndroid && !isInstallable && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">Instrucciones para Android</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm sm:text-base">
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Toca el menú (⋮) en tu navegador</li>
                        <li>Selecciona <strong>Agregar a pantalla de inicio</strong> o <strong>Instalar app</strong></li>
                        <li>Confirma la instalación</li>
                      </ol>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Install;
