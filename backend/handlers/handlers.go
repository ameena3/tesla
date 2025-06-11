package handlers

import (
	"encoding/json"
	"github.com/ameena3/tesla/backend/tesla" // Adjusted import path
	"net/http"
)

var mockClient tesla.Client = tesla.NewMockClient()

// realClient will be initialized later, possibly with an API key from config/env
// var realClient tesla.Client = tesla.NewRealClient("YOUR_TESLA_API_KEY_HERE_OR_FROM_ENV")

// WriteJsonResponse is a helper to write JSON responses
func WriteJsonResponse(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	if data != nil {
		json.NewEncoder(w).Encode(data)
	}
}

// DevGetStatsHandler handles requests for dummy stats.
func DevGetStatsHandler(w http.ResponseWriter, r *http.Request) {
	stats, err := mockClient.GetVehicleStats()
	if err != nil {
		WriteJsonResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	WriteJsonResponse(w, http.StatusOK, stats)
}

// DevLockVehicleHandler handles requests to simulate locking the vehicle.
func DevLockVehicleHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		WriteJsonResponse(w, http.StatusMethodNotAllowed, map[string]string{"error": "Method not allowed"})
		return
	}
	success, err := mockClient.LockVehicle()
	if err != nil {
		WriteJsonResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	WriteJsonResponse(w, http.StatusOK, map[string]bool{"success": success})
}

// DevUnlockVehicleHandler handles requests to simulate unlocking the vehicle.
func DevUnlockVehicleHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		WriteJsonResponse(w, http.StatusMethodNotAllowed, map[string]string{"error": "Method not allowed"})
		return
	}
	success, err := mockClient.UnlockVehicle()
	if err != nil {
		WriteJsonResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	WriteJsonResponse(w, http.StatusOK, map[string]bool{"success": success})
}

// DevGetCameraFeedHandler handles requests for a dummy camera feed.
func DevGetCameraFeedHandler(w http.ResponseWriter, r *http.Request) {
	feedURL, err := mockClient.GetCameraFeed()
	if err != nil {
		WriteJsonResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	WriteJsonResponse(w, http.StatusOK, map[string]string{"camera_feed_url": feedURL})
}

// TODO: Implement handlers for real API by initializing and using realClient
// GetStatsHandler, LockVehicleHandler, UnlockVehicleHandler, GetCameraFeedHandler
// These will be very similar to the Dev handlers but will use the realClient.
// They will also need to be protected by API key middleware.

// Real API Handlers (Placeholders)
// These will use a real Tesla client, initialized with an API key.
// For now, they are stubs. A global or context-passed realClient would be needed.

// GetStatsHandler handles requests for real vehicle stats.
func GetStatsHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: Initialize realClient (e.g., realClient := tesla.NewRealClient(os.Getenv("TESLA_API_KEY")))
	// stats, err := realClient.GetVehicleStats()
	// Handle response similar to DevGetStatsHandler
	WriteJsonResponse(w, http.StatusNotImplemented, map[string]string{"message": "Real GetStatsHandler not implemented yet"})
}

// LockVehicleHandler handles requests to lock the vehicle.
func LockVehicleHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		WriteJsonResponse(w, http.StatusMethodNotAllowed, map[string]string{"error": "Method not allowed"})
		return
	}
	// TODO: Initialize and use realClient
	WriteJsonResponse(w, http.StatusNotImplemented, map[string]string{"message": "Real LockVehicleHandler not implemented yet"})
}

// UnlockVehicleHandler handles requests to unlock the vehicle.
func UnlockVehicleHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		WriteJsonResponse(w, http.StatusMethodNotAllowed, map[string]string{"error": "Method not allowed"})
		return
	}
	// TODO: Initialize and use realClient
	WriteJsonResponse(w, http.StatusNotImplemented, map[string]string{"message": "Real UnlockVehicleHandler not implemented yet"})
}

// GetCameraFeedHandler handles requests for the real camera feed.
func GetCameraFeedHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: Initialize and use realClient
	WriteJsonResponse(w, http.StatusNotImplemented, map[string]string{"message": "Real GetCameraFeedHandler not implemented yet"})
}
