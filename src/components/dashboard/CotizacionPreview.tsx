import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Image as ImageIcon } from "lucide-react";
import html2canvas from "html2canvas";
import { generateQuotePDF } from "@/lib/quotePDF";
import { toast } from "sonner";

interface CotizacionPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cotizacion: any;
  funeraria: any;
  vendedor?: any;
}

export function CotizacionPreview({ open, onOpenChange, cotizacion, funeraria, vendedor }: CotizacionPreviewProps) {
  const items = Array.isArray(cotizacion.items) ? cotizacion.items : [];
  const taxRate = cotizacion.impuestos && cotizacion.subtotal > 0 
    ? ((cotizacion.impuestos / cotizacion.subtotal) * 100).toFixed(0)
    : "19";

  const handleDownloadPDF = async () => {
    try {
      await generateQuotePDF(cotizacion, funeraria, vendedor);
      toast.success("PDF descargado");
    } catch (error) {
      toast.error("Error al generar PDF");
    }
  };

  const handleDownloadJPG = async () => {
    try {
      const element = document.getElementById("cotizacion-preview");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `Cotizacion-${cotizacion.numero_cotizacion}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      link.click();
      
      toast.success("Imagen descargada");
    } catch (error) {
      toast.error("Error al generar imagen");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh]">
        <div className="flex gap-2 mb-4">
          <Button onClick={handleDownloadPDF} size="sm">
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
          <Button onClick={handleDownloadJPG} size="sm" variant="outline">
            <ImageIcon className="mr-2 h-4 w-4" />
            Descargar JPG
          </Button>
        </div>

        <div className="overflow-auto max-h-[calc(95vh-8rem)]">
          <div id="cotizacion-preview" className="bg-white p-12 space-y-8" style={{ width: "794px", minHeight: "1123px" }}>
            {/* Header */}
            <div className="flex justify-between items-start border-b pb-6">
              <div>
                {funeraria.logo_url && (
                  <img src={funeraria.logo_url} alt={funeraria.name} className="h-16 mb-4" />
                )}
                <h1 className="text-2xl font-bold text-gray-900">{funeraria.name}</h1>
                <p className="text-sm text-gray-600 mt-1">{funeraria.address}</p>
                <p className="text-sm text-gray-600">
                  {[funeraria.phone, funeraria.email].filter(Boolean).join(" | ")}
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-gray-900">COTIZACIÓN</h2>
                <p className="text-sm text-gray-600 mt-2">N° {cotizacion.numero_cotizacion}</p>
                <p className="text-sm text-gray-600">
                  Fecha: {new Date(cotizacion.created_at).toLocaleDateString("es-CL")}
                </p>
                {cotizacion.valida_hasta && (
                  <p className="text-sm text-gray-600">
                    Válida hasta: {new Date(cotizacion.valida_hasta).toLocaleDateString("es-CL")}
                  </p>
                )}
              </div>
            </div>

            {/* Carta de Presentación */}
            {cotizacion.carta_presentacion && (
              <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                <p className="whitespace-pre-wrap">{cotizacion.carta_presentacion}</p>
              </div>
            )}

            {/* Información del Solicitante y Vendedor */}
            <div className="grid grid-cols-2 gap-8 py-6">
              {(cotizacion.solicitante_nombre || cotizacion.solicitante_empresa) && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">SOLICITANTE</h3>
                  {cotizacion.solicitante_nombre && (
                    <p className="text-sm text-gray-700">{cotizacion.solicitante_nombre}</p>
                  )}
                  {cotizacion.solicitante_empresa && (
                    <p className="text-sm text-gray-600">{cotizacion.solicitante_empresa}</p>
                  )}
                  {cotizacion.solicitante_telefono && (
                    <p className="text-sm text-gray-600">{cotizacion.solicitante_telefono}</p>
                  )}
                  {cotizacion.solicitante_email && (
                    <p className="text-sm text-gray-600">{cotizacion.solicitante_email}</p>
                  )}
                </div>
              )}
              
              {vendedor && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">ATENDIDO POR</h3>
                  <p className="text-sm text-gray-700">{vendedor.nombre} {vendedor.apellido}</p>
                  {vendedor.email && <p className="text-sm text-gray-600">{vendedor.email}</p>}
                  {vendedor.phone && <p className="text-sm text-gray-600">{vendedor.phone}</p>}
                </div>
              )}
            </div>

            {/* Tabla de Items */}
            <div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-900">
                    <th className="text-left py-3 font-semibold text-gray-900">ITEM</th>
                    <th className="text-center py-3 font-semibold text-gray-900">CANT.</th>
                    <th className="text-right py-3 font-semibold text-gray-900">P. UNIT.</th>
                    <th className="text-right py-3 font-semibold text-gray-900">DESC.</th>
                    <th className="text-right py-3 font-semibold text-gray-900">SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any, index: number) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                        )}
                      </td>
                      <td className="text-center text-gray-700">{item.quantity}</td>
                      <td className="text-right text-gray-700">${item.price.toLocaleString("es-CL")}</td>
                      <td className="text-right text-gray-700">{item.discount}%</td>
                      <td className="text-right font-semibold text-gray-900">${item.subtotal.toLocaleString("es-CL")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totales */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">${cotizacion.subtotal.toLocaleString("es-CL")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IVA ({taxRate}%):</span>
                  <span className="font-medium text-gray-900">${(cotizacion.impuestos || 0).toLocaleString("es-CL")}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t-2 border-gray-900 pt-2">
                  <span className="text-gray-900">TOTAL:</span>
                  <span className="text-gray-900">${cotizacion.total.toLocaleString("es-CL")}</span>
                </div>
              </div>
            </div>

            {/* Notas y Términos */}
            {cotizacion.notas && (
              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">TÉRMINOS Y CONDICIONES</h3>
                <p className="text-xs text-gray-600 whitespace-pre-wrap">{cotizacion.notas}</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 border-t pt-6">
              <p>Este documento es una cotización y no constituye un contrato.</p>
              <p>Los precios pueden variar según disponibilidad.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
