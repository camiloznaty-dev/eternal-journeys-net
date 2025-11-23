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
import Planificador from "./pages/Planificador";
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
          <Route path="/comparar" element={<Comparar />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/obituarios" element={<Obituarios />} />
          <Route path="/planificador" element={<Planificador />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
