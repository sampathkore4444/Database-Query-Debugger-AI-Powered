import time
import psycopg2

print("Connecting to monitored database...")
conn = psycopg2.connect("postgresql://postgres:postgres@localhost:5433/user_db")
conn.autocommit = True
cur = conn.cursor()

# Enable extension
cur.execute("CREATE EXTENSION IF NOT EXISTS pg_stat_statements;")
cur.execute("SELECT pg_stat_statements_reset();")

print("Creating dummy table and populating 500,000 rows (this takes a moment)...")
cur.execute("DROP TABLE IF EXISTS test_users;")
cur.execute("""
    CREATE TABLE test_users (
        id SERIAL PRIMARY KEY,
        email TEXT,
        status TEXT
    );
""")
cur.execute("""
    INSERT INTO test_users (email, status)
    SELECT 'user' || generate_series(1, 500000) || '@example.com', 'active';
""")

print("Data populated. Running unindexed queries...")
for _ in range(5):
    cur.execute("SELECT * FROM test_users WHERE email = 'user450000@example.com';")
    cur.fetchall()

print("Slow queries generated. The Go Sidecar Agent should detect them shortly.")
cur.close()
conn.close()
