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
  solicitante_nombre?: string | null;
  solicitante_empresa?: string | null;
  solicitante_telefono?: string | null;
  solicitante_email?: string | null;
  carta_presentacion?: string | null;
}

interface Funeraria {
  name: string;
  address: string;
  email: string | null;
  phone: string | null;
  logo_url: string | null;
}

interface Vendedor {
  nombre: string;
  apellido: string;
  email?: string | null;
  phone?: string | null;
}

export async function generateQuotePDF(quote: Quote, funeraria: Funeraria, vendedor?: Vendedor | null) {
  const doc = new jsPDF();
  
  const primaryColor: [number, number, number] = [0, 0, 0];
  const grayColor: [number, number, number] = [100, 100, 100];
  const lightGray: [number, number, number] = [245, 245, 245];
  const accentColor: [number, number, number] = [37, 99, 235];

  let yPos = 20;

  // Header con logo y datos de la funeraria
  if (funeraria.logo_url) {
    try {
      // Nota: en producción real necesitarías cargar la imagen
      // doc.addImage(funeraria.logo_url, 'PNG', 20, yPos, 40, 20);
      yPos += 25;
    } catch (error) {
      console.error("Error loading logo");
    }
  }

  doc.setFontSize(22);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text(funeraria.name, 20, yPos);
  
  yPos += 7;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  doc.text(funeraria.address, 20, yPos);
  
  if (funeraria.phone || funeraria.email) {
    yPos += 4;
    const contactInfo = [funeraria.phone, funeraria.email].filter(Boolean).join(" | ");
    doc.text(contactInfo, 20, yPos);
  }

  // Número de cotización en el lado derecho
  const rightMargin = 150;
  doc.setFontSize(14);
  doc.setTextColor(...accentColor);
  doc.setFont("helvetica", "bold");
  doc.text("COTIZACIÓN", rightMargin, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  doc.text(`N° ${quote.numero_cotizacion}`, rightMargin, 28);
  doc.text(`Fecha: ${new Date(quote.created_at).toLocaleDateString("es-CL")}`, rightMargin, 34);
  
  if (quote.valida_hasta) {
    doc.text(`Válida hasta: ${new Date(quote.valida_hasta).toLocaleDateString("es-CL")}`, rightMargin, 40);
    yPos = Math.max(yPos, 45);
  } else {
    yPos = Math.max(yPos, 40);
  }

  // Línea decorativa
  yPos += 8;
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(1);
  doc.line(20, yPos, 190, yPos);

  yPos += 12;

  // Carta de Presentación
  if (quote.carta_presentacion) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...primaryColor);
    const cartaLines = doc.splitTextToSize(quote.carta_presentacion, 170);
    doc.text(cartaLines, 20, yPos);
    yPos += cartaLines.length * 5 + 10;
  }

  // Información del solicitante y vendedor
  if ((quote.solicitante_nombre || vendedor) && yPos < 240) {
    const boxStartY = yPos;
    doc.setFillColor(...lightGray);
    doc.rect(20, boxStartY, 170, 35, "F");
    
    yPos += 8;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    
    // Solicitante
    if (quote.solicitante_nombre) {
      doc.text("SOLICITANTE:", 25, yPos);
      yPos += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...grayColor);
      doc.text(quote.solicitante_nombre, 25, yPos);
      if (quote.solicitante_empresa) {
        yPos += 4;
        doc.text(quote.solicitante_empresa, 25, yPos);
      }
      if (quote.solicitante_telefono || quote.solicitante_email) {
        yPos += 4;
        const contacto = [quote.solicitante_telefono, quote.solicitante_email].filter(Boolean).join(" | ");
        doc.text(contacto, 25, yPos);
      }
    }

    // Vendedor
    if (vendedor) {
      yPos = boxStartY + 8;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primaryColor);
      doc.text("ATENDIDO POR:", 110, yPos);
      yPos += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...grayColor);
      doc.text(`${vendedor.nombre} ${vendedor.apellido}`, 110, yPos);
      if (vendedor.email) {
        yPos += 4;
        doc.text(vendedor.email, 110, yPos);
      }
      if (vendedor.phone) {
        yPos += 4;
        doc.text(vendedor.phone, 110, yPos);
      }
    }

    yPos = boxStartY + 40;
  }

  // Tabla de items
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFillColor(...accentColor);
  doc.rect(20, yPos, 170, 8, "F");
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  
  yPos += 6;
  doc.text("DESCRIPCIÓN", 22, yPos);
  doc.text("CANT.", 115, yPos, { align: "center" });
  doc.text("P. UNIT.", 145, yPos, { align: "right" });
  doc.text("DESC.", 165, yPos, { align: "right" });
  doc.text("SUBTOTAL", 188, yPos, { align: "right" });
  
  yPos += 5;
  
  const items = Array.isArray(quote.items) ? quote.items : [];
  
  items.forEach((item: QuoteItem, index: number) => {
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }

    if (index % 2 === 0) {
      doc.setFillColor(...lightGray);
      doc.rect(20, yPos - 3, 170, item.description ? 12 : 8, "F");
    }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    
    const itemName = item.name.length > 45 ? item.name.substring(0, 45) + "..." : item.name;
    doc.text(itemName, 22, yPos);
    
    if (item.description) {
      yPos += 4;
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...grayColor);
      const desc = item.description.length > 55 ? item.description.substring(0, 55) + "..." : item.description;
      doc.text(desc, 22, yPos);
      yPos += 1;
    }
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    doc.text(item.quantity.toString(), 115, yPos, { align: "center" });
    doc.text(`$${item.price.toLocaleString("es-CL")}`, 145, yPos, { align: "right" });
    doc.text(`${item.discount}%`, 165, yPos, { align: "right" });
    
    doc.setFont("helvetica", "bold");
    doc.text(`$${item.subtotal.toLocaleString("es-CL")}`, 188, yPos, { align: "right" });
    
    yPos += item.description ? 10 : 9;
  });

  // Totales
  yPos += 5;
  doc.setLineWidth(0.5);
  doc.setDrawColor(...grayColor);
  doc.line(130, yPos, 190, yPos);
  
  yPos += 7;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  
  doc.text("Subtotal:", 135, yPos);
  doc.text(`$${quote.subtotal.toLocaleString("es-CL")}`, 188, yPos, { align: "right" });
  
  yPos += 6;
  const taxRate = quote.impuestos && quote.subtotal > 0 
    ? ((quote.impuestos / quote.subtotal) * 100).toFixed(0)
    : "19";
  doc.text(`IVA (${taxRate}%):`, 135, yPos);
  doc.text(`$${(quote.impuestos || 0).toLocaleString("es-CL")}`, 188, yPos, { align: "right" });
  
  yPos += 8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...accentColor);
  doc.text("TOTAL:", 135, yPos);
  doc.text(`$${quote.total.toLocaleString("es-CL")}`, 188, yPos, { align: "right" });

  // Términos y condiciones
  if (quote.notas) {
    yPos += 15;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("TÉRMINOS Y CONDICIONES", 20, yPos);
    
    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
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
    const footerY = doc.internal.pageSize.getHeight() - 15;
    
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      footerY,
      { align: "center" }
    );
    
    doc.setFontSize(7);
    doc.text(
      "Este documento es una cotización y no constituye un contrato vinculante.",
      doc.internal.pageSize.getWidth() / 2,
      footerY + 5,
      { align: "center" }
    );
  }

  doc.save(`Cotizacion-${quote.numero_cotizacion}.pdf`);
}
