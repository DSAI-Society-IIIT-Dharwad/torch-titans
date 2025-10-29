# seed.py

import os
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime, timezone, timedelta
import uuid

# --- Configuration ---
load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")

if not url or not key:
    raise Exception("Supabase credentials not found in .env file")

supabase: Client = create_client(url, key)
print("Connected to Supabase.")

# --- 1. MOCK USERS (No changes) ---
users_data = [
  {'id': '0xborrower1...fake', 'name': 'Alice Borrower', 'username': 'alice_b', 'wallet': '0xborrower1...fake', 'onboarded': True, 'risk_score': 620, 'max_loan': 1000},
  {'id': '0xborrower2...fake', 'name': 'Bob Borrower', 'username': 'bob_b', 'wallet': '0xborrower2...fake', 'onboarded': True, 'risk_score': 450, 'max_loan': 250},
  {'id': '0xborrower3...fake', 'name': 'Charlie Borrower', 'username': 'charlie_b', 'wallet': '0xborrower3...fake', 'onboarded': True, 'risk_score': 710, 'max_loan': 5000},
  {'id': '0xborrower4...fake', 'name': 'David Borrower', 'username': 'david_b', 'wallet': '0xborrower4...fake', 'onboarded': True, 'risk_score': 550, 'max_loan': 1000},
  {'id': '0xborrower5...fake', 'name': 'Eve Borrower', 'username': 'eve_b', 'wallet': '0xborrower5...fake', 'onboarded': True, 'risk_score': 800, 'max_loan': 5000},
  {'id': '0xlender1...fake', 'name': 'Frank Lender', 'username': 'frank_l', 'wallet': '0xlender1...fake', 'onboarded': True, 'risk_score': 700, 'max_loan': 5000},
  {'id': '0xlender2...fake', 'name': 'Grace Lender', 'username': 'grace_l', 'wallet': '0xlender2...fake', 'onboarded': True, 'risk_score': 700, 'max_loan': 5000},
  {'id': '0xlender3...fake', 'name': 'Heidi Lender', 'username': 'heidi_l', 'wallet': '0xlender3...fake', 'onboarded': True, 'risk_score': 700, 'max_loan': 5000},
  {'id': '0xlender4...fake', 'name': 'Ivan Lender', 'username': 'ivan_l', 'wallet': '0xlender4...fake', 'onboarded': True, 'risk_score': 700, 'max_loan': 5000},
  {'id': '0xlender5...fake', 'name': 'Judy Lender', 'username': 'judy_l', 'wallet': '0xlender5...fake', 'onboarded': True, 'risk_score': 700, 'max_loan': 5000}
]

# --- 2. MOCK LOAN REQUESTS ---
# MODIFIED: Added 'repayment_duration_days' back in
requests_data = [
  {'borrower_id': '0xborrower1...fake', 'amount': 1000, 'repayment_duration_days': 30, 'status': 'closed'},
  {'borrower_id': '0xborrower2...fake', 'amount': 500, 'repayment_duration_days': 14, 'status': 'closed'},
  {'borrower_id': '0xborrower3...fake', 'amount': 2500, 'repayment_duration_days': 60, 'status': 'closed'},
  {'borrower_id': '0xborrower4...fake', 'amount': 800, 'repayment_duration_days': 7, 'status': 'closed'},
  {'borrower_id': '0xborrower5...fake', 'amount': 5000, 'repayment_duration_days': 90, 'status': 'closed'},
  {'borrower_id': '0xborrower1...fake', 'amount': 200, 'repayment_duration_days': 10, 'status': 'closed'},
  {'borrower_id': '0xborrower2...fake', 'amount': 1500, 'repayment_duration_days': 45, 'status': 'closed'},
  {'borrower_id': '0xborrower3...fake', 'amount': 300, 'repayment_duration_days': 30, 'status': 'closed'},
  {'borrower_id': '0xborrower4...fake', 'amount': 1200, 'repayment_duration_days': 14, 'status': 'active'},
  {'borrower_id': '0xborrower5...fake', 'amount': 1000, 'repayment_duration_days': 30, 'status': 'active'}
]

# --- 3. MOCK LOAN OFFERS (No changes) ---
offers_data = [
  {'lender_id': '0xlender1...fake', 'amount': 1000, 'interest_rate': 5, 'repayment_duration': 30, 'status': 'accept'},
  {'lender_id': '0xlender2...fake', 'amount': 500, 'interest_rate': 8, 'repayment_duration': 14, 'status': 'accept'},
  {'lender_id': '0xlender3...fake', 'amount': 2500, 'interest_rate': 4, 'repayment_duration': 60, 'status': 'accept'},
  {'lender_id': '0xlender4...fake', 'amount': 800, 'interest_rate': 7, 'repayment_duration': 7, 'status': 'accept'},
  {'lender_id': '0xlender5...fake', 'amount': 5000, 'interest_rate': 3, 'repayment_duration': 90, 'status': 'accept'},
  {'lender_id': '0xlender1...fake', 'amount': 200, 'interest_rate': 9, 'repayment_duration': 10, 'status': 'accept'},
  {'lender_id': '0xlender2...fake', 'amount': 1500, 'interest_rate': 6, 'repayment_duration': 45, 'status': 'accept'},
  {'lender_id': '0xlender3...fake', 'amount': 300, 'interest_rate': 10, 'repayment_duration': 30, 'status': 'accept'},
  {'lender_id': '0xlender4...fake', 'amount': 1200, 'interest_rate': 8, 'repayment_duration': 14, 'status': 'active'},
  {'lender_id': '0xlender5...fake', 'amount': 1000, 'interest_rate': 7, 'repayment_duration': 30, 'status': 'active'}
]

# --- 4. MOCK LOANS (No changes) ---
now = datetime.now(timezone.utc)
loans_data = [
  {'lender_id': '0xlender1...fake', 'borrower_id': '0xborrower1...fake', 'principal_amount': 1000, 'interest_rate': 5, 'total_repayment_amount': 1050, 'repayment_duration_days': 30, 'start_date': (now - timedelta(days=5)).isoformat(), 'due_date': (now + timedelta(days=25)).isoformat(), 'status': 'active'},
  {'lender_id': '0xlender2...fake', 'borrower_id': '0xborrower2...fake', 'principal_amount': 500, 'interest_rate': 8, 'total_repayment_amount': 540, 'repayment_duration_days': 14, 'start_date': (now - timedelta(days=2)).isoformat(), 'due_date': (now + timedelta(days=12)).isoformat(), 'status': 'active'},
  {'lender_id': '0xlender3...fake', 'borrower_id': '0xborrower3...fake', 'principal_amount': 2500, 'interest_rate': 4, 'total_repayment_amount': 2600, 'repayment_duration_days': 60, 'start_date': (now - timedelta(days=10)).isoformat(), 'due_date': (now + timedelta(days=50)).isoformat(), 'status': 'active'},
  {'lender_id': '0xlender4...fake', 'borrower_id': '0xborrower4...fake', 'principal_amount': 800, 'interest_rate': 7, 'total_repayment_amount': 856, 'repayment_duration_days': 7, 'start_date': (now - timedelta(days=1)).isoformat(), 'due_date': (now + timedelta(days=6)).isoformat(), 'status': 'active'},
  {'lender_id': '0xlender5...fake', 'borrower_id': '0xborrower5...fake', 'principal_amount': 5000, 'interest_rate': 3, 'total_repayment_amount': 5150, 'repayment_duration_days': 90, 'start_date': (now - timedelta(days=20)).isoformat(), 'due_date': (now + timedelta(days=70)).isoformat(), 'status': 'active'},
  {'lender_id': '0xlender1...fake', 'borrower_id': '0xborrower1...fake', 'principal_amount': 200, 'interest_rate': 9, 'total_repayment_amount': 218, 'repayment_duration_days': 10, 'start_date': (now - timedelta(days=3)).isoformat(), 'due_date': (now + timedelta(days=7)).isoformat(), 'status': 'active'},
  {'lender_id': '0xlender2...fake', 'borrower_id': '0xborrower2...fake', 'principal_amount': 1500, 'interest_rate': 6, 'total_repayment_amount': 1590, 'repayment_duration_days': 45, 'start_date': (now - timedelta(days=15)).isoformat(), 'due_date': (now + timedelta(days=30)).isoformat(), 'status': 'active'},
  {'lender_id': '0xlender3...fake', 'borrower_id': '0xborrower3...fake', 'principal_amount': 300, 'interest_rate': 10, 'total_repayment_amount': 330, 'repayment_duration_days': 30, 'start_date': (now - timedelta(days=25)).isoformat(), 'due_date': (now + timedelta(days=5)).isoformat(), 'status': 'active'},
  {'lender_id': '0xlender4...fake', 'borrower_id': '0xborrower4...fake', 'principal_amount': 1200, 'interest_rate': 8, 'total_repayment_amount': 1296, 'repayment_duration_days': 14, 'start_date': (now - timedelta(days=40)).isoformat(), 'due_date': (now - timedelta(days=26)).isoformat(), 'status': 'closed'},
  {'lender_id': '0xlender5...fake', 'borrower_id': '0xborrower5...fake', 'principal_amount': 1000, 'interest_rate': 7, 'total_repayment_amount': 1070, 'repayment_duration_days': 30, 'start_date': (now - timedelta(days=45)).isoformat(), 'due_date': (now - timedelta(days=15)).isoformat(), 'status': 'closed'}
]


def clear_tables():
    """Deletes data in reverse order to respect foreign keys."""
    print("--- CLEARING ALL TABLES ---")
    try:
        # Delete from tables that reference 'users' first
        supabase.table("loans").delete().neq('status', 'non-existent-status').execute()
        supabase.table("loan_offers").delete().neq('status', 'non-existent-status').execute()
        supabase.table("loan_requests").delete().neq('status', 'non-existent-status').execute()
        
        # Delete from 'users' last
        supabase.table("users").delete().neq('username', 'non-existent-username').execute()
        
        print("All tables cleared successfully.")
    except Exception as e:
        print(f"Error clearing tables: {e}")
        raise

def seed_data():
    """Inserts data in the correct order."""
    print("\n--- SEEDING DATABASE ---")
    try:
        # 1. Users (Must be first)
        print(f"Seeding {len(users_data)} users...")
        p_res = supabase.table("users").insert(users_data).execute()
        if p_res.data:
            print(f"Successfully inserted {len(p_res.data)} users.")
        else:
            raise Exception(p_res.error or "Unknown error inserting users")

        # 2. Loan Requests
        print(f"Seeding {len(requests_data)} loan requests...")
        r_res = supabase.table("loan_requests").insert(requests_data).execute()
        if r_res.data:
            print(f"Successfully inserted {len(r_res.data)} requests.")
        else:
            raise Exception(p_res.error or "Unknown error inserting requests")
        
        # 3. Loan Offers
        print(f"Seeding {len(offers_data)} loan offers...")
        o_res = supabase.table("loan_offers").insert(offers_data).execute()
        if o_res.data:
            print(f"Successfully inserted {len(o_res.data)} offers.")
        else:
            raise Exception(o_res.error or "Unknown error inserting offers")
        
        # 4. Loans
        print(f"Seeding {len(loans_data)} loans...")
        l_res = supabase.table("loans").insert(loans_data).execute()
        if l_res.data:
            print(f"Successfully inserted {len(l_res.data)} loans.")
        else:
            raise Exception(l_res.error or "Unknown error inserting loans")

        print("\n--- SEEDING COMPLETE ---")

    except Exception as e:
        print(f"\n--- ERROR DURING SEEDING ---")
        print(e)

if __name__ == "__main__":
    # This will wipe all data and replace it with the mock data
    try:
        clear_tables()
        seed_data()
    except Exception as e:
        print(f"Seeding script failed: {e}")