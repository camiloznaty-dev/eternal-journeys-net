import { ReactNode } from "react";
import { SuperAdminHeader } from "./SuperAdminHeader";
import { SuperAdminSidebar } from "./SuperAdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface SuperAdminLayoutProps {
  children: ReactNode;
}

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <SuperAdminSidebar />
        <div className="flex-1 flex flex-col">
          <SuperAdminHeader />
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
