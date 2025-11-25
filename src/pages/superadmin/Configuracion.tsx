import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/superadmin/SuperAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Mail, Bell, Shield, Globe } from "lucide-react";

export default function Configuracion() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Estado de configuración general
  const [generalConfig, setGeneralConfig] = useState({
    siteName: "ConectaFunerarias",
    siteDescription: "Marketplace de servicios funerarios en Chile",
    contactEmail: "contacto@conectafunerarias.cl",
    supportEmail: "soporte@conectafunerarias.cl",
    maintenanceMode: false,
  });

  // Estado de configuración de notificaciones
  const [notificationConfig, setNotificationConfig] = useState({
    emailNotifications: true,
    newFunerariaAlert: true,
    newLeadAlert: true,
    systemAlerts: true,
  });

  const handleSaveGeneral = async () => {
    setLoading(true);
    try {
      // Aquí iría la lógica para guardar en la base de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configuración guardada",
        description: "Los cambios se han guardado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      // Aquí iría la lógica para guardar en la base de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configuración guardada",
        description: "Las preferencias de notificaciones se han actualizado.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Configuración del Sistema
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestiona la configuración general de la plataforma
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">
              <Globe className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              Seguridad
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración General</CardTitle>
                <CardDescription>
                  Configura los datos básicos de la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nombre del Sitio</Label>
                  <Input
                    id="siteName"
                    value={generalConfig.siteName}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, siteName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Descripción</Label>
                  <Textarea
                    id="siteDescription"
                    value={generalConfig.siteDescription}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, siteDescription: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email de Contacto</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={generalConfig.contactEmail}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, contactEmail: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Email de Soporte</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={generalConfig.supportEmail}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, supportEmail: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-between py-4 border-t">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode">Modo Mantenimiento</Label>
                    <p className="text-sm text-muted-foreground">
                      Activar para realizar mantenimiento del sitio
                    </p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={generalConfig.maintenanceMode}
                    onCheckedChange={(checked) => setGeneralConfig({ ...generalConfig, maintenanceMode: checked })}
                  />
                </div>

                <Button onClick={handleSaveGeneral} disabled={loading} className="w-full">
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Email</CardTitle>
                <CardDescription>
                  Configura los servicios de email y plantillas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Configuración de email próximamente</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Notificaciones</CardTitle>
                <CardDescription>
                  Gestiona las notificaciones del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Notificaciones por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibir notificaciones por correo electrónico
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationConfig.emailNotifications}
                    onCheckedChange={(checked) => setNotificationConfig({ ...notificationConfig, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="newFunerariaAlert">Nuevas Funerarias</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar cuando se registre una nueva funeraria
                    </p>
                  </div>
                  <Switch
                    id="newFunerariaAlert"
                    checked={notificationConfig.newFunerariaAlert}
                    onCheckedChange={(checked) => setNotificationConfig({ ...notificationConfig, newFunerariaAlert: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="newLeadAlert">Nuevos Leads</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar cuando se genere un nuevo lead
                    </p>
                  </div>
                  <Switch
                    id="newLeadAlert"
                    checked={notificationConfig.newLeadAlert}
                    onCheckedChange={(checked) => setNotificationConfig({ ...notificationConfig, newLeadAlert: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="systemAlerts">Alertas del Sistema</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibir alertas importantes del sistema
                    </p>
                  </div>
                  <Switch
                    id="systemAlerts"
                    checked={notificationConfig.systemAlerts}
                    onCheckedChange={(checked) => setNotificationConfig({ ...notificationConfig, systemAlerts: checked })}
                  />
                </div>

                <Button onClick={handleSaveNotifications} disabled={loading} className="w-full">
                  {loading ? "Guardando..." : "Guardar Preferencias"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Seguridad</CardTitle>
                <CardDescription>
                  Gestiona las opciones de seguridad de la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Configuración de seguridad próximamente</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
}