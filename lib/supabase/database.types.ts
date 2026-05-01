export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      oripa_apps: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      spend_logs: {
        Row: {
          id: string;
          oripa_app_id: string;
          amount: number;
          spend_date: string;
          memo: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          oripa_app_id: string;
          amount: number;
          spend_date: string;
          memo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          oripa_app_id?: string;
          amount?: number;
          spend_date?: string;
          memo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "spend_logs_oripa_app_id_fkey";
            columns: ["oripa_app_id"];
            referencedRelation: "oripa_apps";
            referencedColumns: ["id"];
          },
        ];
      };
      cards: {
        Row: {
          id: string;
          name: string;
          rarity: string | null;
          model_number: string | null;
          quantity: number;
          condition: string | null;
          oripa_app_id: string | null;
          current_market_price: number;
          image_url: string | null;
          memo: string | null;
          status: "holding" | "sold";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          rarity?: string | null;
          model_number?: string | null;
          quantity?: number;
          condition?: string | null;
          oripa_app_id?: string | null;
          current_market_price?: number;
          image_url?: string | null;
          memo?: string | null;
          status?: "holding" | "sold";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          rarity?: string | null;
          model_number?: string | null;
          quantity?: number;
          condition?: string | null;
          oripa_app_id?: string | null;
          current_market_price?: number;
          image_url?: string | null;
          memo?: string | null;
          status?: "holding" | "sold";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cards_oripa_app_id_fkey";
            columns: ["oripa_app_id"];
            referencedRelation: "oripa_apps";
            referencedColumns: ["id"];
          },
        ];
      };
      sales: {
        Row: {
          id: string;
          card_id: string;
          sold_price: number;
          sold_date: string;
          sold_to: string | null;
          fee: number;
          shipping: number;
          memo: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          card_id: string;
          sold_price: number;
          sold_date: string;
          sold_to?: string | null;
          fee?: number;
          shipping?: number;
          memo?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          card_id?: string;
          sold_price?: number;
          sold_date?: string;
          sold_to?: string | null;
          fee?: number;
          shipping?: number;
          memo?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sales_card_id_fkey";
            columns: ["card_id"];
            referencedRelation: "cards";
            referencedColumns: ["id"];
          },
        ];
      };
      shop_prices: {
        Row: {
          id: string;
          card_id: string;
          shop_name: string;
          buy_price: number | null;
          sell_price: number | null;
          price_date: string;
          memo: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          card_id: string;
          shop_name: string;
          buy_price?: number | null;
          sell_price?: number | null;
          price_date: string;
          memo?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          card_id?: string;
          shop_name?: string;
          buy_price?: number | null;
          sell_price?: number | null;
          price_date?: string;
          memo?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "shop_prices_card_id_fkey";
            columns: ["card_id"];
            referencedRelation: "cards";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type TableName = keyof Database["public"]["Tables"];
export type TableRow<T extends TableName> = Database["public"]["Tables"][T]["Row"];
export type TableInsert<T extends TableName> = Database["public"]["Tables"][T]["Insert"];
export type TableUpdate<T extends TableName> = Database["public"]["Tables"][T]["Update"];
