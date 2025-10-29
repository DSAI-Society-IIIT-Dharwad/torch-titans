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
          name: string
          username: string
          pfp: string | null
          wallet: string
          onboarded: boolean
          risk_score: number
          max_loan: number
          created_at: string
        }
        Insert: {
          id: string
          name: string
          username: string
          pfp?: string | null
          wallet: string
          onboarded?: boolean
          risk_score?: number
          max_loan?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          username?: string
          pfp?: string | null
          wallet?: string
          onboarded?: boolean
          risk_score?: number
          max_loan?: number
          created_at?: string
        }
      }
      loan_requests: {
        Row: {
          id: string
          borrower_id: string
          amount: number
          repayment_duration_days: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          borrower_id: string
          amount: number
          repayment_duration_days: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          borrower_id?: string
          amount?: number
          repayment_duration_days?: number
          status?: string
          created_at?: string
        }
      }
      loan_offers: {
        Row: {
          id: string
          lender_id: string
          amount: number
          interest_rate: number
          repayment_duration: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          lender_id: string
          amount: number
          interest_rate: number
          repayment_duration: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          lender_id?: string
          amount?: number
          interest_rate?: number
          repayment_duration?: number
          status?: string
          created_at?: string
        }
      }
      loans: {
        Row: {
          id: string
          lender_id: string
          borrower_id: string
          principal_amount: number
          interest_rate: number
          total_repayment_amount: number
          repayment_duration_days: number
          start_date: string
          due_date: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          lender_id: string
          borrower_id: string
          principal_amount: number
          interest_rate: number
          total_repayment_amount: number
          repayment_duration_days: number
          start_date: string
          due_date: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          lender_id?: string
          borrower_id?: string
          principal_amount?: number
          interest_rate?: number
          total_repayment_amount?: number
          repayment_duration_days?: number
          start_date?: string
          due_date?: string
          status?: string
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