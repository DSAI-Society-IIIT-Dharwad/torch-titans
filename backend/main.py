import uvicorn
import requests
import os  # <-- Import this
from fastapi import FastAPI
from web3 import Web3
from datetime import datetime, timezone
from dotenv import load_dotenv  # <-- Import this

load_dotenv()  # <-- Add this line to load variables from .env

# --- Configuration ---
app = FastAPI()

# 1. Read keys securely from the environment
ETH_RPC_ENDPOINT = os.getenv("ETH_RPC_ENDPOINT")
ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")

# 2. Set the Etherscan URL (for Sepolia testnet)
ETHERSCAN_API_URL = "https://api-sepolia.etherscan.io/api" 

# Check if keys are loaded
if not ETH_RPC_ENDPOINT or not ETHERSCAN_API_KEY:
    print("ERROR: API keys not found. Make sure .env file is correct.")
    exit(1) # Stop the server if keys are missing

# Connect to Ethereum node
w3 = Web3(Web3.HTTPProvider(ETH_RPC_ENDPOINT))

# --- Weights for your scoring model (TUNE THESE) ---
WEIGHTS = {
    "platform_repayment_good": 150,
    "platform_repayment_bad": -300,
    "wallet_age_days": 1.5,
    "eth_balance": 50,
    "tx_count": 0.5,
    "erc20_token_count": 10
}

# --- Mock Database Function (Identical to before) ---
def get_platform_repayment_history(wallet_address: str):
    print(f"Querying internal DB for wallet: {wallet_address}")
    return (0, 0)

# --- The Main API Endpoint ---
# --- The Main API Endpoint ---
@app.post("/calculate-risk-score")  # <-- The URL path is fine with a hyphen
def calculate_risk_score(wallet_address: str):  # <-- The function name must use an underscore and not be async
    
    if not w3.is_address(wallet_address):
        return {"error": "Invalid Ethereum address"}, 400
        
    try:
        checksum_address = w3.to_checksum_address(wallet_address)
    except Exception:
        return {"error": "Invalid address format"}, 400

    score = 0
    analysis = {}

    try:
        # --- 1. Platform-Specific History ---
        good_loans, defaulted_loans = get_platform_repayment_history(checksum_address)
        score += good_loans * WEIGHTS["platform_repayment_good"]
        score += defaulted_loans * WEIGHTS["platform_repayment_bad"]
        analysis["platform_good_loans"] = good_loans
        analysis["platform_defaulted_loans"] = defaulted_loans

        # --- 2. ETH Balance (using web3.py) ---
        balance_wei = w3.eth.get_balance(checksum_address)
        eth_balance = w3.from_wei(balance_wei, 'ether')
        
        balance_score = min(float(eth_balance) * WEIGHTS["eth_balance"], 200) 
        score += balance_score
        analysis["eth_balance"] = float(eth_balance)
        analysis["balance_score"] = balance_score

        # --- 3. Wallet Age & Transaction Count (using Etherscan API) ---
        tx_params = {
            "module": "account",
            "action": "txlist",
            "address": checksum_address,
            "startblock": 0,
            "endblock": 99999999,
            "sort": "asc",
            "apikey": ETHERSCAN_API_KEY
        }
        
        response = requests.get(ETHERSCAN_API_URL, params=tx_params)
        tx_data = response.json()

        if tx_data["status"] == "1" and tx_data["result"]:
            tx_list = tx_data["result"]
            tx_count = len(tx_list)
            
            first_tx_timestamp = int(tx_list[0]['timeStamp'])
            first_tx_time = datetime.fromtimestamp(first_tx_timestamp, timezone.utc)
            wallet_age_days = (datetime.now(timezone.utc) - first_tx_time).days
            
            age_score = wallet_age_days * WEIGHTS["wallet_age_days"]
            tx_score = tx_count * WEIGHTS["tx_count"]
            
            score += age_score
            score += tx_score
            
            analysis["wallet_age_days"] = wallet_age_days
            analysis["age_score"] = age_score
            analysis["transaction_count"] = tx_count
            analysis["tx_score"] = tx_score
        else:
            analysis["wallet_age_days"] = 0
            analysis["transaction_count"] = 0
            analysis["note"] = "New wallet with no transaction history."

        # --- 4. ERC-20 Token Holdings (using Etherscan API) ---
        token_params = {
            "module": "account",
            "action": "tokentx",
            "address": checksum_address,
            "startblock": 0,
            "endblock": 99999999,
            "sort": "asc",
            "apikey": ETHERSCAN_API_KEY
        }
        
        token_response = requests.get(ETHERSCAN_API_URL, params=token_params)
        token_data = token_response.json()
        
        unique_tokens = set()
        if token_data["status"] == "1" and token_data["result"]:
            for tx in token_data["result"]:
                unique_tokens.add(tx['tokenSymbol'])
        
        erc20_token_count = len(unique_tokens)
        token_score = erc20_token_count * WEIGHTS["erc20_token_count"]
        score += token_score
        analysis["erc20_token_variety_count"] = erc20_token_count
        analysis["token_score"] = token_score

        # --- Final Score Calculation ---
        final_score = max(300, min(850, 300 + score)) 

        return {
            "wallet_address": checksum_address,
            "score": round(final_score),
            "risk_level": "low" if final_score > 700 else "medium" if final_score > 550 else "high",
            "analysis_breakdown": analysis
        }

    except Exception as e:
        return {"error": str(e)}, 500                                       
# --- To run the server ---
# uvicorn main:app --reload