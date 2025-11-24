import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Circle, 
  Code2, 
  Database, 
  Layout, 
  Layers, 
  Palette, 
  Route,
  Server,
  Sparkles,
  FileCode,
  Globe
} from "lucide-react";

export default function ProyectoInterno() {
  // Estado para las fases (localStorage para persistencia)
  const [fase1Checks, setFase1Checks] = useState(() => {
    const saved = localStorage.getItem('fase1Checks');
    return saved ? JSON.parse(saved) : {
      diseño: false,
      tipografia: false,
      animaciones: false,
      hero: false
    };
  });

  const [fase2Checks, setFase2Checks] = useState(() => {
    const saved = localStorage.getItem('fase2Checks');
    return saved ? JSON.parse(saved) : {
      testimonios: false,
      comoFunciona: false,
      ctas: false,
      contacto: false
    };
  });

  const [fase3Checks, setFase3Checks] = useState(() => {
    const saved = localStorage.getItem('fase3Checks');
    return saved ? JSON.parse(saved) : {
      calculadora: false,
      comparador: false,
      recursos: false
    };
  });

  const [fase4Checks, setFase4Checks] = useState(() => {
    const saved = localStorage.getItem('fase4Checks');
    return saved ? JSON.parse(saved) : {
      blog: false,
      fotografia: false,
      servicios: false
    };
  });

  const [fase5Checks, setFase5Checks] = useState(() => {
    const saved = localStorage.getItem('fase5Checks');
    return saved ? JSON.parse(saved) : {
      dashboard: false,
      memorial: false,
      comunidad: false
    };
  });

  const [fase6Checks, setFase6Checks] = useState(() => {
    const saved = localStorage.getItem('fase6Checks');
    return saved ? JSON.parse(saved) : {
      analytics: false,
      mobile: false,
      integraciones: false
    };
  });

  const updateChecks = (fase: string, key: string, value: boolean) => {
    const setters: any = {
      fase1: setFase1Checks,
      fase2: setFase2Checks,
      fase3: setFase3Checks,
      fase4: setFase4Checks,
      fase5: setFase5Checks,
      fase6: setFase6Checks,
    };
    
    setters[fase]((prev: any) => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem(`${fase}Checks`, JSON.stringify(updated));
      return updated;
    });
  };

  const routes = {
    publicas: [
      { path: "/", name: "Homepage", status: "✅" },
      { path: "/funerarias", name: "Directorio Funerarias", status: "✅" },
      { path: "/f/:slug", name: "Perfil Funeraria Público", status: "✅" },
      { path: "/comparar", name: "Comparador", status: "⚠️" },
      { path: "/obituarios", name: "Obituarios", status: "✅" },
      { path: "/obituarios/:id", name: "Detalle Obituario", status: "✅" },
      { path: "/planificador", name: "Planificador Funeral", status: "✅" },
      { path: "/asistencia", name: "Asistencia Duelo", status: "✅" },
      { path: "/asistencia/crear-memorial", name: "Crear Memorial", status: "✅" },
      { path: "/asistencia/memorial/:id", name: "Detalle Memorial", status: "✅" },
      { path: "/asistencia/diario/:memorialId", name: "Diario de Duelo (Memorial)", status: "✅" },
      { path: "/vende-sepultura", name: "Landing Venta Sepulturas", status: "✅" },
      { path: "/publicar-sepultura", name: "Publicar Sepultura", status: "✅" },
      { path: "/nosotros", name: "Sobre Nosotros", status: "✅" },
      { path: "/contacto", name: "Contacto", status: "✅" },
      { path: "/blog", name: "Blog", status: "⚠️" },
      { path: "/terminos", name: "Términos", status: "✅" },
      { path: "/privacidad", name: "Privacidad", status: "✅" },
    ],
    auth: [
      { path: "/auth", name: "Login/Signup", status: "✅" },
    ],
    dashboardFuneraria: [
      { path: "/dashboard", name: "Dashboard Principal", status: "✅" },
      { path: "/dashboard/leads", name: "Leads", status: "✅" },
      { path: "/dashboard/casos", name: "Casos", status: "✅" },
      { path: "/dashboard/obituarios", name: "Obituarios Dashboard", status: "✅" },
      { path: "/dashboard/productos", name: "Productos Dashboard", status: "✅" },
      { path: "/dashboard/servicios", name: "Servicios Dashboard", status: "✅" },
      { path: "/dashboard/cotizaciones", name: "Cotizaciones", status: "✅" },
      { path: "/dashboard/facturas", name: "Facturas", status: "✅" },
      { path: "/dashboard/equipo", name: "Equipo", status: "✅" },
      { path: "/dashboard/turnos", name: "Turnos", status: "✅" },
      { path: "/dashboard/proveedores", name: "Proveedores", status: "✅" },
      { path: "/dashboard/proveedores/:id", name: "Detalle Proveedor", status: "✅" },
      { path: "/dashboard/mensajes", name: "Mensajes", status: "⚠️" },
      { path: "/dashboard/perfil", name: "Perfil", status: "✅" },
      { path: "/dashboard/configuracion", name: "Configuración", status: "✅" },
      { path: "/dashboard/sepulturas", name: "Anuncios Sepulturas", status: "✅" },
    ],
    dashboardCliente: [
      { path: "/mi-cuenta", name: "Mi Cuenta (Dashboard Cliente)", status: "✅" },
      { path: "/mi-cuenta/memoriales", name: "Mis Memoriales", status: "✅" },
      { path: "/mi-cuenta/diario", name: "Mi Diario de Duelo", status: "✅" },
    ],
  };

  const techStack = [
    { category: "Frontend", icon: Code2, items: [
      { name: "React 18", version: "^18.3.1", purpose: "UI Library" },
      { name: "TypeScript", version: "Latest", purpose: "Type Safety" },
      { name: "Vite", version: "Latest", purpose: "Build Tool" },
      { name: "React Router", version: "^6.30.1", purpose: "Routing" },
    ]},
    { category: "Styling", icon: Palette, items: [
      { name: "Tailwind CSS", version: "Latest", purpose: "Utility CSS" },
      { name: "Shadcn/ui", version: "Latest", purpose: "Component Library" },
      { name: "Framer Motion", version: "^12.23.24", purpose: "Animations" },
    ]},
    { category: "Backend", icon: Server, items: [
      { name: "Supabase", version: "^2.84.0", purpose: "BaaS (via Lovable Cloud)" },
      { name: "PostgreSQL", version: "15+", purpose: "Database" },
      { name: "Row Level Security", version: "-", purpose: "Data Security" },
    ]},
    { category: "State Management", icon: Database, items: [
      { name: "TanStack Query", version: "^5.83.0", purpose: "Server State" },
      { name: "React Hook Form", version: "^7.61.1", purpose: "Form State" },
      { name: "Zod", version: "^3.25.76", purpose: "Validation" },
    ]},
    { category: "UI/UX", icon: Sparkles, items: [
      { name: "Lucide React", version: "^0.462.0", purpose: "Icons" },
      { name: "Recharts", version: "^2.15.4", purpose: "Charts" },
      { name: "Sonner", version: "^1.7.4", purpose: "Toasts" },
      { name: "date-fns", version: "^3.6.0", purpose: "Date Handling" },
    ]},
  ];

  const calculateProgress = (checks: any) => {
    const total = Object.keys(checks).length;
    const completed = Object.values(checks).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileCode className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Gestión de Proyecto</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Dashboard interno para supervisar estructura, tecnología y progreso del desarrollo
            </p>
          </div>

          <Tabs defaultValue="estructura" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="estructura">
                <Route className="h-4 w-4 mr-2" />
                Estructura del Sitio
              </TabsTrigger>
              <TabsTrigger value="stack">
                <Layers className="h-4 w-4 mr-2" />
                Stack Tecnológico
              </TabsTrigger>
              <TabsTrigger value="roadmap">
                <Layout className="h-4 w-4 mr-2" />
                Roadmap & Progreso
              </TabsTrigger>
            </TabsList>

            {/* ESTRUCTURA DEL SITIO */}
            <TabsContent value="estructura" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Páginas Públicas
                  </CardTitle>
                  <CardDescription>Rutas accesibles sin autenticación</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {routes.publicas.map((route) => (
                      <div key={route.path} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{route.path}</code>
                          <span className="text-sm">{route.name}</span>
                        </div>
                        <Badge variant={route.status === "✅" ? "default" : "secondary"}>
                          {route.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Dashboard Funerarias
                  </CardTitle>
                  <CardDescription>Panel de gestión para empresas funerarias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {routes.dashboardFuneraria.map((route) => (
                      <div key={route.path} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{route.path}</code>
                          <span className="text-sm">{route.name}</span>
                        </div>
                        <Badge variant={route.status === "✅" ? "default" : "secondary"}>
                          {route.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Dashboard Clientes
                  </CardTitle>
                  <CardDescription>Panel personal para usuarios finales (familias)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {routes.dashboardCliente.map((route) => (
                      <div key={route.path} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{route.path}</code>
                          <span className="text-sm">{route.name}</span>
                        </div>
                        <Badge variant={route.status === "✅" ? "default" : "secondary"}>
                          {route.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Leyenda</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">✅</Badge>
                      <span className="text-sm">Completado y funcional</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">⚠️</Badge>
                      <span className="text-sm">Necesita mejoras</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* STACK TECNOLÓGICO */}
            <TabsContent value="stack" className="space-y-6">
              {techStack.map((category) => (
                <Card key={category.category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <category.icon className="h-5 w-5" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {category.items.map((tech) => (
                        <div key={tech.name} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <div className="font-semibold">{tech.name}</div>
                            <div className="text-sm text-muted-foreground">{tech.purpose}</div>
                          </div>
                          <Badge variant="outline">{tech.version}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardHeader>
                  <CardTitle>Arquitectura</CardTitle>
                  <CardDescription>Estructura técnica del proyecto</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Frontend (SPA)</h4>
                      <p className="text-sm text-muted-foreground">
                        React + TypeScript + Vite • Desplegado en Lovable Cloud • Tailwind CSS + Shadcn/ui para UI
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Backend (BaaS)</h4>
                      <p className="text-sm text-muted-foreground">
                        Supabase (via Lovable Cloud) • PostgreSQL • Row Level Security • Auth nativo
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Storage</h4>
                      <p className="text-sm text-muted-foreground">
                        Supabase Storage • Buckets: funeraria-images, obituarios, caso-documentos, proveedor-documentos
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Autenticación</h4>
                      <p className="text-sm text-muted-foreground">
                        Supabase Auth • Email/Password • Roles: cliente, funeraria • Auto-confirm habilitado
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ROADMAP */}
            <TabsContent value="roadmap" className="space-y-6">
              {/* FASE 1 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        Fase 1: Fundación Visual
                      </CardTitle>
                      <CardDescription>Crítico - Sistema de diseño y hero section</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-lg">
                      {calculateProgress(fase1Checks)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={fase1Checks.diseño}
                      onCheckedChange={(checked) => updateChecks('fase1', 'diseño', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      Sistema de Diseño Completo (colores, tokens, espaciado)
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={fase1Checks.tipografia}
                      onCheckedChange={(checked) => updateChecks('fase1', 'tipografia', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      Tipografía Display Única (Crimson Text, Fraunces, o Instrument Serif)
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={fase1Checks.animaciones}
                      onCheckedChange={(checked) => updateChecks('fase1', 'animaciones', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      Animaciones y Vida (Framer Motion, transiciones, micro-interacciones)
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={fase1Checks.hero}
                      onCheckedChange={(checked) => updateChecks('fase1', 'hero', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      Hero Section Poderoso (mensaje emocional, CTA, números de impacto)
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* FASE 2 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Circle className="h-5 w-5 text-muted-foreground" />
                        Fase 2: Confianza y Conversión
                      </CardTitle>
                      <CardDescription>Alto impacto - Prueba social y CTAs</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-lg">
                      {calculateProgress(fase2Checks)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={fase2Checks.testimonios}
                      onCheckedChange={(checked) => updateChecks('fase2', 'testimonios', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      Prueba Social Visible (testimonios, números, certificaciones)
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={fase2Checks.comoFunciona}
                      onCheckedChange={(checked) => updateChecks('fase2', 'comoFunciona', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      Sección "Cómo Funciona" (3-5 pasos visuales + FAQ)
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={fase2Checks.ctas}
                      onCheckedChange={(checked) => updateChecks('fase2', 'ctas', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      CTAs y Jerarquía (botones optimizados, formularios)
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={fase2Checks.contacto}
                      onCheckedChange={(checked) => updateChecks('fase2', 'contacto', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      Contacto Inmediato (WhatsApp/chat flotante, teléfono visible)
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* FASE 3 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Circle className="h-5 w-5 text-muted-foreground" />
                        Fase 3: Herramientas de Valor
                      </CardTitle>
                      <CardDescription>Diferenciación - Utilidad y recursos</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-lg">
                      {calculateProgress(fase3Checks)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={fase3Checks.calculadora}
                      onCheckedChange={(checked) => updateChecks('fase3', 'calculadora', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      Calculadora de Costos Interactiva (selector servicios, cotización)
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={fase3Checks.comparador}
                      onCheckedChange={(checked) => updateChecks('fase3', 'comparador', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      Comparador Mejorado (filtros, visualización, reviews)
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={fase3Checks.recursos}
                      onCheckedChange={(checked) => updateChecks('fase3', 'recursos', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      Recursos Descargables (guías PDF, checklists)
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* FASE 4 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Circle className="h-5 w-5 text-muted-foreground" />
                        Fase 4: Contenido y SEO
                      </CardTitle>
                      <CardDescription>Crecimiento orgánico - Posicionamiento</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-lg">
                      {calculateProgress(fase4Checks)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={fase4Checks.blog}
                      onCheckedChange={(checked) => updateChecks('fase4', 'blog', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      Blog con Contenido Real (10-15 artículos, SEO optimizado)
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={fase4Checks.fotografia}
                      onCheckedChange={(checked) => updateChecks('fase4', 'fotografia', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      Fotografía Profesional (servicios reales, equipo, instalaciones)
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={fase4Checks.servicios}
                      onCheckedChange={(checked) => updateChecks('fase4', 'servicios', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      Páginas de Servicio Detalladas (una por servicio principal)
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* FASE 5 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Circle className="h-5 w-5 text-muted-foreground" />
                        Fase 5: Experiencia Avanzada
                      </CardTitle>
                      <CardDescription>Innovación - Líder tecnológico</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-lg">
                      {calculateProgress(fase5Checks)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={fase5Checks.dashboard}
                      onCheckedChange={(checked) => updateChecks('fase5', 'dashboard', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      Dashboard Cliente Mejorado (onboarding, tutoriales, exportar PDF)
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={fase5Checks.memorial}
                      onCheckedChange={(checked) => updateChecks('fase5', 'memorial', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      Memorial Digital Premium (templates, multimedia, QR codes)
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={fase5Checks.comunidad}
                      onCheckedChange={(checked) => updateChecks('fase5', 'comunidad', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      Comunidad de Apoyo (foro, grupos, eventos virtuales)
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* FASE 6 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Circle className="h-5 w-5 text-muted-foreground" />
                        Fase 6: Optimización y Escala
                      </CardTitle>
                      <CardDescription>Refinamiento - Perfección técnica</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-lg">
                      {calculateProgress(fase6Checks)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={fase6Checks.analytics}
                      onCheckedChange={(checked) => updateChecks('fase6', 'analytics', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      Analytics y Optimización (heatmaps, A/B testing, métricas)
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={fase6Checks.mobile}
                      onCheckedChange={(checked) => updateChecks('fase6', 'mobile', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      Mobile-First Perfeccionado (PWA, performance, offline)
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={fase6Checks.integraciones}
                      onCheckedChange={(checked) => updateChecks('fase6', 'integraciones', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      Integraciones Avanzadas (CRM, email automation, pagos, firma digital)
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Resumen General */}
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle>Resumen de Progreso</CardTitle>
                  <CardDescription>Vista general del avance del proyecto</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {calculateProgress({...fase1Checks, ...fase2Checks})}%
                      </div>
                      <div className="text-sm text-muted-foreground">Fases Críticas (1-2)</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {calculateProgress({...fase3Checks, ...fase4Checks})}%
                      </div>
                      <div className="text-sm text-muted-foreground">Diferenciación (3-4)</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {calculateProgress({...fase5Checks, ...fase6Checks})}%
                      </div>
                      <div className="text-sm text-muted-foreground">Innovación (5-6)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
