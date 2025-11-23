import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Bell, Shield, Palette, Save } from "lucide-react";

export default function Configuracion() {
  const [loading, setLoading] = useState(false);
  const [notificaciones, setNotificaciones] = useState({
    nuevoLead: true,
    recordatorios: true,
    actualizaciones: false,
  });

  const handleSaveNotifications = () => {
    setLoading(true);
    // Simular guardado (aquí podrías guardar en localStorage o base de datos)
    setTimeout(() => {
      localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
      toast.success("Configuración de notificaciones guardada");
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    // Cargar preferencias guardadas
    const saved = localStorage.getItem('notificaciones');
    if (saved) {
      setNotificaciones(JSON.parse(saved));
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">Administra las preferencias de tu cuenta</p>
        </div>

        {/* Notificaciones */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-accent" />
              <div>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>Configura cómo quieres recibir notificaciones</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificar nuevos leads</Label>
                <p className="text-sm text-muted-foreground">
                  Recibe alertas cuando llegue un nuevo contacto
                </p>
              </div>
              <Switch
                checked={notificaciones.nuevoLead}
                onCheckedChange={(checked) =>
                  setNotificaciones({ ...notificaciones, nuevoLead: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Recordatorios de tareas</Label>
                <p className="text-sm text-muted-foreground">
                  Alertas sobre tareas pendientes y próximas ceremonias
                </p>
              </div>
              <Switch
                checked={notificaciones.recordatorios}
                onCheckedChange={(checked) =>
                  setNotificaciones({ ...notificaciones, recordatorios: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Actualizaciones del sistema</Label>
                <p className="text-sm text-muted-foreground">
                  Información sobre nuevas funcionalidades
                </p>
              </div>
              <Switch
                checked={notificaciones.actualizaciones}
                onCheckedChange={(checked) =>
                  setNotificaciones({ ...notificaciones, actualizaciones: checked })
                }
              />
            </div>

            <Button onClick={handleSaveNotifications} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Preferencias
            </Button>
          </CardContent>
        </Card>

        {/* Apariencia */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-accent" />
              <div>
                <CardTitle>Apariencia</CardTitle>
                <CardDescription>Personaliza la interfaz del dashboard</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <p className="text-sm text-muted-foreground">
                Cambia entre modo diurno y nocturno desde el botón en la barra de navegación superior
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Seguridad */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              <div>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>Gestiona la seguridad de tu cuenta</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cambiar contraseña</Label>
              <p className="text-sm text-muted-foreground">
                Para cambiar tu contraseña, cierra sesión y utiliza "Olvidé mi contraseña" en la página de inicio de sesión
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
