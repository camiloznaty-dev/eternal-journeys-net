import { motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

export const WhatsAppFloat = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Número de WhatsApp (dejar vacío hasta tener uno real)
  const whatsappNumber = ""; // Formato: 56912345678 (código país + número sin +)
  const message = "Hola, necesito información sobre servicios funerarios";
  
  const handleWhatsAppClick = () => {
    if (!whatsappNumber) {
      // Si no hay número, mostrar mensaje
      alert("Próximamente: Chat de WhatsApp disponible. Por ahora usa el formulario de contacto.");
      return;
    }
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white rounded-full shadow-large hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageCircle className="w-6 h-6" />
              {/* Pulse animation */}
              <motion.span
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 0, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full bg-[#25D366]"
              />
            </>
          )}
        </motion.button>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: isOpen ? 0 : 1, x: isOpen ? 10 : 0 }}
          className="absolute right-16 top-1/2 -translate-y-1/2 bg-card border border-border rounded-lg px-4 py-2 shadow-medium whitespace-nowrap pointer-events-none"
        >
          <span className="text-sm font-medium">¿Necesitas ayuda?</span>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-2 h-2 bg-card border-r border-t border-border rotate-45" />
        </motion.div>
      </motion.div>

      {/* Expanded Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          y: isOpen ? 0 : 20,
          scale: isOpen ? 1 : 0.9,
          pointerEvents: isOpen ? "auto" : "none"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-24 right-6 z-40 w-80"
      >
        <div className="bg-card border border-border rounded-2xl shadow-large overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Sirius Atención</h3>
                <p className="text-sm text-white/80">Respuesta inmediata</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              ¿Necesitas ayuda con servicios funerarios? Estamos aquí para apoyarte.
            </p>

            {whatsappNumber ? (
              <button
                onClick={handleWhatsAppClick}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl font-medium hover:shadow-glow transition-all duration-300 hover:scale-105"
              >
                Iniciar Chat
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-muted/50 rounded-xl border border-border">
                  <p className="text-sm text-foreground font-medium mb-2">Por ahora contáctanos:</p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Formulario de contacto</li>
                    <li>• Directamente con funerarias</li>
                    <li>• Cotización online</li>
                  </ul>
                </div>
                <a
                  href="/contacto"
                  className="block w-full py-3 px-4 bg-primary text-primary-foreground text-center rounded-xl font-medium hover:shadow-glow transition-all duration-300 hover:scale-105"
                >
                  Ir a Contacto
                </a>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              Atención 24/7 · Respuesta inmediata
            </p>
          </div>
        </div>
      </motion.div>

      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
        />
      )}
    </>
  );
};
