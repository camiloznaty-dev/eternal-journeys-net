export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      caso_documentos: {
        Row: {
          archivo_size: number | null
          archivo_url: string
          caso_id: string
          created_at: string | null
          descripcion: string | null
          fecha_subida: string | null
          id: string
          mime_type: string | null
          nombre: string
          subido_por: string | null
          tipo: string
          updated_at: string | null
        }
        Insert: {
          archivo_size?: number | null
          archivo_url: string
          caso_id: string
          created_at?: string | null
          descripcion?: string | null
          fecha_subida?: string | null
          id?: string
          mime_type?: string | null
          nombre: string
          subido_por?: string | null
          tipo: string
          updated_at?: string | null
        }
        Update: {
          archivo_size?: number | null
          archivo_url?: string
          caso_id?: string
          created_at?: string | null
          descripcion?: string | null
          fecha_subida?: string | null
          id?: string
          mime_type?: string | null
          nombre?: string
          subido_por?: string | null
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "caso_documentos_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos_servicios"
            referencedColumns: ["id"]
          },
        ]
      }
      casos_servicios: {
        Row: {
          cantidad_arreglos_florales: number | null
          carroza_patente: string | null
          carroza_tipo: string | null
          contratante: string | null
          contratante_email: string | null
          contratante_telefono: string | null
          created_at: string
          direccion_velorio: string | null
          fallecido_apellido: string
          fallecido_nombre: string
          familiar_a_cargo: string | null
          familiar_telefono: string | null
          fecha_fallecimiento: string
          fecha_funeral: string | null
          fecha_velorio: string | null
          funeraria_id: string
          hora_llegada: string | null
          id: string
          lead_id: string | null
          lugar_sepultacion_cremacion: string | null
          monto_total: number | null
          notas: string | null
          responsable_id: string | null
          status: string | null
          tipo_lugar_velorio: string | null
          tipo_servicio: string
          updated_at: string
          usa_cuota_mortuoria: boolean | null
          vehiculo_acompanamiento: string | null
          vehiculo_acompanamiento_patente: string | null
          vendedor_id: string | null
        }
        Insert: {
          cantidad_arreglos_florales?: number | null
          carroza_patente?: string | null
          carroza_tipo?: string | null
          contratante?: string | null
          contratante_email?: string | null
          contratante_telefono?: string | null
          created_at?: string
          direccion_velorio?: string | null
          fallecido_apellido: string
          fallecido_nombre: string
          familiar_a_cargo?: string | null
          familiar_telefono?: string | null
          fecha_fallecimiento: string
          fecha_funeral?: string | null
          fecha_velorio?: string | null
          funeraria_id: string
          hora_llegada?: string | null
          id?: string
          lead_id?: string | null
          lugar_sepultacion_cremacion?: string | null
          monto_total?: number | null
          notas?: string | null
          responsable_id?: string | null
          status?: string | null
          tipo_lugar_velorio?: string | null
          tipo_servicio: string
          updated_at?: string
          usa_cuota_mortuoria?: boolean | null
          vehiculo_acompanamiento?: string | null
          vehiculo_acompanamiento_patente?: string | null
          vendedor_id?: string | null
        }
        Update: {
          cantidad_arreglos_florales?: number | null
          carroza_patente?: string | null
          carroza_tipo?: string | null
          contratante?: string | null
          contratante_email?: string | null
          contratante_telefono?: string | null
          created_at?: string
          direccion_velorio?: string | null
          fallecido_apellido?: string
          fallecido_nombre?: string
          familiar_a_cargo?: string | null
          familiar_telefono?: string | null
          fecha_fallecimiento?: string
          fecha_funeral?: string | null
          fecha_velorio?: string | null
          funeraria_id?: string
          hora_llegada?: string | null
          id?: string
          lead_id?: string | null
          lugar_sepultacion_cremacion?: string | null
          monto_total?: number | null
          notas?: string | null
          responsable_id?: string | null
          status?: string | null
          tipo_lugar_velorio?: string | null
          tipo_servicio?: string
          updated_at?: string
          usa_cuota_mortuoria?: boolean | null
          vehiculo_acompanamiento?: string | null
          vehiculo_acompanamiento_patente?: string | null
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "casos_servicios_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["funeraria_id"]
          },
          {
            foreignKeyName: "casos_servicios_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "funerarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "casos_servicios_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "casos_servicios_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "casos_servicios_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      condolencias: {
        Row: {
          author_name: string
          created_at: string
          id: string
          message: string
          obituario_id: string
        }
        Insert: {
          author_name: string
          created_at?: string
          id?: string
          message: string
          obituario_id: string
        }
        Update: {
          author_name?: string
          created_at?: string
          id?: string
          message?: string
          obituario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "condolencias_obituario_id_fkey"
            columns: ["obituario_id"]
            isOneToOne: false
            referencedRelation: "obituarios"
            referencedColumns: ["id"]
          },
        ]
      }
      cotizaciones: {
        Row: {
          carta_presentacion: string | null
          creada_por: string | null
          created_at: string
          funeraria_id: string
          id: string
          impuestos: number | null
          items: Json
          lead_id: string | null
          notas: string | null
          numero_cotizacion: string
          solicitante_email: string | null
          solicitante_empresa: string | null
          solicitante_nombre: string | null
          solicitante_telefono: string | null
          status: string | null
          subtotal: number
          total: number
          updated_at: string
          valida_hasta: string | null
          vendedor_id: string | null
        }
        Insert: {
          carta_presentacion?: string | null
          creada_por?: string | null
          created_at?: string
          funeraria_id: string
          id?: string
          impuestos?: number | null
          items?: Json
          lead_id?: string | null
          notas?: string | null
          numero_cotizacion: string
          solicitante_email?: string | null
          solicitante_empresa?: string | null
          solicitante_nombre?: string | null
          solicitante_telefono?: string | null
          status?: string | null
          subtotal: number
          total: number
          updated_at?: string
          valida_hasta?: string | null
          vendedor_id?: string | null
        }
        Update: {
          carta_presentacion?: string | null
          creada_por?: string | null
          created_at?: string
          funeraria_id?: string
          id?: string
          impuestos?: number | null
          items?: Json
          lead_id?: string | null
          notas?: string | null
          numero_cotizacion?: string
          solicitante_email?: string | null
          solicitante_empresa?: string | null
          solicitante_nombre?: string | null
          solicitante_telefono?: string | null
          status?: string | null
          subtotal?: number
          total?: number
          updated_at?: string
          valida_hasta?: string | null
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cotizaciones_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["funeraria_id"]
          },
          {
            foreignKeyName: "cotizaciones_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "funerarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cotizaciones_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cotizaciones_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      empleados: {
        Row: {
          activo: boolean | null
          apellido: string
          created_at: string
          email: string | null
          fecha_ingreso: string | null
          funeraria_id: string
          id: string
          nombre: string
          phone: string | null
          role: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          activo?: boolean | null
          apellido: string
          created_at?: string
          email?: string | null
          fecha_ingreso?: string | null
          funeraria_id: string
          id?: string
          nombre: string
          phone?: string | null
          role: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          activo?: boolean | null
          apellido?: string
          created_at?: string
          email?: string | null
          fecha_ingreso?: string | null
          funeraria_id?: string
          id?: string
          nombre?: string
          phone?: string | null
          role?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empleados_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["funeraria_id"]
          },
          {
            foreignKeyName: "empleados_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "funerarias"
            referencedColumns: ["id"]
          },
        ]
      }
      facturas: {
        Row: {
          caso_id: string | null
          cotizacion_id: string | null
          created_at: string
          fecha_emision: string
          fecha_vencimiento: string | null
          funeraria_id: string
          id: string
          impuestos: number | null
          items: Json
          metodo_pago: string | null
          notas: string | null
          numero_factura: string
          status: string | null
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          caso_id?: string | null
          cotizacion_id?: string | null
          created_at?: string
          fecha_emision: string
          fecha_vencimiento?: string | null
          funeraria_id: string
          id?: string
          impuestos?: number | null
          items?: Json
          metodo_pago?: string | null
          notas?: string | null
          numero_factura: string
          status?: string | null
          subtotal: number
          total: number
          updated_at?: string
        }
        Update: {
          caso_id?: string | null
          cotizacion_id?: string | null
          created_at?: string
          fecha_emision?: string
          fecha_vencimiento?: string | null
          funeraria_id?: string
          id?: string
          impuestos?: number | null
          items?: Json
          metodo_pago?: string | null
          notas?: string | null
          numero_factura?: string
          status?: string | null
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "facturas_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos_servicios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facturas_cotizacion_id_fkey"
            columns: ["cotizacion_id"]
            isOneToOne: false
            referencedRelation: "cotizaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facturas_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["funeraria_id"]
          },
          {
            foreignKeyName: "facturas_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "funerarias"
            referencedColumns: ["id"]
          },
        ]
      }
      funerarias: {
        Row: {
          about_text: string | null
          address: string
          created_at: string
          description: string | null
          email: string | null
          employee_count_range: string | null
          facebook_url: string | null
          gallery_images: string[] | null
          hero_image_url: string | null
          horarios: string | null
          id: string
          instagram_url: string | null
          lat: number | null
          legal_rep_name: string | null
          legal_rep_position: string | null
          legal_rep_rut: string | null
          lng: number | null
          logo_url: string | null
          name: string
          phone: string | null
          primary_color: string | null
          rating: number | null
          registrant_type: string | null
          secondary_color: string | null
          slug: string | null
          updated_at: string
          website_active: boolean | null
        }
        Insert: {
          about_text?: string | null
          address: string
          created_at?: string
          description?: string | null
          email?: string | null
          employee_count_range?: string | null
          facebook_url?: string | null
          gallery_images?: string[] | null
          hero_image_url?: string | null
          horarios?: string | null
          id?: string
          instagram_url?: string | null
          lat?: number | null
          legal_rep_name?: string | null
          legal_rep_position?: string | null
          legal_rep_rut?: string | null
          lng?: number | null
          logo_url?: string | null
          name: string
          phone?: string | null
          primary_color?: string | null
          rating?: number | null
          registrant_type?: string | null
          secondary_color?: string | null
          slug?: string | null
          updated_at?: string
          website_active?: boolean | null
        }
        Update: {
          about_text?: string | null
          address?: string
          created_at?: string
          description?: string | null
          email?: string | null
          employee_count_range?: string | null
          facebook_url?: string | null
          gallery_images?: string[] | null
          hero_image_url?: string | null
          horarios?: string | null
          id?: string
          instagram_url?: string | null
          lat?: number | null
          legal_rep_name?: string | null
          legal_rep_position?: string | null
          legal_rep_rut?: string | null
          lng?: number | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          primary_color?: string | null
          rating?: number | null
          registrant_type?: string | null
          secondary_color?: string | null
          slug?: string | null
          updated_at?: string
          website_active?: boolean | null
        }
        Relationships: []
      }
      interacciones: {
        Row: {
          created_at: string
          descripcion: string
          fecha: string
          id: string
          lead_id: string
          realizada_por: string | null
          tipo: string
        }
        Insert: {
          created_at?: string
          descripcion: string
          fecha?: string
          id?: string
          lead_id: string
          realizada_por?: string | null
          tipo: string
        }
        Update: {
          created_at?: string
          descripcion?: string
          fecha?: string
          id?: string
          lead_id?: string
          realizada_por?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "interacciones_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          comuna: string | null
          converted_to_caso_id: string | null
          created_at: string
          email: string | null
          estimated_value: number | null
          funeraria_id: string
          id: string
          last_contact_date: string | null
          name: string
          next_followup_date: string | null
          notes: string | null
          phone: string
          priority: string | null
          source: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          comuna?: string | null
          converted_to_caso_id?: string | null
          created_at?: string
          email?: string | null
          estimated_value?: number | null
          funeraria_id: string
          id?: string
          last_contact_date?: string | null
          name: string
          next_followup_date?: string | null
          notes?: string | null
          phone: string
          priority?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          comuna?: string | null
          converted_to_caso_id?: string | null
          created_at?: string
          email?: string | null
          estimated_value?: number | null
          funeraria_id?: string
          id?: string
          last_contact_date?: string | null
          name?: string
          next_followup_date?: string | null
          notes?: string | null
          phone?: string
          priority?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_converted_to_caso_id_fkey"
            columns: ["converted_to_caso_id"]
            isOneToOne: false
            referencedRelation: "casos_servicios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["funeraria_id"]
          },
          {
            foreignKeyName: "leads_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "funerarias"
            referencedColumns: ["id"]
          },
        ]
      }
      movimientos_inventario: {
        Row: {
          cantidad: number
          caso_id: string | null
          created_at: string
          id: string
          motivo: string | null
          producto_id: string
          realizado_por: string | null
          stock_anterior: number
          stock_nuevo: number
          tipo: string
        }
        Insert: {
          cantidad: number
          caso_id?: string | null
          created_at?: string
          id?: string
          motivo?: string | null
          producto_id: string
          realizado_por?: string | null
          stock_anterior: number
          stock_nuevo: number
          tipo: string
        }
        Update: {
          cantidad?: number
          caso_id?: string | null
          created_at?: string
          id?: string
          motivo?: string | null
          producto_id?: string
          realizado_por?: string | null
          stock_anterior?: number
          stock_nuevo?: number
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "movimientos_inventario_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos_servicios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimientos_inventario_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      obituarios: {
        Row: {
          biography: string | null
          birth_date: string
          caso_id: string | null
          created_at: string
          death_date: string
          funeraria_id: string | null
          gallery: string[] | null
          id: string
          is_premium: boolean | null
          name: string
          photo_url: string | null
          updated_at: string
          views: number | null
        }
        Insert: {
          biography?: string | null
          birth_date: string
          caso_id?: string | null
          created_at?: string
          death_date: string
          funeraria_id?: string | null
          gallery?: string[] | null
          id?: string
          is_premium?: boolean | null
          name: string
          photo_url?: string | null
          updated_at?: string
          views?: number | null
        }
        Update: {
          biography?: string | null
          birth_date?: string
          caso_id?: string | null
          created_at?: string
          death_date?: string
          funeraria_id?: string | null
          gallery?: string[] | null
          id?: string
          is_premium?: boolean | null
          name?: string
          photo_url?: string | null
          updated_at?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "obituarios_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos_servicios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "obituarios_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["funeraria_id"]
          },
          {
            foreignKeyName: "obituarios_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "funerarias"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          funeraria_id: string
          id: string
          items: Json
          status: Database["public"]["Enums"]["order_status"]
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          funeraria_id: string
          id?: string
          items?: Json
          status?: Database["public"]["Enums"]["order_status"]
          total: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          funeraria_id?: string
          id?: string
          items?: Json
          status?: Database["public"]["Enums"]["order_status"]
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["funeraria_id"]
          },
          {
            foreignKeyName: "pedidos_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "funerarias"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          category: Database["public"]["Enums"]["product_category"]
          costo: number | null
          created_at: string
          description: string | null
          funeraria_id: string | null
          id: string
          images: string[] | null
          name: string
          price: number
          proveedor_id: string | null
          sku: string | null
          stock: number | null
          stock_minimo: number | null
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["product_category"]
          costo?: number | null
          created_at?: string
          description?: string | null
          funeraria_id?: string | null
          id?: string
          images?: string[] | null
          name: string
          price: number
          proveedor_id?: string | null
          sku?: string | null
          stock?: number | null
          stock_minimo?: number | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["product_category"]
          costo?: number | null
          created_at?: string
          description?: string | null
          funeraria_id?: string | null
          id?: string
          images?: string[] | null
          name?: string
          price?: number
          proveedor_id?: string | null
          sku?: string | null
          stock?: number | null
          stock_minimo?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "productos_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["funeraria_id"]
          },
          {
            foreignKeyName: "productos_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "funerarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      proveedor_documentos: {
        Row: {
          archivo_size: number | null
          archivo_url: string
          created_at: string | null
          descripcion: string | null
          fecha_subida: string | null
          fecha_vencimiento: string | null
          id: string
          nombre: string
          proveedor_id: string
          subido_por: string | null
          tipo: string
          updated_at: string | null
        }
        Insert: {
          archivo_size?: number | null
          archivo_url: string
          created_at?: string | null
          descripcion?: string | null
          fecha_subida?: string | null
          fecha_vencimiento?: string | null
          id?: string
          nombre: string
          proveedor_id: string
          subido_por?: string | null
          tipo: string
          updated_at?: string | null
        }
        Update: {
          archivo_size?: number | null
          archivo_url?: string
          created_at?: string | null
          descripcion?: string | null
          fecha_subida?: string | null
          fecha_vencimiento?: string | null
          id?: string
          nombre?: string
          proveedor_id?: string
          subido_por?: string | null
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proveedor_documentos_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
        ]
      }
      proveedor_pagos: {
        Row: {
          comprobante_url: string | null
          created_at: string | null
          fecha_pago: string
          fecha_vencimiento: string | null
          id: string
          metodo_pago: string | null
          monto: number
          notas: string | null
          numero_referencia: string | null
          pedido_id: string | null
          proveedor_id: string
          registrado_por: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          comprobante_url?: string | null
          created_at?: string | null
          fecha_pago?: string
          fecha_vencimiento?: string | null
          id?: string
          metodo_pago?: string | null
          monto: number
          notas?: string | null
          numero_referencia?: string | null
          pedido_id?: string | null
          proveedor_id: string
          registrado_por?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          comprobante_url?: string | null
          created_at?: string | null
          fecha_pago?: string
          fecha_vencimiento?: string | null
          id?: string
          metodo_pago?: string | null
          monto?: number
          notas?: string | null
          numero_referencia?: string | null
          pedido_id?: string | null
          proveedor_id?: string
          registrado_por?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proveedor_pagos_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "proveedor_pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proveedor_pagos_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
        ]
      }
      proveedor_pedidos: {
        Row: {
          creado_por: string | null
          created_at: string | null
          fecha_entrega_estimada: string | null
          fecha_entrega_real: string | null
          fecha_pedido: string
          id: string
          impuestos: number | null
          items: Json | null
          notas: string | null
          numero_pedido: string
          proveedor_id: string
          status: string | null
          subtotal: number
          total: number
          updated_at: string | null
        }
        Insert: {
          creado_por?: string | null
          created_at?: string | null
          fecha_entrega_estimada?: string | null
          fecha_entrega_real?: string | null
          fecha_pedido?: string
          id?: string
          impuestos?: number | null
          items?: Json | null
          notas?: string | null
          numero_pedido: string
          proveedor_id: string
          status?: string | null
          subtotal?: number
          total?: number
          updated_at?: string | null
        }
        Update: {
          creado_por?: string | null
          created_at?: string | null
          fecha_entrega_estimada?: string | null
          fecha_entrega_real?: string | null
          fecha_pedido?: string
          id?: string
          impuestos?: number | null
          items?: Json | null
          notas?: string | null
          numero_pedido?: string
          proveedor_id?: string
          status?: string | null
          subtotal?: number
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proveedor_pedidos_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
        ]
      }
      proveedor_recordatorios: {
        Row: {
          asignado_a: string | null
          completado: boolean | null
          creado_por: string | null
          created_at: string | null
          descripcion: string | null
          fecha_recordatorio: string
          id: string
          prioridad: string | null
          proveedor_id: string
          tipo: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          asignado_a?: string | null
          completado?: boolean | null
          creado_por?: string | null
          created_at?: string | null
          descripcion?: string | null
          fecha_recordatorio: string
          id?: string
          prioridad?: string | null
          proveedor_id: string
          tipo?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          asignado_a?: string | null
          completado?: boolean | null
          creado_por?: string | null
          created_at?: string | null
          descripcion?: string | null
          fecha_recordatorio?: string
          id?: string
          prioridad?: string | null
          proveedor_id?: string
          tipo?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proveedor_recordatorios_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
        ]
      }
      proveedores: {
        Row: {
          activo: boolean | null
          categoria: string | null
          contacto_nombre: string | null
          created_at: string
          direccion: string | null
          email: string | null
          funeraria_id: string
          id: string
          nombre: string
          phone: string | null
          rut: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean | null
          categoria?: string | null
          contacto_nombre?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          funeraria_id: string
          id?: string
          nombre: string
          phone?: string | null
          rut?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean | null
          categoria?: string | null
          contacto_nombre?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          funeraria_id?: string
          id?: string
          nombre?: string
          phone?: string | null
          rut?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proveedores_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["funeraria_id"]
          },
          {
            foreignKeyName: "proveedores_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "funerarias"
            referencedColumns: ["id"]
          },
        ]
      }
      servicios: {
        Row: {
          category: Database["public"]["Enums"]["service_category"]
          created_at: string
          description: string | null
          duration: string | null
          features: Json | null
          funeraria_id: string | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          name: string
          price: number
          sku: string | null
          stock_available: boolean | null
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["service_category"]
          created_at?: string
          description?: string | null
          duration?: string | null
          features?: Json | null
          funeraria_id?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          name: string
          price: number
          sku?: string | null
          stock_available?: boolean | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["service_category"]
          created_at?: string
          description?: string | null
          duration?: string | null
          features?: Json | null
          funeraria_id?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          name?: string
          price?: number
          sku?: string | null
          stock_available?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "servicios_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["funeraria_id"]
          },
          {
            foreignKeyName: "servicios_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "funerarias"
            referencedColumns: ["id"]
          },
        ]
      }
      tareas_caso: {
        Row: {
          asignado_a: string | null
          caso_id: string
          completada: boolean | null
          created_at: string
          descripcion: string | null
          fecha_limite: string | null
          id: string
          prioridad: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          asignado_a?: string | null
          caso_id: string
          completada?: boolean | null
          created_at?: string
          descripcion?: string | null
          fecha_limite?: string | null
          id?: string
          prioridad?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          asignado_a?: string | null
          caso_id?: string
          completada?: boolean | null
          created_at?: string
          descripcion?: string | null
          fecha_limite?: string | null
          id?: string
          prioridad?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tareas_caso_asignado_a_fkey"
            columns: ["asignado_a"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tareas_caso_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos_servicios"
            referencedColumns: ["id"]
          },
        ]
      }
      turnos: {
        Row: {
          created_at: string
          empleado_id: string
          fecha: string
          hora_fin: string
          hora_inicio: string
          id: string
          notas: string | null
          tipo: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          empleado_id: string
          fecha: string
          hora_fin: string
          hora_inicio: string
          id?: string
          notas?: string | null
          tipo?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          empleado_id?: string
          fecha?: string
          hora_fin?: string
          hora_inicio?: string
          id?: string
          notas?: string | null
          tipo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "turnos_empleado_id_fkey"
            columns: ["empleado_id"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      dashboard_stats: {
        Row: {
          casos_activos: number | null
          empleados_activos: number | null
          funeraria_id: string | null
          ingresos_mes: number | null
          leads_mes: number | null
          leads_nuevos: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_funeraria_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "cliente" | "funeraria"
      order_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
      product_category:
        | "ataud"
        | "cremacion"
        | "traslado"
        | "flores"
        | "servicio_completo"
        | "urna"
        | "lapida"
        | "otro"
      service_category:
        | "plan_funerario"
        | "traslado"
        | "cremacion"
        | "arreglo_floral"
        | "velorio"
        | "ceremonia"
        | "lapida"
        | "urna"
        | "otro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["cliente", "funeraria"],
      order_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      product_category: [
        "ataud",
        "cremacion",
        "traslado",
        "flores",
        "servicio_completo",
        "urna",
        "lapida",
        "otro",
      ],
      service_category: [
        "plan_funerario",
        "traslado",
        "cremacion",
        "arreglo_floral",
        "velorio",
        "ceremonia",
        "lapida",
        "urna",
        "otro",
      ],
    },
  },
} as const
