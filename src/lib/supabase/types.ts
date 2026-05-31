// Tipos mínimos manuais. Substituir por output de `supabase gen types typescript`
// quando a CLI estiver rodando contra o projeto.

export type ProductSpecs = {
  formato_rosto?: ("oval" | "redondo" | "quadrado" | "coracao" | "diamante")[];
  estilo?: ("classico" | "moderno" | "esportivo" | "vintage")[];
  genero?: "feminino" | "masculino" | "unissex";
  tipo?: "grau" | "sol" | "ambos";
  lentes_compativeis?: string[];
  cor?: string;
};

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["categories"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };
      products: {
        Row: {
          id: string;
          slug: string;
          code: string;
          name: string;
          brand: string;
          material: string;
          price_cents: number;
          stock: number;
          images: string[];
          blur_data_url: string | null;
          specs: ProductSpecs;
          category_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["products"]["Row"],
          "id" | "created_at" | "updated_at"
        > & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      customers: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          created_at: string;
        };
        Insert: Database["public"]["Tables"]["customers"]["Row"];
        Update: Partial<Database["public"]["Tables"]["customers"]["Row"]>;
      };
      orders: {
        Row: {
          id: string;
          customer_id: string;
          status:
            | "pending"
            | "paid"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "refunded";
          total_cents: number;
          mp_payment_id: string | null;
          mp_preference_id: string | null;
          shipping_address: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["orders"]["Row"],
          "id" | "created_at" | "updated_at"
        > & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price_cents: number;
          product_snapshot: Record<string, unknown>;
        };
        Insert: Omit<Database["public"]["Tables"]["order_items"]["Row"], "id"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
      prescriptions: {
        Row: {
          id: string;
          customer_id: string;
          label: string;
          od_sphere: number | null;
          od_cylinder: number | null;
          od_axis: number | null;
          oe_sphere: number | null;
          oe_cylinder: number | null;
          oe_axis: number | null;
          add_value: number | null;
          pupillary_distance: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["prescriptions"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["prescriptions"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      confirm_order_payment: {
        Args: { p_order_id: string; p_payment_id: string };
        Returns: void;
      };
    };
    Enums: Record<string, never>;
  };
};

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type Prescription = Database["public"]["Tables"]["prescriptions"]["Row"];
