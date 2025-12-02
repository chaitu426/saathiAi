import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "../app-sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset className="flex-1">
          {children}
        </SidebarInset>
    </SidebarProvider>
  );
}