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
  {'id': '0xborrower1...fake', 'name': 'Alice Borrower', 'username': 'alice_b', 'pfp': 'images/pfp/default.png', 'wallet': '0xborrower1...fake', 'onboarded': True, 'risk_score': 620, 'max_loan': 1000},
  {'id': '0xborrower2...fake', 'name': 'Bob Borrower', 'username': 'bob_b', 'pfp': 'images/pfp/default.png', 'wallet': '0xborrower2...fake', 'onboarded': True, 'risk_score': 450, 'max_loan': 250},
  {'id': '0xborrower3...fake', 'name': 'Charlie Borrower', 'username': 'charlie_b', 'pfp': 'images/pfp/default.png', 'wallet': '0xborrower3...fake', 'onboarded': True, 'risk_score': 710, 'max_loan': 5000},
  {'id': '0xborrower4...fake', 'name': 'David Borrower', 'username': 'david_b', 'pfp': 'images/pfp/default.png', 'wallet': '0xborrower4...fake', 'onboarded': True, 'risk_score': 550, 'max_loan': 1000},
  {'id': '0xborrower5...fake', 'name': 'Eve Borrower', 'username': 'eve_b', 'pfp': 'images/pfp/default.png', 'wallet': '0xborrower5...fake', 'onboarded': True, 'risk_score': 800, 'max_loan': 5000},
  {'id': '0xlender1...fake', 'name': 'Frank Lender', 'username': 'frank_l', 'pfp': 'images/pfp/default.png', 'wallet': '0xlender1...fake', 'onboarded': True, 'risk_score': 700, 'max_loan': 5000},
  {'id': '0xlender2...fake', 'name': 'Grace Lender', 'username': 'grace_l', 'pfp': 'images/pfp/default.png', 'wallet': '0xlender2...fake', 'onboarded': True, 'risk_score': 700, 'max_loan': 5000},
  {'id': '0xlender3...fake', 'name': 'Heidi Lender', 'username': 'heidi_l', 'pfp': 'images/pfp/default.png', 'wallet': '0xlender3...fake', 'onboarded': True, 'risk_score': 700, 'max_loan': 5000},
  {'id': '0xlender4...fake', 'name': 'Ivan Lender', 'username': 'ivan_l', 'pfp': 'images/pfp/default.png', 'wallet': '0xlender4...fake', 'onboarded': True, 'risk_score': 700, 'max_loan': 5000},
  {'id': '0xlender5...fake', 'name': 'Judy Lender', 'username': 'judy_l', 'pfp': 'images/pfp/default.png', 'wallet': '0xlender5...fake', 'onboarded': True, 'risk_score': 700, 'max_loan': 5000}
]

# --- 2. MOCK LOAN REQUESTS ---
# MODIFIED: Added 'repayment_duration_days' back in to match the actual table
requests_data = [
  {'id': str(uuid.uuid4()), 'borrower_id': '0xborrower1...fake', 'amount': 1000, 'repayment_duration_days': 30, 'status': 'closed'},
  {'id': str(uuid.uuid4()), 'borrower_id': '0xborrower2...fake', 'amount': 500, 'repayment_duration_days': 14, 'status': 'closed'},
  {'id': str(uuid.uuid4()), 'borrower_id': '0xborrower3...fake', 'amount': 2500, 'repayment_duration_days': 60, 'status': 'closed'},
  {'id': str(uuid.uuid4()), 'borrower_id': '0xborrower4...fake', 'amount': 800, 'repayment_duration_days': 7, 'status': 'closed'},
  {'id': str(uuid.uuid4()), 'borrower_id': '0xborrower5...fake', 'amount': 5000, 'repayment_duration_days': 90, 'status': 'closed'},
  {'id': str(uuid.uuid4()), 'borrower_id': '0xborrower1...fake', 'amount': 200, 'repayment_duration_days': 10, 'status': 'closed'},
  {'id': str(uuid.uuid4()), 'borrower_id': '0xborrower2...fake', 'amount': 1500, 'repayment_duration_days': 45, 'status': 'closed'},
  {'id': str(uuid.uuid4()), 'borrower_id': '0xborrower3...fake', 'amount': 300, 'repayment_duration_days': 30, 'status': 'closed'},
  {'id': str(uuid.uuid4()), 'borrower_id': '0xborrower4...fake', 'amount': 1200, 'repayment_duration_days': 14, 'status': 'active'},
  {'id': str(uuid.uuid4()), 'borrower_id': '0xborrower5...fake', 'amount': 1000, 'repayment_duration_days': 30, 'status': 'active'}
]

# --- 3. MOCK LOAN OFFERS (No changes) ---
offers_data = [
  {'id': str(uuid.uuid4()), 'lender_id': '0xlender1...fake', 'amount': 1000, 'interest_rate': 5, 'repayment_duration': 30, 'status': 'accept'},
  {'id': str(uuid.uuid4()), 'lender_id': '0xlender2...fake', 'amount': 500, 'interest_rate': 8, 'repayment_duration': 14, 'status': 'accept'},
  {'id': str(uuid.uuid4()), 'lender_id': '0xlender3...fake', 'amount': 2500, 'interest_rate': 4, 'repayment_duration': 60, 'status': 'accept'},
  {'id': str(uuid.uuid4()), 'lender_id': '0xlender4...fake', 'amount': 800, 'interest_rate': 7, 'repayment_duration': 7, 'status': 'accept'},
  {'id': str(uuid.uuid4()), 'lender_id': '0xlender5...fake', 'amount': 5000, 'interest_rate': 3, 'repayment_duration': 90, 'status': 'accept'},
  {'id': str(uuid.uuid4()), 'lender_id': '0xlender1...fake', 'amount': 200, 'interest_rate': 9, 'repayment_duration': 10, 'status': 'accept'},
  {'id': str(uuid.uuid4()), 'lender_id': '0xlender2...fake', 'amount': 1500, 'interest_rate': 6, 'repayment_duration': 45, 'status': 'accept'},
  {'id': str(uuid.uuid4()), 'lender_id': '0xlender3...fake', 'amount': 300, 'interest_rate': 10, 'repayment_duration': 30, 'status': 'accept'},
  {'id': str(uuid.uuid4()), 'lender_id': '0xlender4...fake', 'amount': 1200, 'interest_rate': 8, 'repayment_duration': 14, 'status': 'active'},
  {'id': str(uuid.uuid4()), 'lender_id': '0xlender5...fake', 'amount': 1000, 'interest_rate': 7, 'repayment_duration': 30, 'status': 'active'}
]

# --- 4. MOCK LOANS (No changes) ---
now = datetime.now(timezone.utc)
loans_data = [
  {'id': str(uuid.uuid4()), 'lender_id': '0xlender1...fake', 'borrower_id': '0xborrower1...fake', 'principal_amount': 1000, 'interest_rate': 5, 'total_repayment_amount': 1050, 'repayment_duration_days': 30, 'start_date': (now - timedelta(days=5)).isoformat(), 'due_date': (now + timedelta(days=25)).isoformat(), 'status': 'active'},
  {'id': str(uuid.uuid4()), 'lender_id': '0xlender2...fake', 'borrower_id': '0xborrower2...fake', 'principal_amount': 500, 'interest_rate': 8, 'total_repayment_amount': 540, 'repayment_duration_days': 14, 'start_date': (now - timedelta(days=2)).isoformat(), 'due_date': (now + timedelta(days=12)).isoformat(), 'status': 'active'},
  {'id': str(uuid.uuid4()), 'lender_id': '0xlender3...fake', 'borrower_id': '0xborrower3...fake', 'principal_amount': 2500, 'interest_rate': 4, 'total_repayment_amount': 2600, 'repayment_duration_days': 60, 'start_date': (now - timedelta(days=10)).isoformat(), 'due_date': (now + timedelta(days=50)).isoformat(), 'status': 'active'},
  {'id': str(uuid.uuid4()), 'lender_id': '0xlender4...fake', 'borrower_id': '0xborrower4...fake', 'principal_amount': 800, 'interest_rate': 7, 'total_repayment_amount': 856, 'repayment_duration_days': 7, 'start_date': (now - timedelta(days=1)).isoformat(), 'due_date': (now + timedelta(days=6)).isoformat(), 'status': 'active'},
  {'id': str(uuid.uuid4()), 'lender_id': '0xlender5...fake', 'borrower_id': '0xborrower5...fake', 'principal_amount': 5000, 'interest_rate': 3, 'total_repayment_amount': 5150, 'repayment_duration_days': 90, 'start_date': (now - timedelta(days=20)).isoformat(), 'due_date': (now + timedelta(days=70)).isoformat(), 'status': 'active'},
  {'id': str(uuid.uuid4()), 'lender_id': '0xlender1...fake', 'borrower_id': '0xborrower1...fake', 'principal_amount': 200, 'interest_rate': 9, 'total_repayment_amount': 218, 'repayment_duration_days': 10, 'start_date': (now - timedelta(days=3)).isoformat(), 'due_date': (now + timedelta(days=7)).isoformat(), 'status': 'active'},
  {'id': str(uuid.uuid4()), 'lender_id': '0xlender2...fake', 'borrower_id': '0xborrower2...fake', 'principal_amount': 1500, 'interest_rate': 6, 'total_repayment_amount': 1590, 'repayment_duration_days': 45, 'start_date': (now - timedelta(days=15)).isoformat(), 'due_date': (now + timedelta(days=30)).isoformat(), 'status': 'active'},
  {'id': str(uuid.uuid4()), 'lender_id': '0xlender3...fake', 'borrower_id': '0xborrower3...fake', 'principal_amount': 300, 'interest_rate': 10, 'total_repayment_amount': 330, 'repayment_duration_days': 30, 'start_date': (now - timedelta(days=25)).isoformat(), 'due_date': (now + timedelta(days=5)).isoformat(), 'status': 'active'},
  {'id': str(uuid.uuid4()), 'lender_id': '0xlender4...fake', 'borrower_id': '0xborrower4...fake', 'principal_amount': 1200, 'interest_rate': 8, 'total_repayment_amount': 1296, 'repayment_duration_days': 14, 'start_date': (now - timedelta(days=40)).isoformat(), 'due_date': (now - timedelta(days=26)).isoformat(), 'status': 'closed'}, # Represents 'repaid'
  {'id': str(uuid.uuid4()), 'lender_id': '0xlender5...fake', 'borrower_id': '0xborrower5...fake', 'principal_amount': 1000, 'interest_rate': 7, 'total_repayment_amount': 1070, 'repayment_duration_days': 30, 'start_date': (now - timedelta(days=45)).isoformat(), 'due_date': (now - timedelta(days=15)).isoformat(), 'status': 'closed'}  # Represents 'defaulted'
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
        # Allow seeding even if clearing fails (e.g., tables don't exist yet)
        print("Continuing with seeding...")


def seed_data():
    """Inserts or updates data using upsert."""
    print("\n--- SEEDING DATABASE (Upserting) ---")
    try:
        # 1. Users (Upsert on 'id' which is the wallet address)
        print(f"Upserting {len(users_data)} users...")
        p_res = supabase.table("users").upsert(users_data).execute()
        if hasattr(p_res, 'data') and p_res.data:
            print(f"Successfully upserted {len(p_res.data)} users.")
        elif hasattr(p_res, 'error') and p_res.error:
             raise Exception(p_res.error or "Unknown error upserting users")
        else:
             print("Upsert users response format unexpected or empty.")


        # 2. Loan Requests (Upsert on 'id')
        print(f"Upserting {len(requests_data)} loan requests...")
        r_res = supabase.table("loan_requests").upsert(requests_data).execute()
        if hasattr(r_res, 'data') and r_res.data:
            print(f"Successfully upserted {len(r_res.data)} requests.")
        elif hasattr(r_res, 'error') and r_res.error:
             raise Exception(r_res.error or "Unknown error upserting requests")
        else:
             print("Upsert requests response format unexpected or empty.")


        # 3. Loan Offers (Upsert on 'id')
        print(f"Upserting {len(offers_data)} loan offers...")
        o_res = supabase.table("loan_offers").upsert(offers_data).execute()
        if hasattr(o_res, 'data') and o_res.data:
            print(f"Successfully upserted {len(o_res.data)} offers.")
        elif hasattr(o_res, 'error') and o_res.error:
             raise Exception(o_res.error or "Unknown error upserting offers")
        else:
             print("Upsert offers response format unexpected or empty.")


        # 4. Loans (Upsert on 'id')
        print(f"Upserting {len(loans_data)} loans...")
        l_res = supabase.table("loans").upsert(loans_data).execute()
        if hasattr(l_res, 'data') and l_res.data:
            print(f"Successfully upserted {len(l_res.data)} loans.")
        elif hasattr(l_res, 'error') and l_res.error:
             raise Exception(l_res.error or "Unknown error upserting loans")
        else:
            print("Upsert loans response format unexpected or empty.")


        print("\n--- SEEDING COMPLETE ---")

    except Exception as e:
        print(f"\n--- ERROR DURING SEEDING ---")
        print(e)
        # Attempt to print Supabase specific error if available
        if hasattr(e, 'details'):
            print(f"Details: {e.details}")
        if hasattr(e, 'hint'):
            print(f"Hint: {e.hint}")
        if hasattr(e, 'code'):
            print(f"Code: {e.code}")


if __name__ == "__main__":
    # This will wipe all data and replace it with the mock data using upsert
    try:
        clear_tables()
        seed_data()
    except Exception as e:
        print(f"Seeding script failed: {e}")