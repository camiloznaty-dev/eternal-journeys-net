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
  Crown,
  BookOpen,
  Mail,
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
    title: "Planes",
    url: "/superadmin/planes",
    icon: Crown,
  },
  {
    title: "Blog",
    url: "/superadmin/blog",
    icon: BookOpen,
  },
  {
    title: "Email Marketing",
    url: "/superadmin/email-marketing",
    icon: Mail,
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
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r">
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
