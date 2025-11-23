import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Perfil() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">Mi Funeraria</h1>
          <p className="text-muted-foreground">
            Configura el perfil público de tu funeraria
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
            <CardDescription>
              Esta información se mostrará en tu mini website pública
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Funeraria</Label>
                <Input id="nombre" placeholder="Funeraria Ejemplo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Personalizada</Label>
                <div className="flex gap-2">
                  <span className="flex items-center text-sm text-muted-foreground">
                    sirius.cl/funerarias/
                  </span>
                  <Input id="slug" placeholder="mi-funeraria" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Cuéntanos sobre tu funeraria..."
                rows={4}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" placeholder="Av. Principal 123" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comuna">Comuna</Label>
                <Input id="comuna" placeholder="Santiago" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" placeholder="+56912345678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="contacto@funeraria.cl" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="horarios">Horarios de Atención</Label>
              <Textarea
                id="horarios"
                placeholder="Lunes a Viernes: 9:00 - 18:00"
                rows={3}
              />
            </div>

            <Button>Guardar Cambios</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personalización</CardTitle>
            <CardDescription>
              Personaliza el diseño de tu mini website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="color-primario">Color Primario</Label>
                <div className="flex gap-2">
                  <Input id="color-primario" type="color" className="w-20" />
                  <Input placeholder="#000000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color-secundario">Color Secundario</Label>
                <div className="flex gap-2">
                  <Input id="color-secundario" type="color" className="w-20" />
                  <Input placeholder="#666666" />
                </div>
              </div>
            </div>

            <Button>Guardar Colores</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
