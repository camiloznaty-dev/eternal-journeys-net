import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Settings,
  Database,
  Activity,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/superadmin",
    icon: LayoutDashboard,
  },
  {
    title: "Funerarias",
    url: "/superadmin/funerarias",
    icon: Building2,
  },
  {
    title: "Usuarios",
    url: "/superadmin/usuarios",
    icon: Users,
  },
  {
    title: "Contenido",
    url: "/superadmin/contenido",
    icon: FileText,
  },
  {
    title: "Actividad",
    url: "/superadmin/actividad",
    icon: Activity,
  },
  {
    title: "Base de Datos",
    url: "/superadmin/database",
    icon: Database,
  },
  {
    title: "Configuración",
    url: "/superadmin/configuracion",
    icon: Settings,
  },
];

export function SuperAdminSidebar() {
  const { state } = useSidebar();

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-60"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestión del Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-accent/10"
                      activeClassName="bg-accent/20 text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
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
