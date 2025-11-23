import jsPDF from "jspdf";

interface QuoteItem {
  name: string;
  description?: string;
  quantity: number;
  price: number;
  discount: number;
  subtotal: number;
}

interface Quote {
  numero_cotizacion: string;
  created_at: string;
  valida_hasta: string | null;
  items: QuoteItem[];
  subtotal: number;
  impuestos: number | null;
  total: number;
  notas: string | null;
  status: string | null;
}

interface Funeraria {
  name: string;
  address: string;
  email: string | null;
  phone: string | null;
  logo_url: string | null;
}

export async function generateQuotePDF(quote: Quote, funeraria: Funeraria) {
  const doc = new jsPDF();
  
  // Configuración de colores
  const primaryColor: [number, number, number] = [0, 0, 0];
  const grayColor: [number, number, number] = [128, 128, 128];
  const lightGray: [number, number, number] = [240, 240, 240];

  let yPos = 20;

  // Header - Información de la funeraria
  doc.setFontSize(20);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text(funeraria.name, 20, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  doc.text(funeraria.address, 20, yPos);
  
  if (funeraria.phone || funeraria.email) {
    yPos += 5;
    const contactInfo = [funeraria.phone, funeraria.email].filter(Boolean).join(" | ");
    doc.text(contactInfo, 20, yPos);
  }

  // Número de cotización y fecha (lado derecho)
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("COTIZACIÓN", 150, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  doc.text(`N° ${quote.numero_cotizacion}`, 150, 28);
  doc.text(`Fecha: ${new Date(quote.created_at).toLocaleDateString("es-CL")}`, 150, 35);
  
  if (quote.valida_hasta) {
    doc.text(`Válida hasta: ${new Date(quote.valida_hasta).toLocaleDateString("es-CL")}`, 150, 42);
  }

  // Línea separadora
  yPos = 55;
  doc.setDrawColor(...grayColor);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);

  // Tabla de items
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  
  // Encabezados de tabla
  doc.text("Item", 20, yPos);
  doc.text("Cant.", 110, yPos);
  doc.text("Precio Unit.", 130, yPos);
  doc.text("Desc.", 160, yPos);
  doc.text("Subtotal", 175, yPos);
  
  yPos += 3;
  doc.setLineWidth(0.3);
  doc.line(20, yPos, 190, yPos);
  
  // Items
  yPos += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  const items = Array.isArray(quote.items) ? quote.items : [];
  
  items.forEach((item: QuoteItem, index: number) => {
    // Fondo alternado para las filas
    if (index % 2 === 0) {
      doc.setFillColor(...lightGray);
      doc.rect(20, yPos - 4, 170, 8, "F");
    }
    
    doc.setTextColor(...primaryColor);
    
    // Nombre del item (con wrap si es muy largo)
    const itemName = item.name.length > 40 ? item.name.substring(0, 40) + "..." : item.name;
    doc.text(itemName, 20, yPos);
    
    // Descripción (si existe y hay espacio)
    if (item.description && item.description.length > 0) {
      doc.setFontSize(8);
      doc.setTextColor(...grayColor);
      const desc = item.description.length > 50 ? item.description.substring(0, 50) + "..." : item.description;
      doc.text(desc, 20, yPos + 3);
      doc.setFontSize(10);
      doc.setTextColor(...primaryColor);
      yPos += 3;
    }
    
    // Cantidad
    doc.text(item.quantity.toString(), 115, yPos, { align: "right" });
    
    // Precio unitario
    doc.text(`$${item.price.toLocaleString("es-CL")}`, 155, yPos, { align: "right" });
    
    // Descuento
    doc.text(`${item.discount}%`, 168, yPos, { align: "right" });
    
    // Subtotal
    doc.setFont("helvetica", "bold");
    doc.text(`$${item.subtotal.toLocaleString("es-CL")}`, 190, yPos, { align: "right" });
    doc.setFont("helvetica", "normal");
    
    yPos += 10;
    
    // Nueva página si es necesario
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
  });

  // Línea antes de totales
  yPos += 5;
  doc.setLineWidth(0.3);
  doc.line(130, yPos, 190, yPos);
  
  // Totales
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  
  doc.text("Subtotal:", 130, yPos);
  doc.text(`$${quote.subtotal.toLocaleString("es-CL")}`, 190, yPos, { align: "right" });
  
  yPos += 6;
  const taxRate = quote.impuestos && quote.subtotal > 0 
    ? ((quote.impuestos / quote.subtotal) * 100).toFixed(0)
    : "19";
  doc.text(`IVA (${taxRate}%):`, 130, yPos);
  doc.text(`$${(quote.impuestos || 0).toLocaleString("es-CL")}`, 190, yPos, { align: "right" });
  
  yPos += 8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("TOTAL:", 130, yPos);
  doc.text(`$${quote.total.toLocaleString("es-CL")}`, 190, yPos, { align: "right" });

  // Notas
  if (quote.notas) {
    yPos += 15;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Notas / Términos y Condiciones:", 20, yPos);
    
    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    
    const notesLines = doc.splitTextToSize(quote.notas, 170);
    doc.text(notesLines, 20, yPos);
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Descargar PDF
  doc.save(`Cotizacion-${quote.numero_cotizacion}.pdf`);
}
