import sys
import os
import json

# Add the backend app to the path so we can import the module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

try:
    from app.modules.insights.services.llm_service import generate_insight
    
    # Test query and issues
    query = "SELECT * FROM users WHERE email = 'test@example.com'"
    issues = ["Seq Scan on 'users' with filter (Requires pg_auto_explain for exact params) - strongly consider an index."]
    plan_json = {"Plan": {"Node Type": "Seq Scan", "Relation Name": "users", "Total Cost": 100.0}}
    
    print("Sending test request to Ollama...")
    result = generate_insight(query, issues, [plan_json])
    
    print("\n[OLLAMA RESULT]")
    print(json.dumps(result, indent=2))
    
    if "normally Ollama would elaborate" in result.get("analysis", ""):
        print("\n[VERIFICATION FAILED]: Falling back to mock response. Is Ollama running?")
    else:
        print("\n[VERIFICATION SUCCESS]: Ollama qwen2.5 served a real diagnosis!")

except Exception as e:
    print(f"\n[CRITICAL ERROR]: {str(e)}")
    import traceback
    traceback.print_exc()
