import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Funerarias from "./pages/Funerarias";
import Comparar from "./pages/Comparar";
import Productos from "./pages/Productos";
import Obituarios from "./pages/Obituarios";
import ObituarioDetalle from "./pages/ObituarioDetalle";
import Planificador from "./pages/Planificador";
import Asistencia from "./pages/Asistencia";
import CrearMemorial from "./pages/CrearMemorial";
import MemorialDetalle from "./pages/MemorialDetalle";
import DiarioDuelo from "./pages/DiarioDuelo";
import Auth from "./pages/Auth";
import FunerariaPublica from "./pages/FunerariaPublica";
import Terminos from "./pages/Terminos";
import Privacidad from "./pages/Privacidad";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Blog from "./pages/Blog";
import VendeSepultura from "./pages/VendeSepultura";
import PublicarSepultura from "./pages/PublicarSepultura";
import Recursos from "./pages/Recursos";
import Dashboard from "./pages/dashboard/Dashboard";
import Leads from "./pages/dashboard/Leads";
import Casos from "./pages/dashboard/Casos";
import DashboardObituarios from "./pages/dashboard/DashboardObituarios";
import DashboardProductos from "./pages/dashboard/Productos";
import DashboardServicios from "./pages/dashboard/Servicios";
import Cotizaciones from "./pages/dashboard/Cotizaciones";
import Facturas from "./pages/dashboard/Facturas";
import Equipo from "./pages/dashboard/Equipo";
import Turnos from "./pages/dashboard/Turnos";
import Proveedores from "./pages/dashboard/Proveedores";
import ProveedorDetalle from "./pages/dashboard/ProveedorDetalle";
import Mensajes from "./pages/dashboard/Mensajes";
import Perfil from "./pages/dashboard/Perfil";
import Configuracion from "./pages/dashboard/Configuracion";
import AnunciosSepulturas from "./pages/dashboard/AnunciosSepulturas";
import MiCuenta from "./pages/cliente/MiCuenta";
import MisMemoriales from "./pages/cliente/MisMemoriales";
import MiDiario from "./pages/cliente/MiDiario";
import ProyectoInterno from "./pages/ProyectoInterno";
import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import SuperAdminFunerarias from "./pages/superadmin/Funerarias";
import SuperAdminUsuarios from "./pages/superadmin/Usuarios";
import SuperAdminContenido from "./pages/superadmin/Contenido";
import SuperAdminActividad from "./pages/superadmin/Actividad";
import SuperAdminDatabase from "./pages/superadmin/Database";
import SuperAdminPlanes from "./pages/superadmin/Planes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/funerarias" element={<Funerarias />} />
          <Route path="/f/:slug" element={<FunerariaPublica />} />
          <Route path="/funerarias/:slug" element={<FunerariaPublica />} />
          <Route path="/comparar" element={<Comparar />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/obituarios" element={<Obituarios />} />
          <Route path="/obituarios/:id" element={<ObituarioDetalle />} />
          <Route path="/planificador" element={<Planificador />} />
          <Route path="/asistencia" element={<Asistencia />} />
          <Route path="/asistencia/crear-memorial" element={<CrearMemorial />} />
          <Route path="/asistencia/memorial/:id" element={<MemorialDetalle />} />
          <Route path="/asistencia/diario/:memorialId" element={<DiarioDuelo />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/recursos" element={<Recursos />} />
          <Route path="/vende-sepultura" element={<VendeSepultura />} />
          <Route path="/publicar-sepultura" element={<PublicarSepultura />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/leads" element={<Leads />} />
          <Route path="/dashboard/casos" element={<Casos />} />
          <Route path="/dashboard/obituarios" element={<DashboardObituarios />} />
          <Route path="/dashboard/productos" element={<DashboardProductos />} />
          <Route path="/dashboard/servicios" element={<DashboardServicios />} />
          <Route path="/dashboard/cotizaciones" element={<Cotizaciones />} />
          <Route path="/dashboard/facturas" element={<Facturas />} />
          <Route path="/dashboard/equipo" element={<Equipo />} />
          <Route path="/dashboard/turnos" element={<Turnos />} />
          <Route path="/dashboard/proveedores" element={<Proveedores />} />
          <Route path="/dashboard/proveedores/:id" element={<ProveedorDetalle />} />
          <Route path="/dashboard/mensajes" element={<Mensajes />} />
          <Route path="/dashboard/perfil" element={<Perfil />} />
          <Route path="/dashboard/configuracion" element={<Configuracion />} />
          <Route path="/dashboard/sepulturas" element={<AnunciosSepulturas />} />
          
          {/* Cliente Dashboard Routes */}
          <Route path="/mi-cuenta" element={<MiCuenta />} />
          <Route path="/mi-cuenta/memoriales" element={<MisMemoriales />} />
          <Route path="/mi-cuenta/diario" element={<MiDiario />} />
          
          {/* Internal Management */}
          <Route path="/proyecto-interno" element={<ProyectoInterno />} />
          
          {/* SuperAdmin Routes */}
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/funerarias" element={<SuperAdminFunerarias />} />
          <Route path="/superadmin/usuarios" element={<SuperAdminUsuarios />} />
          <Route path="/superadmin/contenido" element={<SuperAdminContenido />} />
          <Route path="/superadmin/actividad" element={<SuperAdminActividad />} />
          <Route path="/superadmin/database" element={<SuperAdminDatabase />} />
          <Route path="/superadmin/planes" element={<SuperAdminPlanes />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
