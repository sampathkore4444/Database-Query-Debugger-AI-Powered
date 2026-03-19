import psycopg2

try:
    # Try connecting to the MONITORED database (Port 5433)
    conn = psycopg2.connect(
        dbname="user_db",
        user="postgres",
        password="postgres",
        host="localhost",
        port="5433"
    )
    cur = conn.cursor()
    cur.execute("SELECT query, mean_exec_time FROM pg_stat_statements WHERE query LIKE '%pg_sleep%' ORDER BY mean_exec_time DESC LIMIT 5;")
    rows = cur.fetchall()
    
    print("\n[PG_STAT_STATEMENTS on Port 5433]")
    if not rows:
        print("No pg_sleep queries found in statistics.")
    for row in rows:
        print(f"Query: {row[0]} | Mean Time: {row[1]}ms")
        
    cur.close()
    conn.close()
except Exception as e:
    print(f"\n[ERROR Connecting to Monitored DB (5433)]: {e}")

try:
    # Also check the DEFAULT database (Port 5432) just in case
    conn2 = psycopg2.connect(
        dbname="postgres",
        user="postgres",
        password="postgres",
        host="localhost",
        port="5432"
    )
    cur2 = conn2.cursor()
    cur2.execute("SELECT 1") # Just check if it's there
    print("\n[Port 5432 is Reachable]")
    cur2.close()
    conn2.close()
except Exception as e:
    print(f"\n[Port 5432 is Unreachable or needs different credentials]: {e}")
