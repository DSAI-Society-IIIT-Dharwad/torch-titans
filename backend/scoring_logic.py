# scoring_logic.py

import os
import requests
from web3 import Web3
from datetime import datetime, timezone
from dotenv import load_dotenv

# --- Load Config from .env ---
load_dotenv()
ETH_RPC_ENDPOINT = os.getenv("ETH_RPC_ENDPOINT")
ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")
ETHERSCAN_API_URL = "https://api-sepolia.etherscan.io/api"

# --- Shared Variables ---
try:
    w3 = Web3(Web3.HTTPProvider(ETH_RPC_ENDPOINT))
except Exception as e:
    print(f"ERROR: Could not connect to Infura. Check ETH_RPC_ENDPOINT. {e}")
    w3 = None

WEIGHTS = {
    "platform_repayment_good": 150,
    "platform_repayment_bad": -300,
    "wallet_age_days": 1.5,
    "eth_balance": 50,
    "tx_count": 0.5,
    "erc20_token_count": 10
}

# --- Mock DB Function ---
def get_platform_repayment_history(wallet_address: str):
    # In a real app, you'd query Supabase for this user's loan history
    return (0, 0)

# --- The Reusable Score Calculation Function ---
def get_wallet_risk_score(wallet_address: str):
    """
    Calculates a risk score for a given wallet.
    Returns a dictionary with all score data.
    Raises an Exception on ANY failure.
    """
    if not w3 or not w3.is_connected() or not ETH_RPC_ENDPOINT:
        raise Exception("Web3 provider not connected. Check your ETH_RPC_ENDPOINT.")
        
    if not ETHERSCAN_API_KEY:
        raise Exception("ETHERSCAN_API_KEY is missing from .env file.")

    if not w3.is_address(wallet_address):
        raise Exception("Invalid Ethereum address format.")
        
    checksum_address = w3.to_checksum_address(wallet_address)
    
    score = 0
    analysis = {}

    # Use a try/except block for all external API calls
    try:
        # --- 1. Platform-Specific History ---
        good_loans, defaulted_loans = get_platform_repayment_history(checksum_address)
        score += good_loans * WEIGHTS["platform_repayment_good"]
        score += defaulted_loans * WEIGHTS["platform_repayment_bad"]
        analysis["platform_good_loans"] = good_loans
        analysis["platform_defaulted_loans"] = defaulted_loans

        # --- 2. ETH Balance ---
        balance_wei = w3.eth.get_balance(checksum_address)
        eth_balance = w3.from_wei(balance_wei, 'ether')
        balance_score = min(float(eth_balance) * WEIGHTS["eth_balance"], 200) 
        score += balance_score
        analysis["eth_balance"] = float(eth_balance)
        analysis["balance_score"] = balance_score

        # --- 3. Wallet Age & Tx Count ---
        tx_params = {"module": "account", "action": "txlist", "address": checksum_address, "startblock": 0, "endblock": 99999999, "sort": "asc", "apikey": ETHERSCAN_API_KEY}
        response = requests.get(ETHERSCAN_API_URL, params=tx_params)
        tx_data = response.json()

        # Robust check using .get()
        if tx_data.get("status") == "1" and tx_data.get("result"):
            tx_list = tx_data["result"]
            tx_count = len(tx_list)
            first_tx_timestamp = int(tx_list[0]['timeStamp'])
            first_tx_time = datetime.fromtimestamp(first_tx_timestamp, timezone.utc)
            wallet_age_days = (datetime.now(timezone.utc) - first_tx_time).days
            age_score = wallet_age_days * WEIGHTS["wallet_age_days"]
            tx_score = tx_count * WEIGHTS["tx_count"]
            score += age_score + tx_score
            analysis.update({"wallet_age_days": wallet_age_days, "age_score": age_score, "transaction_count": tx_count, "tx_score": tx_score})
        else:
            analysis.update({"wallet_age_days": 0, "transaction_count": 0, "note": "New wallet with no transaction history."})

        # --- 4. ERC-20 Token Holdings ---
        token_params = {"module": "account", "action": "tokentx", "address": checksum_address, "startblock": 0, "endblock": 99999999, "sort": "asc", "apikey": ETHERSCAN_API_KEY}
        token_response = requests.get(ETHERSCAN_API_URL, params=token_params)
        token_data = token_response.json()
        
        unique_tokens = set()
        if token_data.get("status") == "1" and token_data.get("result"):
            for tx in token_data["result"]:
                unique_tokens.add(tx['tokenSymbol'])
        
        erc20_token_count = len(unique_tokens)
        token_score = erc20_token_count * WEIGHTS["erc20_token_count"]
        score += token_score
        analysis.update({"erc20_token_variety_count": erc20_token_count, "token_score": token_score})

    except Exception as e:
        # If any API call fails, raise a new exception
        raise Exception(f"Failed during API call: {e}")

    # --- Final Score ---
    # MOVED this code to be *before* the final return
    final_score = round(max(300, min(850, 300 + score)))
    risk_level = "low" if final_score > 700 else "medium" if final_score > 550 else "high"

    return {
        "wallet_address": checksum_address,
        "score": final_score,
        "risk_level": risk_level,
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "analysis_breakdown": analysis
    }