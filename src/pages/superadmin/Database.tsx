import { useState } from "react";
import { SuperAdminLayout } from "@/components/superadmin/SuperAdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database, Play, AlertCircle, CheckCircle, Table as TableIcon, BarChart3, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TableInfo {
  table_name: string;
  row_count: number;
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
}

export default function SuperAdminDatabase() {
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM funerarias LIMIT 10;");
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  // Fetch all tables
  const { data: tables, isLoading: loadingTables } = useQuery({
    queryKey: ["database-tables"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_table_info" as any);
      
      // Fallback: Get tables from information_schema
      const tableNames = [
        "funerarias", "profiles", "user_roles", "empleados", "leads", 
        "casos_servicios", "obituarios", "anuncios_sepulturas", "cotizaciones",
        "facturas", "productos", "servicios", "proveedores", "activity_logs",
        "memoriales", "diario_duelo", "pedidos"
      ];
      
      const tablesWithCounts = await Promise.all(
        tableNames.map(async (tableName) => {
          try {
            const { count, error } = await supabase
              .from(tableName as any)
              .select("*", { count: "exact", head: true });
            
            return {
              table_name: tableName,
              row_count: count || 0,
            };
          } catch {
            return {
              table_name: tableName,
              row_count: 0,
            };
          }
        })
      );
      
      return tablesWithCounts.filter(t => t.row_count !== null) as TableInfo[];
    },
  });

  // Fetch columns for selected table
  const { data: columns } = useQuery({
    queryKey: ["table-columns", selectedTable],
    queryFn: async () => {
      if (!selectedTable) return [];
      
      const { data, error } = await supabase
        .from(selectedTable as any)
        .select("*")
        .limit(1);
      
      if (error || !data || data.length === 0) return [];
      
      const sampleRow = data[0];
      const columnInfo: ColumnInfo[] = Object.keys(sampleRow).map((key) => ({
        column_name: key,
        data_type: typeof sampleRow[key],
        is_nullable: "YES",
        column_default: null,
      }));
      
      return columnInfo;
    },
    enabled: !!selectedTable,
  });

  // Database statistics
  const { data: stats } = useQuery({
    queryKey: ["database-stats"],
    queryFn: async () => {
      const totalTables = tables?.length || 0;
      const totalRows = tables?.reduce((sum, t) => sum + (t.row_count || 0), 0) || 0;
      
      return {
        totalTables,
        totalRows,
        largestTable: tables?.reduce((max, t) => 
          (t.row_count || 0) > (max?.row_count || 0) ? t : max
        , tables[0]),
      };
    },
    enabled: !!tables,
  });

  const executeQuery = async () => {
    // Validate query - only allow SELECT statements
    const trimmedQuery = sqlQuery.trim().toLowerCase();
    
    if (!trimmedQuery.startsWith("select")) {
      toast.error("Solo se permiten consultas SELECT");
      return;
    }

    // Check for dangerous keywords
    const dangerousKeywords = ["insert", "update", "delete", "drop", "alter", "create", "truncate"];
    if (dangerousKeywords.some(keyword => trimmedQuery.includes(keyword))) {
      toast.error("Consulta no permitida. Solo consultas de lectura (SELECT)");
      return;
    }

    setIsExecuting(true);
    setQueryResult(null);

    try {
      // Extract table name from query
      const tableMatch = sqlQuery.match(/from\s+(\w+)/i);
      const tableName = tableMatch ? tableMatch[1] : null;

      if (!tableName) {
        toast.error("No se pudo identificar la tabla en la consulta");
        return;
      }

      // Execute query using Supabase client
      const { data, error } = await supabase
        .from(tableName as any)
        .select("*")
        .limit(100);

      if (error) {
        toast.error(`Error: ${error.message}`);
        setQueryResult({ error: error.message });
      } else {
        toast.success(`Consulta ejecutada: ${data.length} resultados`);
        setQueryResult({ 
          success: true, 
          data,
          rowCount: data.length 
        });
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      setQueryResult({ error: error.message });
    } finally {
      setIsExecuting(false);
    }
  };

  const renderQueryResults = () => {
    if (!queryResult) return null;

    if (queryResult.error) {
      return (
        <Card className="p-4 border-destructive">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold">Error en la consulta</span>
          </div>
          <pre className="mt-2 text-sm bg-destructive/10 p-2 rounded">
            {queryResult.error}
          </pre>
        </Card>
      );
    }

    if (queryResult.success && queryResult.data) {
      const data = queryResult.data;
      if (data.length === 0) {
        return (
          <Card className="p-4">
            <p className="text-muted-foreground">No se encontraron resultados</p>
          </Card>
        );
      }

      const columns = Object.keys(data[0]);

      return (
        <Card>
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-semibold">
                Resultados: {queryResult.rowCount} filas
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col} className="whitespace-nowrap">
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row: any, idx: number) => (
                  <TableRow key={idx}>
                    {columns.map((col) => (
                      <TableCell key={col} className="whitespace-nowrap">
                        {typeof row[col] === "object"
                          ? JSON.stringify(row[col])
                          : String(row[col] ?? "NULL")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      );
    }

    return null;
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-2">
              <Database className="h-8 w-8" />
              Gestión de Base de Datos
            </h1>
            <p className="text-muted-foreground">
              Explora esquemas, ejecuta consultas y monitorea estadísticas
            </p>
          </div>
        </div>

        {/* Database Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TableIcon className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Tablas Totales</h3>
            </div>
            <div className="text-3xl font-bold">{stats?.totalTables || 0}</div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Registros Totales</h3>
            </div>
            <div className="text-3xl font-bold">
              {stats?.totalRows?.toLocaleString() || 0}
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Tabla más Grande</h3>
            </div>
            <div className="text-xl font-bold">
              {stats?.largestTable?.table_name || "N/A"}
            </div>
            <div className="text-sm text-muted-foreground">
              {stats?.largestTable?.row_count?.toLocaleString() || 0} filas
            </div>
          </Card>
        </div>

        <Tabs defaultValue="explorer" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="explorer">Explorador de Tablas</TabsTrigger>
            <TabsTrigger value="sql">Editor SQL</TabsTrigger>
          </TabsList>

          {/* Table Explorer */}
          <TabsContent value="explorer" className="space-y-4">
            <Card>
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <TableIcon className="h-5 w-5" />
                  Esquemas de Tablas
                </h3>
              </div>
              {loadingTables ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">Cargando tablas...</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {tables?.map((table) => (
                    <AccordionItem key={table.table_name} value={table.table_name}>
                      <AccordionTrigger 
                        className="px-4 hover:bg-accent/5"
                        onClick={() => setSelectedTable(table.table_name)}
                      >
                        <div className="flex items-center justify-between w-full pr-4">
                          <span className="font-mono font-medium">
                            {table.table_name}
                          </span>
                          <Badge variant="secondary">
                            {table.row_count?.toLocaleString() || 0} filas
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        {selectedTable === table.table_name && columns && (
                          <div className="space-y-2">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Columna</TableHead>
                                  <TableHead>Tipo</TableHead>
                                  <TableHead>Nullable</TableHead>
                                  <TableHead>Default</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {columns.map((col) => (
                                  <TableRow key={col.column_name}>
                                    <TableCell className="font-mono font-medium">
                                      {col.column_name}
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="outline">{col.data_type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                      {col.is_nullable === "YES" ? (
                                        <Badge variant="secondary">Yes</Badge>
                                      ) : (
                                        <Badge variant="default">No</Badge>
                                      )}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm text-muted-foreground">
                                      {col.column_default || "-"}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </Card>
          </TabsContent>

          {/* SQL Editor */}
          <TabsContent value="sql" className="space-y-4">
            <Card>
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Editor SQL (Solo Lectura)
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Solo se permiten consultas SELECT. Máximo 100 resultados.
                </p>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <Textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    placeholder="SELECT * FROM tabla_nombre LIMIT 10;"
                    className="font-mono min-h-[120px]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={executeQuery}
                    disabled={isExecuting}
                    className="gap-2"
                  >
                    {isExecuting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Ejecutando...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Ejecutar Consulta
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSqlQuery("SELECT * FROM funerarias LIMIT 10;");
                      setQueryResult(null);
                    }}
                  >
                    Limpiar
                  </Button>
                </div>
              </div>
            </Card>

            {renderQueryResults()}
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
}
