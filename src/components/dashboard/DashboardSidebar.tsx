import {
  LayoutDashboard,
  Users,
  Briefcase,
  Package,
  TrendingUp,
  Calendar,
  FileText,
  DollarSign,
  Settings,
  Building2,
  Truck,
  MessageSquare,
  ClipboardList,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Panel Principal", url: "/dashboard", icon: LayoutDashboard },
  { title: "Leads", url: "/dashboard/leads", icon: TrendingUp },
  { title: "Servicios activos", url: "/dashboard/casos", icon: Briefcase },
  { title: "Obituarios", url: "/dashboard/obituarios", icon: FileText },
  { title: "Productos", url: "/dashboard/productos", icon: Package },
  { title: "Servicios", url: "/dashboard/servicios", icon: ClipboardList },
  { title: "Cotizaciones", url: "/dashboard/cotizaciones", icon: FileText },
  { title: "Facturas", url: "/dashboard/facturas", icon: DollarSign },
  { title: "Equipo", url: "/dashboard/equipo", icon: Users },
  { title: "Turnos", url: "/dashboard/turnos", icon: Calendar },
  { title: "Proveedores", url: "/dashboard/proveedores", icon: Truck },
  { title: "Mensajes", url: "/dashboard/mensajes", icon: MessageSquare },
  { title: "Mi Funeraria", url: "/dashboard/perfil", icon: Building2 },
  { title: "Configuración", url: "/dashboard/configuracion", icon: Settings },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestión</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3 hover:bg-accent hover:text-accent-foreground"
                      activeClassName="bg-accent text-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
