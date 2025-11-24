import { ReactNode } from "react";
import { SuperAdminHeader } from "./SuperAdminHeader";
import { SuperAdminSidebar } from "./SuperAdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/Header";

interface SuperAdminLayoutProps {
  children: ReactNode;
}

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  return (
    <div className="min-h-screen w-full">
      <Header />
      <SidebarProvider defaultOpen={true}>
        <div className="flex w-full">
          <SuperAdminSidebar />
          <div className="flex-1 flex flex-col">
            <SuperAdminHeader />
            <main className="flex-1 p-8 bg-background">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
