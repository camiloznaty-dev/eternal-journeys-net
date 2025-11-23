import { Link } from "react-router-dom";
import siriusLogo from "@/assets/sirius-logo.png";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <img 
              src={siriusLogo} 
              alt="Sirius" 
              className="h-10 w-auto brightness-0 invert mb-4"
            />
            <p className="text-sm text-muted-foreground mb-4">
              Conectando familias con servicios funerarios de calidad y dignidad. Modernizando la industria funeraria en Latinoamérica.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Para Familias</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/funerarias" className="hover:text-accent transition-colors">Buscar Funerarias</Link></li>
              <li><Link to="/comparar" className="hover:text-accent transition-colors">Comparador</Link></li>
              <li><Link to="/productos" className="hover:text-accent transition-colors">Productos</Link></li>
              <li><Link to="/obituarios" className="hover:text-accent transition-colors">Obituarios</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Para Funerarias</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-colors">Registrar Funeraria</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Planes y Precios</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Recursos</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Soporte</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-colors">Nosotros</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Blog</a></li>
              <li><Link to="/privacidad" className="hover:text-accent transition-colors">Privacidad</Link></li>
              <li><Link to="/terminos" className="hover:text-accent transition-colors">Términos</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Sirius. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
