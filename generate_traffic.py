import psycopg2
import time
import requests

try:
    # Programmatic registration (bypass curl aliases)
    res = requests.post("http://localhost:8000/api/v1/auth/register", json={"email": "admin@antigravity.io", "password": "password"})
    print("Registration:", res.status_code)
except Exception as e:
    print("Registration error:", e)

conn = psycopg2.connect("postgresql://postgres:postgres@localhost:5433/user_db")
conn.autocommit = True
cur = conn.cursor()

# Pre-requisite
cur.execute("CREATE EXTENSION IF NOT EXISTS pg_stat_statements;")

# Create a sample multi-tenant table
cur.execute("CREATE TABLE IF NOT EXISTS tenant_data_stream (id int, name varchar);")
# Batch insert
from psycopg2.extras import execute_values
data = [(i, f'TenantData_{i}') for i in range(500)]
execute_values(cur, "INSERT INTO tenant_data_stream VALUES %s", data)

print("Generating heavily unoptimized DB traffic to trigger Telemetry Tracker...")
# We use pg_sleep to securely simulate a slow response without hanging python
for _ in range(5):
    cur.execute("""
        SELECT a.id, b.name, pg_sleep(0.05)
        FROM tenant_data_stream a 
        CROSS JOIN tenant_data_stream b 
        LIMIT 10
    """)
    time.sleep(1) # Let the agent poll

print("Traffic completed.")
