package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"tesla-dashboard/backend/tesla" // Ensure correct import path
)

func TestDevGetStatsHandler(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/dev/stats", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(DevGetStatsHandler)
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	// Check the response body
	expected := tesla.NewMockClient()
	expectedStats, _ := expected.GetVehicleStats()
	expectedJSON, _ := json.Marshal(expectedStats)

	if strings.TrimSpace(rr.Body.String()) != string(expectedJSON) {
		t.Errorf("handler returned unexpected body: got %v want %v", rr.Body.String(), string(expectedJSON))
	}
}

func TestDevLockVehicleHandler(t *testing.T) {
	// Test POST (successful)
	reqPost, errPost := http.NewRequest("POST", "/api/dev/lock", nil)
	if errPost != nil {
		t.Fatal(errPost)
	}
	rrPost := httptest.NewRecorder()
	handlerPost := http.HandlerFunc(DevLockVehicleHandler)
	handlerPost.ServeHTTP(rrPost, reqPost)

	if status := rrPost.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code for POST: got %v want %v", status, http.StatusOK)
	}
	expectedBody := `{"success":true}`
	if strings.TrimSpace(rrPost.Body.String()) != expectedBody {
		t.Errorf("handler returned unexpected body for POST: got %v want %v", rrPost.Body.String(), expectedBody)
	}

	// Test GET (method not allowed)
	reqGet, errGet := http.NewRequest("GET", "/api/dev/lock", nil)
	if errGet != nil {
		t.Fatal(errGet)
	}
	rrGet := httptest.NewRecorder()
	handlerGet := http.HandlerFunc(DevLockVehicleHandler)
	handlerGet.ServeHTTP(rrGet, reqGet)

	if status := rrGet.Code; status != http.StatusMethodNotAllowed {
		t.Errorf("handler returned wrong status code for GET: got %v want %v", status, http.StatusMethodNotAllowed)
	}
}

// Add similar tests for DevUnlockVehicleHandler and DevGetCameraFeedHandler
func TestDevUnlockVehicleHandler(t *testing.T) {
	// Test POST (successful)
	reqPost, errPost := http.NewRequest("POST", "/api/dev/unlock", nil)
	if errPost != nil {
		t.Fatal(errPost)
	}
	rrPost := httptest.NewRecorder()
	handlerPost := http.HandlerFunc(DevUnlockVehicleHandler)
	handlerPost.ServeHTTP(rrPost, reqPost)

	if status := rrPost.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code for POST: got %v want %v", status, http.StatusOK)
	}
	expectedBody := `{"success":true}` // Assuming mock always returns true
	if strings.TrimSpace(rrPost.Body.String()) != expectedBody {
		t.Errorf("handler returned unexpected body for POST: got %v want %v", rrPost.Body.String(), expectedBody)
	}

	// Test GET (method not allowed)
	reqGet, errGet := http.NewRequest("GET", "/api/dev/unlock", nil)
	if errGet != nil {
		t.Fatal(errGet)
	}
	rrGet := httptest.NewRecorder()
	handlerGet := http.HandlerFunc(DevUnlockVehicleHandler)
	handlerGet.ServeHTTP(rrGet, reqGet)

	if status := rrGet.Code; status != http.StatusMethodNotAllowed {
		t.Errorf("handler returned wrong status code for GET: got %v want %v", status, http.StatusMethodNotAllowed)
	}
}

func TestDevGetCameraFeedHandler(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/dev/camera", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(DevGetCameraFeedHandler)
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	expectedClient := tesla.NewMockClient()
	expectedURL, _ := expectedClient.GetCameraFeed()
	expectedBody := `{"camera_feed_url":"` + expectedURL + `"}`
	if strings.TrimSpace(rr.Body.String()) != expectedBody {
		t.Errorf("handler returned unexpected body: got %v want %v", rr.Body.String(), expectedBody)
	}
}
