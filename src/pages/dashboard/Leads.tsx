import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Leads() {
  const leads = [
    {
      id: "1",
      name: "María González",
      phone: "+56912345678",
      status: "nuevo",
      priority: "alta",
      source: "website",
      created: "Hace 2 horas"
    },
    {
      id: "2",
      name: "Juan Pérez",
      phone: "+56987654321",
      status: "contactado",
      priority: "media",
      source: "llamada",
      created: "Hace 1 día"
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      nuevo: "bg-blue-500",
      contactado: "bg-yellow-500",
      cotizado: "bg-purple-500",
      negociacion: "bg-orange-500",
      ganado: "bg-green-500",
      perdido: "bg-red-500"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Leads</h1>
            <p className="text-muted-foreground">
              Gestiona tus clientes potenciales
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Lead
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar leads..." className="pl-10" />
          </div>
          <select className="rounded-md border px-3 py-2">
            <option>Todos los estados</option>
            <option>Nuevo</option>
            <option>Contactado</option>
            <option>Cotizado</option>
            <option>Negociación</option>
          </select>
        </div>

        <div className="grid gap-4">
          {leads.map((lead) => (
            <Card key={lead.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{lead.name}</h3>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                      <Badge variant="outline">
                        {lead.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{lead.phone}</span>
                      <span>•</span>
                      <span>Fuente: {lead.source}</span>
                      <span>•</span>
                      <span>{lead.created}</span>
                    </div>
                  </div>
                  <Button variant="ghost">Ver Detalles</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
