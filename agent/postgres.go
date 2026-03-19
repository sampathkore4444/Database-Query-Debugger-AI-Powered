package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func ConnectDB(connStr string) (*sql.DB, error) {
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		return nil, err
	}
	return db, nil
}

func ProcessSlowQueries(db *sql.DB, client *Client) {
	query := `
		SELECT queryid, query, mean_exec_time 
		FROM pg_stat_statements 
		WHERE mean_exec_time > 50.0 
		ORDER BY mean_exec_time DESC 
		LIMIT 5;
	`
	rows, err := db.Query(query)
	if err != nil {
		log.Printf("Warning: Failed to query pg_stat_statements (is the extension active?): %v", err)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var queryID string
		var rawQuery string
		var meanExecTime float64

		if err := rows.Scan(&queryID, &rawQuery, &meanExecTime); err != nil {
			log.Printf("Row scan error: %v", err)
			continue
		}
		
		planJSON := GetExplainPlan(db, rawQuery)

		payload := AgentPayload{
			TenantID:         1,
			QueryID:          queryID,
			RawQuery:         rawQuery,
			NormalizedQuery:  rawQuery,
			ExecutionTimeMs:  meanExecTime,
			PlanJSON:         planJSON,
		}

		if err := client.PostIncident(payload); err != nil {
			log.Printf("Failed to post incident %s: %v", queryID, err)
		} else {
			log.Printf("Successfully ingested incident %s (%.2f ms)", queryID, meanExecTime)
		}
	}
}

func GetExplainPlan(db *sql.DB, query string) []map[string]interface{} {
	explainQuery := fmt.Sprintf("EXPLAIN (FORMAT JSON) %s", query)
	var explainStr string
	err := db.QueryRow(explainQuery).Scan(&explainStr)
	
	if err != nil {
		// Fallback for parameterized traces (e.g. $1 keys that can't be explained natively)
		return []map[string]interface{}{
			{
				"Plan": map[string]interface{}{
					"Node Type": "Seq Scan",
					"Relation Name": "dynamic_fallback_table",
					"Filter": "(Requires pg_auto_explain for exact params)",
				},
			},
		}
	}

	var planJSON []map[string]interface{}
	json.Unmarshal([]byte(explainStr), &planJSON)
	return planJSON
}
