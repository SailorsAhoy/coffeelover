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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      academies: {
        Row: {
          country: string | null
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          owner_user_id: string | null
          slug: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_user_id?: string | null
          slug?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_user_id?: string | null
          slug?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      accessories: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          manufacturer_id: string | null
          name: string
          price: number | null
          seller_url: string | null
          service_company_id: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          manufacturer_id?: string | null
          name: string
          price?: number | null
          seller_url?: string | null
          service_company_id?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          manufacturer_id?: string | null
          name?: string
          price?: number | null
          seller_url?: string | null
          service_company_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accessories_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accessories_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturers_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accessories_service_company_id_fkey"
            columns: ["service_company_id"]
            isOneToOne: false
            referencedRelation: "service_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accessories_service_company_id_fkey"
            columns: ["service_company_id"]
            isOneToOne: false
            referencedRelation: "service_companies_public"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_log: {
        Row: {
          action: string
          actor_email: string | null
          actor_user_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
          shop_id: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
          shop_id?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
          shop_id?: string | null
        }
        Relationships: []
      }
      addresses: {
        Row: {
          city: string
          country_id: string
          created_at: string
          id: string
          is_primary: boolean | null
          latitude: number | null
          longitude: number | null
          postal_code: string
          state_province: string | null
          street_address: string
          updated_at: string
          user_id: string
        }
        Insert: {
          city: string
          country_id: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
          latitude?: number | null
          longitude?: number | null
          postal_code: string
          state_province?: string | null
          street_address: string
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string
          country_id?: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
          latitude?: number | null
          longitude?: number | null
          postal_code?: string
          state_province?: string | null
          street_address?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          banner_url: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          overlay_color: string
          overlay_opacity: number
          slug: string
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          overlay_color?: string
          overlay_opacity?: number
          slug: string
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          overlay_color?: string
          overlay_opacity?: number
          slug?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string
          banner_url: string | null
          category_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          author_id: string
          banner_url?: string | null
          category_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          author_id?: string
          banner_url?: string | null
          category_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      brew_sessions: {
        Row: {
          acidity_score: number | null
          aroma_score: number | null
          bitterness_score: number | null
          body_score: number | null
          brew_date: string
          brew_method: Database["public"]["Enums"]["brew_method"]
          brew_weight_grams: number | null
          coffee_dose_grams: number | null
          coffee_to_brew_ratio: string | null
          coffee_to_water_ratio: string | null
          created_at: string
          equipment_ids: string[] | null
          extraction_time_seconds: number | null
          extraction_yield_percentage: number | null
          flavor_profile_accuracy: string | null
          grind_setting: string | null
          id: string
          notes: string | null
          overall_rating: number | null
          sweetness_score: number | null
          tds_percentage: number | null
          updated_at: string
          user_coffee_product_id: string | null
          user_id: string
          water_amount_grams: number | null
          water_temp_celsius: number | null
        }
        Insert: {
          acidity_score?: number | null
          aroma_score?: number | null
          bitterness_score?: number | null
          body_score?: number | null
          brew_date?: string
          brew_method: Database["public"]["Enums"]["brew_method"]
          brew_weight_grams?: number | null
          coffee_dose_grams?: number | null
          coffee_to_brew_ratio?: string | null
          coffee_to_water_ratio?: string | null
          created_at?: string
          equipment_ids?: string[] | null
          extraction_time_seconds?: number | null
          extraction_yield_percentage?: number | null
          flavor_profile_accuracy?: string | null
          grind_setting?: string | null
          id?: string
          notes?: string | null
          overall_rating?: number | null
          sweetness_score?: number | null
          tds_percentage?: number | null
          updated_at?: string
          user_coffee_product_id?: string | null
          user_id: string
          water_amount_grams?: number | null
          water_temp_celsius?: number | null
        }
        Update: {
          acidity_score?: number | null
          aroma_score?: number | null
          bitterness_score?: number | null
          body_score?: number | null
          brew_date?: string
          brew_method?: Database["public"]["Enums"]["brew_method"]
          brew_weight_grams?: number | null
          coffee_dose_grams?: number | null
          coffee_to_brew_ratio?: string | null
          coffee_to_water_ratio?: string | null
          created_at?: string
          equipment_ids?: string[] | null
          extraction_time_seconds?: number | null
          extraction_yield_percentage?: number | null
          flavor_profile_accuracy?: string | null
          grind_setting?: string | null
          id?: string
          notes?: string | null
          overall_rating?: number | null
          sweetness_score?: number | null
          tds_percentage?: number | null
          updated_at?: string
          user_coffee_product_id?: string | null
          user_id?: string
          water_amount_grams?: number | null
          water_temp_celsius?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "brew_sessions_user_coffee_product_id_fkey"
            columns: ["user_coffee_product_id"]
            isOneToOne: false
            referencedRelation: "user_coffee_products"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          body: string
          chat_id: string
          created_at: string
          id: string
          sender_user_id: string
        }
        Insert: {
          body: string
          chat_id: string
          created_at?: string
          id?: string
          sender_user_id: string
        }
        Update: {
          body?: string
          chat_id?: string
          created_at?: string
          id?: string
          sender_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          chat_id: string
          created_at: string
          id: string
          last_read_at: string
          user_id: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          id?: string
          last_read_at?: string
          user_id: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          id?: string
          last_read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_group: boolean
          title: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_group?: boolean
          title?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_group?: boolean
          title?: string | null
        }
        Relationships: []
      }
      coffee_brands: {
        Row: {
          affiliate_link: string | null
          coffee_type: Database["public"]["Enums"]["coffee_type"] | null
          created_at: string
          currency: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          origin_country: string | null
          price_per_kg: number | null
          process: string | null
          product_url: string | null
          roast_level: Database["public"]["Enums"]["roast_level"] | null
          roaster_id: string | null
          serviced_countries: string[] | null
          shop_id: string | null
          updated_at: string
          variety: string | null
        }
        Insert: {
          affiliate_link?: string | null
          coffee_type?: Database["public"]["Enums"]["coffee_type"] | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
          origin_country?: string | null
          price_per_kg?: number | null
          process?: string | null
          product_url?: string | null
          roast_level?: Database["public"]["Enums"]["roast_level"] | null
          roaster_id?: string | null
          serviced_countries?: string[] | null
          shop_id?: string | null
          updated_at?: string
          variety?: string | null
        }
        Update: {
          affiliate_link?: string | null
          coffee_type?: Database["public"]["Enums"]["coffee_type"] | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          origin_country?: string | null
          price_per_kg?: number | null
          process?: string | null
          product_url?: string | null
          roast_level?: Database["public"]["Enums"]["roast_level"] | null
          roaster_id?: string | null
          serviced_countries?: string[] | null
          shop_id?: string | null
          updated_at?: string
          variety?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coffee_brands_roaster_id_fkey"
            columns: ["roaster_id"]
            isOneToOne: false
            referencedRelation: "roasters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coffee_brands_roaster_id_fkey"
            columns: ["roaster_id"]
            isOneToOne: false
            referencedRelation: "roasters_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coffee_brands_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coffee_brands_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops_public"
            referencedColumns: ["id"]
          },
        ]
      }
      coffee_shop_profiles: {
        Row: {
          address_id: string | null
          business_name: string
          created_at: string
          description: string | null
          email: string | null
          facebook_url: string | null
          has_bakery: boolean | null
          has_outdoor_seating: boolean | null
          has_wifi: boolean | null
          id: string
          instagram_url: string | null
          logo_url: string | null
          opening_hours: Json | null
          phone: string | null
          shop_type_id: string | null
          twitter_url: string | null
          updated_at: string
          user_id: string
          website_url: string | null
          whatsapp: string | null
        }
        Insert: {
          address_id?: string | null
          business_name: string
          created_at?: string
          description?: string | null
          email?: string | null
          facebook_url?: string | null
          has_bakery?: boolean | null
          has_outdoor_seating?: boolean | null
          has_wifi?: boolean | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          opening_hours?: Json | null
          phone?: string | null
          shop_type_id?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
          whatsapp?: string | null
        }
        Update: {
          address_id?: string | null
          business_name?: string
          created_at?: string
          description?: string | null
          email?: string | null
          facebook_url?: string | null
          has_bakery?: boolean | null
          has_outdoor_seating?: boolean | null
          has_wifi?: boolean | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          opening_hours?: Json | null
          phone?: string | null
          shop_type_id?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coffee_shop_profiles_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coffee_shop_profiles_shop_type_id_fkey"
            columns: ["shop_type_id"]
            isOneToOne: false
            referencedRelation: "shop_types"
            referencedColumns: ["id"]
          },
        ]
      }
      company_members: {
        Row: {
          company_user_id: string
          created_at: string
          id: string
          member_user_id: string
          status: string
          title: string | null
          updated_at: string
        }
        Insert: {
          company_user_id: string
          created_at?: string
          id?: string
          member_user_id: string
          status?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          company_user_id?: string
          created_at?: string
          id?: string
          member_user_id?: string
          status?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      course_favorites: {
        Row: {
          course_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      course_progress: {
        Row: {
          completed: boolean
          course_id: string
          created_at: string
          id: string
          last_accessed_at: string
          progress_percentage: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          course_id: string
          created_at?: string
          id?: string
          last_accessed_at?: string
          progress_percentage?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          course_id?: string
          created_at?: string
          id?: string
          last_accessed_at?: string
          progress_percentage?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          academy_id: string | null
          created_at: string
          description: string | null
          duration_min: number | null
          id: string
          image_url: string | null
          instructor_id: string | null
          level: string | null
          slug: string | null
          title: string
          updated_at: string
        }
        Insert: {
          academy_id?: string | null
          created_at?: string
          description?: string | null
          duration_min?: number | null
          id?: string
          image_url?: string | null
          instructor_id?: string | null
          level?: string | null
          slug?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          academy_id?: string | null
          created_at?: string
          description?: string | null
          duration_min?: number | null
          id?: string
          image_url?: string | null
          instructor_id?: string | null
          level?: string | null
          slug?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors_public"
            referencedColumns: ["id"]
          },
        ]
      }
      field_permissions: {
        Row: {
          can_edit: boolean
          category: string
          created_at: string
          field_key: string
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          can_edit?: boolean
          category: string
          created_at?: string
          field_key: string
          id?: string
          role: string
          updated_at?: string
        }
        Update: {
          can_edit?: boolean
          category?: string
          created_at?: string
          field_key?: string
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          followee_user_id: string
          follower_user_id: string
          id: string
        }
        Insert: {
          created_at?: string
          followee_user_id: string
          follower_user_id: string
          id?: string
        }
        Update: {
          created_at?: string
          followee_user_id?: string
          follower_user_id?: string
          id?: string
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          author_user_id: string
          body: string
          created_at: string
          id: string
          thread_id: string
        }
        Insert: {
          author_user_id: string
          body: string
          created_at?: string
          id?: string
          thread_id: string
        }
        Update: {
          author_user_id?: string
          body?: string
          created_at?: string
          id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_threads: {
        Row: {
          author_user_id: string
          body: string | null
          created_at: string
          group_id: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          author_user_id: string
          body?: string | null
          created_at?: string
          group_id?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_user_id?: string
          body?: string | null
          created_at?: string
          group_id?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_threads_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "social_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string
          friend_user_id: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_user_id: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_user_id?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          created_at: string
          group_id: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "social_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      import_audit_log: {
        Row: {
          actor_email: string | null
          actor_user_id: string
          category: string
          created_at: string
          error_preview: Json | null
          file_name: string | null
          id: string
          inserted_count: number
          skipped_count: number
          table_name: string
          total_rows: number
        }
        Insert: {
          actor_email?: string | null
          actor_user_id: string
          category: string
          created_at?: string
          error_preview?: Json | null
          file_name?: string | null
          id?: string
          inserted_count?: number
          skipped_count?: number
          table_name: string
          total_rows?: number
        }
        Update: {
          actor_email?: string | null
          actor_user_id?: string
          category?: string
          created_at?: string
          error_preview?: Json | null
          file_name?: string | null
          id?: string
          inserted_count?: number
          skipped_count?: number
          table_name?: string
          total_rows?: number
        }
        Relationships: []
      }
      instructors: {
        Row: {
          academy_id: string | null
          bio: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          photo_url: string | null
          slug: string | null
          updated_at: string
        }
        Insert: {
          academy_id?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          photo_url?: string | null
          slug?: string | null
          updated_at?: string
        }
        Update: {
          academy_id?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          photo_url?: string | null
          slug?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructors_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_claims: {
        Row: {
          claimant_user_id: string
          created_at: string
          id: string
          listing_id: string
          listing_type: string
          note: string | null
          requested_role: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          claimant_user_id: string
          created_at?: string
          id?: string
          listing_id: string
          listing_type: string
          note?: string | null
          requested_role?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          claimant_user_id?: string
          created_at?: string
          id?: string
          listing_id?: string
          listing_type?: string
          note?: string | null
          requested_role?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      machine_brands: {
        Row: {
          created_at: string
          id: string
          name: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          website_url?: string | null
        }
        Relationships: []
      }
      machines: {
        Row: {
          brand_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          machine_type: Database["public"]["Enums"]["machine_type"]
          manufacturer_id: string | null
          name: string
          price: number | null
          seller_url: string | null
          service_company_id: string | null
          updated_at: string
        }
        Insert: {
          brand_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          machine_type: Database["public"]["Enums"]["machine_type"]
          manufacturer_id?: string | null
          name: string
          price?: number | null
          seller_url?: string | null
          service_company_id?: string | null
          updated_at?: string
        }
        Update: {
          brand_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          machine_type?: Database["public"]["Enums"]["machine_type"]
          manufacturer_id?: string | null
          name?: string
          price?: number | null
          seller_url?: string | null
          service_company_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "machines_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "machine_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machines_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machines_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturers_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machines_service_company_id_fkey"
            columns: ["service_company_id"]
            isOneToOne: false
            referencedRelation: "service_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machines_service_company_id_fkey"
            columns: ["service_company_id"]
            isOneToOne: false
            referencedRelation: "service_companies_public"
            referencedColumns: ["id"]
          },
        ]
      }
      manufacturer_products: {
        Row: {
          base_price: number | null
          category: string | null
          created_at: string
          currency: string | null
          description: string | null
          id: string
          image_url: string | null
          is_published: boolean
          manufacturer_user_id: string
          name: string
          updated_at: string
        }
        Insert: {
          base_price?: number | null
          category?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          manufacturer_user_id: string
          name: string
          updated_at?: string
        }
        Update: {
          base_price?: number | null
          category?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          manufacturer_user_id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      manufacturers: {
        Row: {
          business_name: string
          country: string | null
          created_at: string
          created_by: string | null
          description: string | null
          email: string | null
          id: string
          logo_url: string | null
          owner_user_id: string | null
          phone: string | null
          slug: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          business_name: string
          country?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          owner_user_id?: string | null
          phone?: string | null
          slug?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          business_name?: string
          country?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          owner_user_id?: string | null
          phone?: string | null
          slug?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          data: Json
          id: string
          link: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          data?: Json
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          data?: Json
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      preparation_guides: {
        Row: {
          brew_time_seconds: number | null
          coffee_to_water_ratio: string | null
          coffee_type: Database["public"]["Enums"]["coffee_type"] | null
          created_at: string
          description: string | null
          grind_size: string | null
          id: string
          image_url: string | null
          instructions: string
          machine_type: Database["public"]["Enums"]["machine_type"]
          title: string
          updated_at: string
          water_temp_celsius: number | null
        }
        Insert: {
          brew_time_seconds?: number | null
          coffee_to_water_ratio?: string | null
          coffee_type?: Database["public"]["Enums"]["coffee_type"] | null
          created_at?: string
          description?: string | null
          grind_size?: string | null
          id?: string
          image_url?: string | null
          instructions: string
          machine_type: Database["public"]["Enums"]["machine_type"]
          title: string
          updated_at?: string
          water_temp_celsius?: number | null
        }
        Update: {
          brew_time_seconds?: number | null
          coffee_to_water_ratio?: string | null
          coffee_type?: Database["public"]["Enums"]["coffee_type"] | null
          created_at?: string
          description?: string | null
          grind_size?: string | null
          id?: string
          image_url?: string | null
          instructions?: string
          machine_type?: Database["public"]["Enums"]["machine_type"]
          title?: string
          updated_at?: string
          water_temp_celsius?: number | null
        }
        Relationships: []
      }
      producer_profiles: {
        Row: {
          business_name: string
          certifications: string[] | null
          created_at: string
          description: string | null
          farm_size_hectares: number | null
          id: string
          logo_url: string | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          business_name: string
          certifications?: string[] | null
          created_at?: string
          description?: string | null
          farm_size_hectares?: number | null
          id?: string
          logo_url?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          business_name?: string
          certifications?: string[] | null
          created_at?: string
          description?: string | null
          farm_size_hectares?: number | null
          id?: string
          logo_url?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          marketing_opt_out: boolean
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          marketing_opt_out?: boolean
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          marketing_opt_out?: boolean
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recipes: {
        Row: {
          beverage_type: string | null
          brew_method: string | null
          coffee_brand_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty: string | null
          flavors: string[]
          id: string
          image_url: string | null
          ingredients: Json
          instructions: string
          prep_time_minutes: number | null
          servings: number | null
          temperature: string | null
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          beverage_type?: string | null
          brew_method?: string | null
          coffee_brand_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          flavors?: string[]
          id?: string
          image_url?: string | null
          ingredients: Json
          instructions: string
          prep_time_minutes?: number | null
          servings?: number | null
          temperature?: string | null
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          beverage_type?: string | null
          brew_method?: string | null
          coffee_brand_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          flavors?: string[]
          id?: string
          image_url?: string | null
          ingredients?: Json
          instructions?: string
          prep_time_minutes?: number | null
          servings?: number | null
          temperature?: string | null
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "recipes_coffee_brand_id_fkey"
            columns: ["coffee_brand_id"]
            isOneToOne: false
            referencedRelation: "coffee_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          reviewable_id: string
          reviewable_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          reviewable_id: string
          reviewable_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          reviewable_id?: string
          reviewable_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      roaster_profiles: {
        Row: {
          business_name: string
          created_at: string
          description: string | null
          email: string | null
          facebook_url: string | null
          has_discount_coupons: boolean | null
          id: string
          instagram_url: string | null
          logo_url: string | null
          offers_free_shipping: boolean | null
          phone: string | null
          shop_type_id: string | null
          twitter_url: string | null
          updated_at: string
          user_id: string
          website_url: string | null
          whatsapp: string | null
        }
        Insert: {
          business_name: string
          created_at?: string
          description?: string | null
          email?: string | null
          facebook_url?: string | null
          has_discount_coupons?: boolean | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          offers_free_shipping?: boolean | null
          phone?: string | null
          shop_type_id?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
          whatsapp?: string | null
        }
        Update: {
          business_name?: string
          created_at?: string
          description?: string | null
          email?: string | null
          facebook_url?: string | null
          has_discount_coupons?: boolean | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          offers_free_shipping?: boolean | null
          phone?: string | null
          shop_type_id?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roaster_profiles_shop_type_id_fkey"
            columns: ["shop_type_id"]
            isOneToOne: false
            referencedRelation: "shop_types"
            referencedColumns: ["id"]
          },
        ]
      }
      roasters: {
        Row: {
          address: string | null
          affiliate_links: Json | null
          amenities: Json | null
          avatar: string | null
          banner: string | null
          banner_url: string | null
          base_rating: number | null
          base_review_count: number | null
          bio: string | null
          country: string | null
          created_at: string
          created_by: string | null
          description: string | null
          email: string | null
          facebook: string | null
          has_discount_coupons: boolean | null
          id: string
          instagram: string | null
          lat: number | null
          linked_shop_id: string | null
          lng: number | null
          logo_url: string | null
          name: string
          offers_free_shipping: boolean | null
          opening_hours: Json | null
          owner_user_id: string | null
          phone: string | null
          slug: string | null
          status: string | null
          twitter: string | null
          updated_at: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          affiliate_links?: Json | null
          amenities?: Json | null
          avatar?: string | null
          banner?: string | null
          banner_url?: string | null
          base_rating?: number | null
          base_review_count?: number | null
          bio?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          email?: string | null
          facebook?: string | null
          has_discount_coupons?: boolean | null
          id?: string
          instagram?: string | null
          lat?: number | null
          linked_shop_id?: string | null
          lng?: number | null
          logo_url?: string | null
          name: string
          offers_free_shipping?: boolean | null
          opening_hours?: Json | null
          owner_user_id?: string | null
          phone?: string | null
          slug?: string | null
          status?: string | null
          twitter?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          affiliate_links?: Json | null
          amenities?: Json | null
          avatar?: string | null
          banner?: string | null
          banner_url?: string | null
          base_rating?: number | null
          base_review_count?: number | null
          bio?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          email?: string | null
          facebook?: string | null
          has_discount_coupons?: boolean | null
          id?: string
          instagram?: string | null
          lat?: number | null
          linked_shop_id?: string | null
          lng?: number | null
          logo_url?: string | null
          name?: string
          offers_free_shipping?: boolean | null
          opening_hours?: Json | null
          owner_user_id?: string | null
          phone?: string | null
          slug?: string | null
          status?: string | null
          twitter?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      service_companies: {
        Row: {
          business_name: string
          category: string
          country: string | null
          created_at: string
          created_by: string | null
          description: string | null
          email: string | null
          id: string
          logo_url: string | null
          owner_user_id: string | null
          phone: string | null
          slug: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          business_name: string
          category: string
          country?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          owner_user_id?: string | null
          phone?: string | null
          slug?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          business_name?: string
          category?: string
          country?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          owner_user_id?: string | null
          phone?: string | null
          slug?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      shop_branding: {
        Row: {
          avatar_path: string | null
          banner_path: string | null
          created_at: string
          id: string
          managed_by: string | null
          shop_id: string
          updated_at: string
        }
        Insert: {
          avatar_path?: string | null
          banner_path?: string | null
          created_at?: string
          id?: string
          managed_by?: string | null
          shop_id: string
          updated_at?: string
        }
        Update: {
          avatar_path?: string | null
          banner_path?: string | null
          created_at?: string
          id?: string
          managed_by?: string | null
          shop_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      shop_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          kind: string
          shop_id: string
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          kind?: string
          shop_id: string
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          kind?: string
          shop_id?: string
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      shop_staff: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          managed_by: string | null
          name: string
          photo_path: string | null
          roaster_id: string | null
          role: string
          shop_id: string | null
          staff_user_id: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          managed_by?: string | null
          name: string
          photo_path?: string | null
          roaster_id?: string | null
          role: string
          shop_id?: string | null
          staff_user_id?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          managed_by?: string | null
          name?: string
          photo_path?: string | null
          roaster_id?: string | null
          role?: string
          shop_id?: string | null
          staff_user_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_staff_roaster_id_fkey"
            columns: ["roaster_id"]
            isOneToOne: false
            referencedRelation: "roasters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_staff_roaster_id_fkey"
            columns: ["roaster_id"]
            isOneToOne: false
            referencedRelation: "roasters_public"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_types: {
        Row: {
          created_at: string
          icon_color: string
          icon_url: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon_color?: string
          icon_url?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon_color?: string
          icon_url?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      shops: {
        Row: {
          address: string | null
          amenities: Json | null
          avatar: string | null
          banner: string | null
          base_rating: number | null
          base_review_count: number | null
          bio: string | null
          country: string | null
          created_at: string
          created_by: string | null
          created_by_role: string | null
          description: string | null
          email: string | null
          facebook: string | null
          id: string
          instagram: string | null
          lat: number | null
          linked_roaster_id: string | null
          lng: number | null
          name: string
          opening_hours: Json | null
          owner_user_id: string | null
          phone: string | null
          price_level: number | null
          slug: string | null
          status: string | null
          twitter: string | null
          type: string | null
          updated_at: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          amenities?: Json | null
          avatar?: string | null
          banner?: string | null
          base_rating?: number | null
          base_review_count?: number | null
          bio?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          created_by_role?: string | null
          description?: string | null
          email?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          lat?: number | null
          linked_roaster_id?: string | null
          lng?: number | null
          name: string
          opening_hours?: Json | null
          owner_user_id?: string | null
          phone?: string | null
          price_level?: number | null
          slug?: string | null
          status?: string | null
          twitter?: string | null
          type?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          amenities?: Json | null
          avatar?: string | null
          banner?: string | null
          base_rating?: number | null
          base_review_count?: number | null
          bio?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          created_by_role?: string | null
          description?: string | null
          email?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          lat?: number | null
          linked_roaster_id?: string | null
          lng?: number | null
          name?: string
          opening_hours?: Json | null
          owner_user_id?: string | null
          phone?: string | null
          price_level?: number | null
          slug?: string | null
          status?: string | null
          twitter?: string | null
          type?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      social_groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_public: boolean
          name: string
          owner_user_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean
          name: string
          owner_user_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean
          name?: string
          owner_user_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          billing_period: string
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          modules: string[]
          name: string
          price_cents: number
          updated_at: string
        }
        Insert: {
          billing_period?: string
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          modules?: string[]
          name: string
          price_cents?: number
          updated_at?: string
        }
        Update: {
          billing_period?: string
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          modules?: string[]
          name?: string
          price_cents?: number
          updated_at?: string
        }
        Relationships: []
      }
      supplier_products: {
        Row: {
          created_at: string
          currency: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          manufacturer_product_id: string | null
          name: string
          sale_price: number
          stock: number | null
          supplier_user_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          manufacturer_product_id?: string | null
          name: string
          sale_price: number
          stock?: number | null
          supplier_user_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          manufacturer_product_id?: string | null
          name?: string
          sale_price?: number
          stock?: number | null
          supplier_user_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_products_manufacturer_product_id_fkey"
            columns: ["manufacturer_product_id"]
            isOneToOne: false
            referencedRelation: "manufacturer_products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_blocks: {
        Row: {
          blocked_user_id: string
          blocker_user_id: string
          created_at: string
          id: string
          reason: string | null
        }
        Insert: {
          blocked_user_id: string
          blocker_user_id: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_user_id?: string
          blocker_user_id?: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Relationships: []
      }
      user_coffee_products: {
        Row: {
          altitude_meters: number | null
          coffee_brand_id: string | null
          country_of_origin: string | null
          created_at: string
          cupping_score: number | null
          farm_name: string | null
          flavor_profile: string | null
          harvest_date: string | null
          id: string
          is_approved: boolean | null
          is_decaf: boolean | null
          lot_number: string | null
          notes: string | null
          price_amount: number | null
          processing_method: string | null
          producer_name: string | null
          product_name: string
          product_url: string | null
          region: string | null
          roast_date: string | null
          roaster_name: string | null
          updated_at: string
          user_id: string
          varietals: string[] | null
          wash_station: string | null
          weight_grams: number | null
        }
        Insert: {
          altitude_meters?: number | null
          coffee_brand_id?: string | null
          country_of_origin?: string | null
          created_at?: string
          cupping_score?: number | null
          farm_name?: string | null
          flavor_profile?: string | null
          harvest_date?: string | null
          id?: string
          is_approved?: boolean | null
          is_decaf?: boolean | null
          lot_number?: string | null
          notes?: string | null
          price_amount?: number | null
          processing_method?: string | null
          producer_name?: string | null
          product_name: string
          product_url?: string | null
          region?: string | null
          roast_date?: string | null
          roaster_name?: string | null
          updated_at?: string
          user_id: string
          varietals?: string[] | null
          wash_station?: string | null
          weight_grams?: number | null
        }
        Update: {
          altitude_meters?: number | null
          coffee_brand_id?: string | null
          country_of_origin?: string | null
          created_at?: string
          cupping_score?: number | null
          farm_name?: string | null
          flavor_profile?: string | null
          harvest_date?: string | null
          id?: string
          is_approved?: boolean | null
          is_decaf?: boolean | null
          lot_number?: string | null
          notes?: string | null
          price_amount?: number | null
          processing_method?: string | null
          producer_name?: string | null
          product_name?: string
          product_url?: string | null
          region?: string | null
          roast_date?: string | null
          roaster_name?: string | null
          updated_at?: string
          user_id?: string
          varietals?: string[] | null
          wash_station?: string | null
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_coffee_products_coffee_brand_id_fkey"
            columns: ["coffee_brand_id"]
            isOneToOne: false
            referencedRelation: "coffee_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      user_equipment: {
        Row: {
          brand: string | null
          created_at: string
          equipment_name: string
          equipment_type: string
          id: string
          machine_id: string | null
          model: string | null
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          brand?: string | null
          created_at?: string
          equipment_name: string
          equipment_type: string
          id?: string
          machine_id?: string | null
          model?: string | null
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          brand?: string | null
          created_at?: string
          equipment_name?: string
          equipment_type?: string
          id?: string
          machine_id?: string | null
          model?: string | null
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_equipment_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reports: {
        Row: {
          context_id: string | null
          context_type: string | null
          created_at: string
          handled_by: string | null
          id: string
          reason: string
          reported_user_id: string
          reporter_user_id: string
          resolution_note: string | null
          status: string
          updated_at: string
        }
        Insert: {
          context_id?: string | null
          context_type?: string | null
          created_at?: string
          handled_by?: string | null
          id?: string
          reason: string
          reported_user_id: string
          reporter_user_id: string
          resolution_note?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          context_id?: string | null
          context_type?: string | null
          created_at?: string
          handled_by?: string | null
          id?: string
          reason?: string
          reported_user_id?: string
          reporter_user_id?: string
          resolution_note?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          plan_id: string
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id: string
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id?: string
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      coffee_shop_profiles_public: {
        Row: {
          address_id: string | null
          business_name: string | null
          created_at: string | null
          description: string | null
          facebook_url: string | null
          has_bakery: boolean | null
          has_outdoor_seating: boolean | null
          has_wifi: boolean | null
          id: string | null
          instagram_url: string | null
          logo_url: string | null
          opening_hours: Json | null
          shop_type_id: string | null
          twitter_url: string | null
          updated_at: string | null
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          address_id?: string | null
          business_name?: string | null
          created_at?: string | null
          description?: string | null
          facebook_url?: string | null
          has_bakery?: boolean | null
          has_outdoor_seating?: boolean | null
          has_wifi?: boolean | null
          id?: string | null
          instagram_url?: string | null
          logo_url?: string | null
          opening_hours?: Json | null
          shop_type_id?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          address_id?: string | null
          business_name?: string | null
          created_at?: string | null
          description?: string | null
          facebook_url?: string | null
          has_bakery?: boolean | null
          has_outdoor_seating?: boolean | null
          has_wifi?: boolean | null
          id?: string | null
          instagram_url?: string | null
          logo_url?: string | null
          opening_hours?: Json | null
          shop_type_id?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coffee_shop_profiles_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coffee_shop_profiles_shop_type_id_fkey"
            columns: ["shop_type_id"]
            isOneToOne: false
            referencedRelation: "shop_types"
            referencedColumns: ["id"]
          },
        ]
      }
      instructors_public: {
        Row: {
          academy_id: string | null
          bio: string | null
          created_at: string | null
          id: string | null
          name: string | null
          photo_url: string | null
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          academy_id?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string | null
          name?: string | null
          photo_url?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          academy_id?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string | null
          name?: string | null
          photo_url?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instructors_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
        ]
      }
      manufacturers_public: {
        Row: {
          business_name: string | null
          country: string | null
          created_at: string | null
          description: string | null
          id: string | null
          logo_url: string | null
          owner_user_id: string | null
          slug: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          business_name?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          logo_url?: string | null
          owner_user_id?: string | null
          slug?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          business_name?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          logo_url?: string | null
          owner_user_id?: string | null
          slug?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      producer_profiles_public: {
        Row: {
          business_name: string | null
          certifications: string[] | null
          created_at: string | null
          description: string | null
          farm_size_hectares: number | null
          id: string | null
          logo_url: string | null
          updated_at: string | null
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          business_name?: string | null
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          farm_size_hectares?: number | null
          id?: string | null
          logo_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          business_name?: string | null
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          farm_size_hectares?: number | null
          id?: string | null
          logo_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      profiles_public: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string | null
          name: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string | null
          name?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string | null
          name?: string | null
        }
        Relationships: []
      }
      roaster_profiles_public: {
        Row: {
          business_name: string | null
          created_at: string | null
          description: string | null
          facebook_url: string | null
          has_discount_coupons: boolean | null
          id: string | null
          instagram_url: string | null
          logo_url: string | null
          offers_free_shipping: boolean | null
          shop_type_id: string | null
          twitter_url: string | null
          updated_at: string | null
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          business_name?: string | null
          created_at?: string | null
          description?: string | null
          facebook_url?: string | null
          has_discount_coupons?: boolean | null
          id?: string | null
          instagram_url?: string | null
          logo_url?: string | null
          offers_free_shipping?: boolean | null
          shop_type_id?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          business_name?: string | null
          created_at?: string | null
          description?: string | null
          facebook_url?: string | null
          has_discount_coupons?: boolean | null
          id?: string | null
          instagram_url?: string | null
          logo_url?: string | null
          offers_free_shipping?: boolean | null
          shop_type_id?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roaster_profiles_shop_type_id_fkey"
            columns: ["shop_type_id"]
            isOneToOne: false
            referencedRelation: "shop_types"
            referencedColumns: ["id"]
          },
        ]
      }
      roasters_public: {
        Row: {
          address: string | null
          affiliate_links: Json | null
          amenities: Json | null
          avatar: string | null
          banner: string | null
          banner_url: string | null
          base_rating: number | null
          base_review_count: number | null
          bio: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          email: string | null
          facebook: string | null
          has_discount_coupons: boolean | null
          id: string | null
          instagram: string | null
          lat: number | null
          linked_shop_id: string | null
          lng: number | null
          logo_url: string | null
          name: string | null
          offers_free_shipping: boolean | null
          opening_hours: Json | null
          owner_user_id: string | null
          phone: string | null
          slug: string | null
          status: string | null
          twitter: string | null
          updated_at: string | null
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          affiliate_links?: Json | null
          amenities?: Json | null
          avatar?: string | null
          banner?: string | null
          banner_url?: string | null
          base_rating?: number | null
          base_review_count?: number | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          email?: string | null
          facebook?: string | null
          has_discount_coupons?: boolean | null
          id?: string | null
          instagram?: string | null
          lat?: number | null
          linked_shop_id?: string | null
          lng?: number | null
          logo_url?: string | null
          name?: string | null
          offers_free_shipping?: boolean | null
          opening_hours?: Json | null
          owner_user_id?: string | null
          phone?: string | null
          slug?: string | null
          status?: string | null
          twitter?: string | null
          updated_at?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          affiliate_links?: Json | null
          amenities?: Json | null
          avatar?: string | null
          banner?: string | null
          banner_url?: string | null
          base_rating?: number | null
          base_review_count?: number | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          email?: string | null
          facebook?: string | null
          has_discount_coupons?: boolean | null
          id?: string | null
          instagram?: string | null
          lat?: number | null
          linked_shop_id?: string | null
          lng?: number | null
          logo_url?: string | null
          name?: string | null
          offers_free_shipping?: boolean | null
          opening_hours?: Json | null
          owner_user_id?: string | null
          phone?: string | null
          slug?: string | null
          status?: string | null
          twitter?: string | null
          updated_at?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      service_companies_public: {
        Row: {
          business_name: string | null
          category: string | null
          country: string | null
          created_at: string | null
          description: string | null
          id: string | null
          logo_url: string | null
          owner_user_id: string | null
          slug: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          business_name?: string | null
          category?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          logo_url?: string | null
          owner_user_id?: string | null
          slug?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          business_name?: string | null
          category?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          logo_url?: string | null
          owner_user_id?: string | null
          slug?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      shops_public: {
        Row: {
          address: string | null
          amenities: Json | null
          avatar: string | null
          banner: string | null
          base_rating: number | null
          base_review_count: number | null
          bio: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          created_by_role: string | null
          description: string | null
          email: string | null
          facebook: string | null
          id: string | null
          instagram: string | null
          lat: number | null
          linked_roaster_id: string | null
          lng: number | null
          name: string | null
          opening_hours: Json | null
          owner_user_id: string | null
          phone: string | null
          price_level: number | null
          slug: string | null
          status: string | null
          twitter: string | null
          type: string | null
          updated_at: string | null
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          amenities?: Json | null
          avatar?: string | null
          banner?: string | null
          base_rating?: number | null
          base_review_count?: number | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          created_by_role?: string | null
          description?: string | null
          email?: string | null
          facebook?: string | null
          id?: string | null
          instagram?: string | null
          lat?: number | null
          linked_roaster_id?: string | null
          lng?: number | null
          name?: string | null
          opening_hours?: Json | null
          owner_user_id?: string | null
          phone?: string | null
          price_level?: number | null
          slug?: string | null
          status?: string | null
          twitter?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          amenities?: Json | null
          avatar?: string | null
          banner?: string | null
          base_rating?: number | null
          base_review_count?: number | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          created_by_role?: string | null
          description?: string | null
          email?: string | null
          facebook?: string | null
          id?: string | null
          instagram?: string | null
          lat?: number | null
          linked_roaster_id?: string | null
          lng?: number | null
          name?: string | null
          opening_hours?: Json | null
          owner_user_id?: string | null
          phone?: string | null
          price_level?: number | null
          slug?: string | null
          status?: string | null
          twitter?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_or_create_dm: { Args: { other_user: string }; Returns: string }
      get_public_app_setting: { Args: { _key: string }; Returns: Json }
      has_active_subscription: {
        Args: { _module: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_post_views: { Args: { _post_id: string }; Returns: undefined }
      increment_recipe_views: {
        Args: { _recipe_id: string }
        Returns: undefined
      }
      is_blocked_between: { Args: { _a: string; _b: string }; Returns: boolean }
      is_chat_participant: {
        Args: { _chat_id: string; _user_id: string }
        Returns: boolean
      }
      is_group_member: {
        Args: { _group_id: string; _user_id: string }
        Returns: boolean
      }
      lookup_profile: {
        Args: { _q: string }
        Returns: {
          id: string
          name: string
        }[]
      }
      mark_chat_read: { Args: { _chat_id: string }; Returns: undefined }
      unread_notifications_count: { Args: never; Returns: number }
    }
    Enums: {
      app_role:
        | "admin"
        | "roaster"
        | "coffee_shop"
        | "producer"
        | "user"
        | "company"
        | "staff"
        | "pro_user"
        | "teacher"
        | "manufacturer"
        | "supplier"
        | "author"
      brew_method:
        | "espresso"
        | "pour_over"
        | "french_press"
        | "aeropress"
        | "cold_brew"
        | "moka_pot"
        | "drip"
      coffee_type: "arabica" | "robusta" | "liberica" | "excelsa" | "blend"
      machine_type:
        | "espresso"
        | "drip"
        | "french_press"
        | "pour_over"
        | "cold_brew"
        | "moka_pot"
        | "aeropress"
      roast_level: "light" | "medium" | "medium_dark" | "dark"
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
      app_role: [
        "admin",
        "roaster",
        "coffee_shop",
        "producer",
        "user",
        "company",
        "staff",
        "pro_user",
        "teacher",
        "manufacturer",
        "supplier",
        "author",
      ],
      brew_method: [
        "espresso",
        "pour_over",
        "french_press",
        "aeropress",
        "cold_brew",
        "moka_pot",
        "drip",
      ],
      coffee_type: ["arabica", "robusta", "liberica", "excelsa", "blend"],
      machine_type: [
        "espresso",
        "drip",
        "french_press",
        "pour_over",
        "cold_brew",
        "moka_pot",
        "aeropress",
      ],
      roast_level: ["light", "medium", "medium_dark", "dark"],
    },
  },
} as const
