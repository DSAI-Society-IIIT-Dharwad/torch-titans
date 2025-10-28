# update_scores.py

import os
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime, timezone
# --- FIX: Correctly import the logic function ---
from scoring_logic import get_wallet_risk_score

# ---!!!!!! TEST MODE TOGGLE !!!!!! ---
TEST_MODE = True
# --------------------------------------

# --- Supabase Table Config ---
USER_TABLE = "users"
WALLET_COLUMN = "wallet_id"
SCORE_COLUMN = "risk_score"
RISK_LEVEL_COLUMN = "risk_level"

# ---!!!!!! MOCK DATA AND CLASSES (Unchanged) !!!!!! ---
MOCK_USER_DATA = [
    {WALLET_COLUMN: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}, # Vitalik's address
    {WALLET_COLUMN: "0x00000000219ab540356CBB839Cbe05303d7705Fa"}, # ETH 2.0 Deposit
    {WALLET_COLUMN: "0x123456...InvalidAddress"}, # A fake address to test errors
]

class MockSupabaseQuery:
    def __init__(self, data):
        self.data = data
    def select(self, columns):
        print(f"[Mock] Selecting '{columns}'...")
        return self
    def execute(self):
        print("[Mock] Returning mock user list.")
        class MockResponse:
            def __init__(self, data):
                self.data = data
        return MockResponse(self.data)

class MockSupabaseTable:
    def __init__(self, table_name):
        self.table_name = table_name
        print(f"[Mock] Accessing table '{self.table_name}'")
    def update(self, payload):
        print(f"[Mock] Preparing to update with payload: {payload}")
        self.payload = payload
        return self
    def eq(self, column, value):
        print(f"[Mock] ...where '{column}' equals '{value}'")
        self.column = column
        self.value = value
        return self
    def execute(self):
        print(f"[Mock] EXECUTING UPDATE on '{self.value}'")
        return None

class MockSupabaseClient:
    def table(self, table_name):
        if table_name == USER_TABLE:
            return MockSupabaseQuery(MOCK_USER_DATA)
        return MockSupabaseTable(table_name)
    
    def table_for_update(self, table_name):
        return MockSupabaseTable(table_name)
# ---!!!!!! END OF MOCK DATA !!!!!! ---


def update_all_user_scores():
    print(f"Starting batch score update (TEST_MODE = {TEST_MODE})...")
    supabase = None
    
    if TEST_MODE:
        supabase = MockSupabaseClient()
        print("Using Mock Supabase Client.")
    else:
        # --- Use Real Supabase Client ---
        load_dotenv()
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_SERVICE_KEY")
        
        if not url or not key:
            print("ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY not found in .env")
            return
        try:
            supabase: Client = create_client(url, key)
            print("Successfully connected to REAL Supabase.")
        except Exception as e:
            print(f"ERROR: Could not connect to Supabase. {e}")
            return

    # 2. Fetch all users
    try:
        response = supabase.table(USER_TABLE).select(WALLET_COLUMN).execute()
        users = response.data
        if not users:
            print("No users found.")
            return
        print(f"Found {len(users)} users to update.")
    except Exception as e:
        print(f"ERROR: Could not fetch users. Check table/column names. {e}")
        return

    # 3. Loop, Calculate, and Update
    updated_count = 0
    failed_count = 0
    
    for user in users:
        wallet_id = user.get(WALLET_COLUMN)
        if not wallet_id:
            continue
            
        print(f"--- Processing: {wallet_id} ---")
        
        try:
            # --- FIX: Call the correct function ---
            score_data = get_wallet_risk_score(wallet_id)
            
            # 5. Create the update payload
            update_payload = {
                SCORE_COLUMN: score_data["score"],
                RISK_LEVEL_COLUMN: score_data["risk_level"],
                "last_updated": score_data["last_updated"]
            }
            
            # 6. Update the user's row in Supabase
            if TEST_MODE:
                supabase.table_for_update(USER_TABLE).update(update_payload).eq(WALLET_COLUMN, wallet_id).execute()
            else:
                supabase.table(USER_TABLE).update(update_payload).eq(WALLET_COLUMN, wallet_id).execute()
            
            print(f"SUCCESS: Updated {wallet_id} to score {score_data['score']} ({score_data['risk_level']})")
            updated_count += 1
            
        except Exception as e:
            # --- This block will now catch all errors from get_wallet_risk_score ---
            print(f"FAILED: Could not update {wallet_id}. Error: {e}")
            failed_count += 1

    print("\n--- Batch Complete ---")
    print(f"Successfully updated: {updated_count}")
    print(f"Failed to update:     {failed_count}")


if __name__ == "__main__":
    update_all_user_scores()