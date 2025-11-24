import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/superadmin/SuperAdminLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Activity, AlertCircle, Info, AlertTriangle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ActivityLog {
  id: string;
  user_id: string | null;
  user_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: any;
  ip_address: string | null;
  user_agent: string | null;
  severity: string;
  created_at: string;
}

export default function SuperAdminActividad() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [realtimeLogs, setRealtimeLogs] = useState<ActivityLog[]>([]);

  // Fetch activity logs
  const { data: logs, isLoading, refetch } = useQuery({
    queryKey: ["activity-logs", searchTerm, severityFilter, entityFilter],
    queryFn: async () => {
      let query = supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (searchTerm) {
        query = query.or(`action.ilike.%${searchTerm}%,user_email.ilike.%${searchTerm}%,entity_type.ilike.%${searchTerm}%`);
      }

      if (severityFilter !== "all") {
        query = query.eq("severity", severityFilter);
      }

      if (entityFilter !== "all") {
        query = query.eq("entity_type", entityFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ActivityLog[];
    },
  });

  // Setup realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("activity_logs_realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_logs",
        },
        (payload) => {
          console.log("New activity log:", payload);
          const newLog = payload.new as ActivityLog;
          setRealtimeLogs((prev) => [newLog, ...prev].slice(0, 5));
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "info":
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      critical: "destructive",
      error: "destructive",
      warning: "outline",
      info: "secondary",
    };

    return (
      <Badge variant={variants[severity] || "default"} className="flex items-center gap-1">
        {getSeverityIcon(severity)}
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const getEntityTypeBadge = (entityType: string) => {
    const colors: Record<string, string> = {
      funeraria: "bg-blue-500/10 text-blue-500",
      user: "bg-green-500/10 text-green-500",
      lead: "bg-purple-500/10 text-purple-500",
      caso: "bg-orange-500/10 text-orange-500",
      obituario: "bg-pink-500/10 text-pink-500",
      anuncio: "bg-yellow-500/10 text-yellow-500",
      cotizacion: "bg-cyan-500/10 text-cyan-500",
      factura: "bg-indigo-500/10 text-indigo-500",
    };

    return (
      <Badge className={colors[entityType] || "bg-muted text-muted-foreground"}>
        {entityType}
      </Badge>
    );
  };

  const entityTypes = [
    { value: "all", label: "Todos los tipos" },
    { value: "funeraria", label: "Funerarias" },
    { value: "user", label: "Usuarios" },
    { value: "lead", label: "Leads" },
    { value: "caso", label: "Casos" },
    { value: "obituario", label: "Obituarios" },
    { value: "anuncio", label: "Anuncios" },
    { value: "cotizacion", label: "Cotizaciones" },
    { value: "factura", label: "Facturas" },
  ];

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-2">
              <Activity className="h-8 w-8" />
              Actividad del Sistema
            </h1>
            <p className="text-muted-foreground">
              Monitoreo en tiempo real de acciones y eventos del sistema
            </p>
          </div>
        </div>

        {/* Realtime Activity Banner */}
        {realtimeLogs.length > 0 && (
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-primary animate-pulse" />
              <h3 className="font-semibold">Actividad Reciente (Tiempo Real)</h3>
            </div>
            <div className="space-y-2">
              {realtimeLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-2 text-sm">
                  {getSeverityIcon(log.severity)}
                  <span className="text-muted-foreground">
                    {format(new Date(log.created_at), "HH:mm:ss")}
                  </span>
                  <span className="font-medium">{log.user_email || "Sistema"}</span>
                  <span className="text-muted-foreground">→</span>
                  <span>{log.action}</span>
                  <span className="text-muted-foreground">en</span>
                  {getEntityTypeBadge(log.entity_type)}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por acción, usuario o entidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {entityTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las severidades</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Activity Logs Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha/Hora</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Entidad</TableHead>
                <TableHead>Severidad</TableHead>
                <TableHead>Detalles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
                    Cargando actividad...
                  </TableCell>
                </TableRow>
              ) : logs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No se encontró actividad
                  </TableCell>
                </TableRow>
              ) : (
                logs?.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss", { locale: es })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.user_email || "Sistema"}</div>
                        {log.ip_address && (
                          <div className="text-xs text-muted-foreground">{log.ip_address}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getEntityTypeBadge(log.entity_type)}
                        {log.entity_id && (
                          <span className="text-xs text-muted-foreground font-mono">
                            {log.entity_id.slice(0, 8)}...
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                    <TableCell>
                      {log.details && (
                        <div className="max-w-md">
                          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Info</h3>
            </div>
            <div className="text-2xl font-bold">
              {logs?.filter((l) => l.severity === "info").length || 0}
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h3 className="font-semibold">Warnings</h3>
            </div>
            <div className="text-2xl font-bold">
              {logs?.filter((l) => l.severity === "warning").length || 0}
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold">Errors</h3>
            </div>
            <div className="text-2xl font-bold">
              {logs?.filter((l) => l.severity === "error").length || 0}
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold">Critical</h3>
            </div>
            <div className="text-2xl font-bold">
              {logs?.filter((l) => l.severity === "critical").length || 0}
            </div>
          </Card>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
