import re
import hashlib

def normalize_sql(raw_sql: str) -> str:
    """
    Strips literal strings and numbers from raw SQL to construct a generic footprint.
    Example: `SELECT * FROM users WHERE id = 12` -> `SELECT * FROM users WHERE id = ?`
    """
    # Eviscerate single-quoted strings
    sql = re.sub(r"'(?:[^']|'')*'", '?', raw_sql)
    # Eviscerate numeric literals
    sql = re.sub(r'\b\d+(?:\.\d+)?\b', '?', sql)
    # Standardize whitespace and casing
    sql = re.sub(r'\s+', ' ', sql).strip().lower()
    return sql

def generate_query_hash(normalized_sql: str) -> str:
    """Generates a deterministic 64-character SHA-256 footprint hash of the query structure."""
    return hashlib.sha256(normalized_sql.encode('utf-8')).hexdigest()

def evaluate_rules(plan_json: dict) -> list:
    """Applies deterministic Rules (No AI) to the raw Execution Plan."""
    issues = []
    plan_str = str(plan_json).lower()
    
    if "seq scan" in plan_str:
        issues.append("Sequential Scan Detected")
    if "nested loop" in plan_str:
        issues.append("Nested Loop Join Detected")
    if "hash join" in plan_str:
        issues.append("Hash Join Detected")
        
    return issues
