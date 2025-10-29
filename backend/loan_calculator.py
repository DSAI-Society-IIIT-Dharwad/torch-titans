# loan_calculator.py
from backend.scoring_logic import get_wallet_risk_score

def get_max_loan_amount(score_data: dict):
    """
    Calculates the maximum loan amount a user can request based on their
    risk score and platform repayment history.

    Args:
        score_data (dict): The full dictionary output from get_wallet_risk_score().
        
    Returns:
        (int): The maximum loan amount in USD.
    """
    
    # --- 1. Get data from the score_data dictionary ---
    risk_score = score_data.get('score', 300)
    analysis = score_data.get('analysis_breakdown', {})
    
    # This uses your *internal* platform data
    good_loans = analysis.get('platform_good_loans', 0)
    defaulted_loans = analysis.get('platform_defaulted_loans', 0)
    
    # --- 2. Determine Base Cap from On-Chain Risk Score ---
    base_cap = 0
    if risk_score < 400:
        base_cap = 50  # High-risk
    elif risk_score < 550:
        base_cap = 250 # Medium-risk
    elif risk_score < 700:
        base_cap = 1000 # Good-risk
    else: # 700+
        base_cap = 5000 # Low-risk
        
    # --- 3. Determine Multiplier from Platform History ---
    multiplier = 1.0
    
    if defaulted_loans > 0:
        multiplier = 0.1 # Severely penalize
    elif good_loans > 0:
        # 1 good loan = 1.5x multiplier
        # 2 good loans = 2.0x multiplier
        multiplier = 1.0 + (good_loans * 0.5)
        
    # --- 4. Calculate Final Max Loan ---
    max_loan = base_cap * multiplier
    
    # Return a clean integer
    return int(max_loan)