export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          duration_hours: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          duration_hours: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          duration_hours?: number
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          service_id: string
          start_time: string
          end_time: string
          notes: string | null
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_id: string
          start_time: string
          end_time: string
          notes?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_id?: string
          start_time?: string
          end_time?: string
          notes?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          booking_id: string
          stripe_payment_intent_id: string
          amount: number
          status: 'pending' | 'succeeded' | 'failed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          stripe_payment_intent_id: string
          amount: number
          status?: 'pending' | 'succeeded' | 'failed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          stripe_payment_intent_id?: string
          amount?: number
          status?: 'pending' | 'succeeded' | 'failed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          name: string
          email: string
          message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 