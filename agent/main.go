package main

import (
	"log"
	"os"
	"time"
)

func main() {
	log.Println("Starting AntiGravity AI - Telemetry Sidecar Agent")

	dbConnStr := os.Getenv("DATABASE_URL")
	if dbConnStr == "" {
		dbConnStr = "postgres://postgres:postgres@localhost:5433/user_db?sslmode=disable"
	}

	apiURL := os.Getenv("INGESTION_API_URL")
	if apiURL == "" {
		apiURL = "http://localhost:8000/api/v1/agents/ingest"
	}

	agentID := os.Getenv("AGENT_ID")
	if agentID == "" {
		agentID = "local-dev-agent-1"
	}

	db, err := ConnectDB(dbConnStr)
	if err != nil {
		log.Fatalf("Failed to connect to monitored database: %v", err)
	}
	defer db.Close()

	client := NewClient(apiURL, agentID)

	pollInterval := 10 * time.Second
	log.Printf("Agent initialized. Polling pg_stat_statements every %s...", pollInterval)

	ticker := time.NewTicker(pollInterval)
	for range ticker.C {
		ProcessSlowQueries(db, client)
	}
}
