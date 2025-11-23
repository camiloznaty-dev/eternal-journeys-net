// Tipos personalizados para cotizaciones
// Evita dependencias circulares con tipos auto-generados

export interface QuoteItem {
  id: string;
  type: "producto" | "servicio";
  item_id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  discount: number;
  subtotal: number;
}

export interface Cotizacion {
  id?: string;
  numero_cotizacion: string;
  lead_id?: string | null;
  items: QuoteItem[] | any;
  subtotal: number;
  impuestos: number | null;
  total: number;
  status?: string | null;
  valida_hasta?: string | null;
  notas?: string | null;
  created_at?: string;
  funeraria_id?: string;
  creada_por?: string;
  solicitante_nombre?: string | null;
  solicitante_empresa?: string | null;
  solicitante_telefono?: string | null;
  solicitante_email?: string | null;
  vendedor_id?: string | null;
  carta_presentacion?: string | null;
}

export interface Funeraria {
  id?: string;
  name: string;
  address: string;
  email?: string | null;
  phone?: string | null;
  logo_url?: string | null;
}

export interface Vendedor {
  id?: string;
  nombre: string;
  apellido: string;
  email?: string | null;
  phone?: string | null;
}
