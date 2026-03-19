package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type AgentPayload struct {
	TenantID        int                      `json:"tenant_id"`
	QueryID         string                   `json:"query_id"`
	RawQuery        string                   `json:"raw_query"`
	NormalizedQuery string                   `json:"normalized_query"`
	ExecutionTimeMs float64                  `json:"execution_time_ms"`
	PlanJSON        []map[string]interface{} `json:"plan_json"`
}

type Client struct {
	HTTPClient *http.Client
	APIURL     string
	AgentID    string
}

func NewClient(apiURL, agentID string) *Client {
	return &Client{
		HTTPClient: &http.Client{Timeout: 5 * time.Second},
		APIURL:     apiURL,
		AgentID:    agentID,
	}
}

func (c *Client) PostIncident(payload AgentPayload) error {
	data, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", c.APIURL, bytes.NewBuffer(data))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Agent-ID", c.AgentID)

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("API returned status code: %d", resp.StatusCode)
	}

	return nil
}
