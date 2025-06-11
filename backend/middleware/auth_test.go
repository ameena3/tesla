package middleware

import (
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
)

// dummyHandler is a simple http.HandlerFunc for testing middleware.
var dummyHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
})

func TestAPIKeyAuthMiddleware(t *testing.T) {
	// Store original TESLA_API_KEY and restore it after the test
	originalAPIKey := os.Getenv("TESLA_API_KEY")
	defer os.Setenv("TESLA_API_KEY", originalAPIKey)

	// Case 1: TESLA_API_KEY not set on server
	os.Unsetenv("TESLA_API_KEY")
	req1, _ := http.NewRequest("GET", "/", nil)
	rr1 := httptest.NewRecorder()
	APIKeyAuthMiddleware(dummyHandler).ServeHTTP(rr1, req1)
	if rr1.Code != http.StatusInternalServerError {
		t.Errorf("Case 1: Expected status %d, got %d", http.StatusInternalServerError, rr1.Code)
	}
    expectedError1 := `{"error":"API key not configured on server"}`
	if strings.TrimSpace(rr1.Body.String()) != expectedError1 {
		t.Errorf("Case 1: Expected body %s, got %s", expectedError1, rr1.Body.String())
	}


	// Setup for subsequent tests: Set a TESLA_API_KEY
	testAPIKey := "test-secret-key"
	os.Setenv("TESLA_API_KEY", testAPIKey)

	// Case 2: No X-API-KEY header provided by client
	req2, _ := http.NewRequest("GET", "/", nil)
	rr2 := httptest.NewRecorder()
	APIKeyAuthMiddleware(dummyHandler).ServeHTTP(rr2, req2)
	if rr2.Code != http.StatusUnauthorized {
		t.Errorf("Case 2: Expected status %d, got %d", http.StatusUnauthorized, rr2.Code)
	}
    expectedError2 := `{"error":"API key missing in X-API-KEY header"}`
	if strings.TrimSpace(rr2.Body.String()) != expectedError2 {
		t.Errorf("Case 2: Expected body %s, got %s", expectedError2, rr2.Body.String())
	}

	// Case 3: Incorrect X-API-KEY header provided
	req3, _ := http.NewRequest("GET", "/", nil)
	req3.Header.Set("X-API-KEY", "wrong-key")
	rr3 := httptest.NewRecorder()
	APIKeyAuthMiddleware(dummyHandler).ServeHTTP(rr3, req3)
	if rr3.Code != http.StatusUnauthorized {
		t.Errorf("Case 3: Expected status %d, got %d", http.StatusUnauthorized, rr3.Code)
	}
    expectedError3 := `{"error":"Invalid API key"}`
	if strings.TrimSpace(rr3.Body.String()) != expectedError3 {
		t.Errorf("Case 3: Expected body %s, got %s", expectedError3, rr3.Body.String())
	}


	// Case 4: Correct X-API-KEY header provided
	req4, _ := http.NewRequest("GET", "/", nil)
	req4.Header.Set("X-API-KEY", testAPIKey)
	rr4 := httptest.NewRecorder()
	APIKeyAuthMiddleware(dummyHandler).ServeHTTP(rr4, req4)
	if rr4.Code != http.StatusOK {
		t.Errorf("Case 4: Expected status %d, got %d", http.StatusOK, rr4.Code)
	}
	if rr4.Body.String() != "OK" {
		t.Errorf("Case 4: Expected body 'OK', got '%s'", rr4.Body.String())
	}
}
