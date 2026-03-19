import sqlite3
import os

db_path = "query_debugger.db"
if not os.path.exists(db_path):
    print(f"Database file {db_path} not found.")
else:
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    try:
        cur.execute("SELECT id, user_id, query_id, execution_time_ms, timestamp FROM query_incidents ORDER BY timestamp DESC LIMIT 10;")
        rows = cur.fetchall()
        print(f"\n[QUERY_INCIDENTS Table - Total: {len(rows)} latest rows]")
        for row in rows:
            print(f"ID: {row[0]} | User: {row[1]} | Hash: {row[2]} | Time: {row[3]}ms | Date: {row[4]}")
    except Exception as e:
        print(f"Error reading query_incidents: {e}")
    conn.close()
