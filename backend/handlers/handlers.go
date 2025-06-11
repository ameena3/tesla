package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/ameena3/tesla/backend/tesla" // Adjusted import path
	"log"
	"net/http"
	"os"
)

var mockClient tesla.Client = tesla.NewMockClient()
var realClient tesla.Client

// initializeRealClient attempts to initialize the real Tesla client.
// It expects TESLA_VIN environment variable to be set.
// Other credentials (TESLA_KEY_NAME, TESLA_TOKEN_NAME, TESLA_CACHE_FILE)
// are expected by the tesla.NewRealClient via pkg/cli.
func initializeRealClient() {
	vin := os.Getenv("TESLA_VIN")
	if vin == "" {
		log.Println("TESLA_VIN environment variable not set. Real Tesla client will not be available.")
		return
	}

	client, err := tesla.NewRealClient(vin)
	if err != nil {
		log.Printf("Error initializing real Tesla client for VIN %s: %v. Real client will not be available.", vin, err)
		return
	}
	realClient = client
	log.Println("Real Tesla client initialized successfully for VIN:", vin)
}

func init() {
	initializeRealClient()
}

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

// GetStatsHandler handles requests for real vehicle stats.
func GetStatsHandler(w http.ResponseWriter, r *http.Request) {
	if realClient == nil {
		WriteJsonResponse(w, http.StatusServiceUnavailable, map[string]string{"error": "Real Tesla client not initialized. Check server configuration."})
		return
	}
	stats, err := realClient.GetVehicleStats()
	if err != nil {
		WriteJsonResponse(w, http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Error from Tesla API: %v", err)})
		return
	}
	WriteJsonResponse(w, http.StatusOK, stats)
}

// LockVehicleHandler handles requests to lock the vehicle.
func LockVehicleHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		WriteJsonResponse(w, http.StatusMethodNotAllowed, map[string]string{"error": "Method not allowed"})
		return
	}
	if realClient == nil {
		WriteJsonResponse(w, http.StatusServiceUnavailable, map[string]string{"error": "Real Tesla client not initialized. Check server configuration."})
		return
	}
	success, err := realClient.LockVehicle()
	if err != nil {
		WriteJsonResponse(w, http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Error from Tesla API: %v", err)})
		return
	}
	WriteJsonResponse(w, http.StatusOK, map[string]bool{"success": success})
}

// UnlockVehicleHandler handles requests to unlock the vehicle.
func UnlockVehicleHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		WriteJsonResponse(w, http.StatusMethodNotAllowed, map[string]string{"error": "Method not allowed"})
		return
	}
	if realClient == nil {
		WriteJsonResponse(w, http.StatusServiceUnavailable, map[string]string{"error": "Real Tesla client not initialized. Check server configuration."})
		return
	}
	success, err := realClient.UnlockVehicle()
	if err != nil {
		WriteJsonResponse(w, http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Error from Tesla API: %v", err)})
		return
	}
	WriteJsonResponse(w, http.StatusOK, map[string]bool{"success": success})
}

// GetCameraFeedHandler handles requests for the real camera feed.
func GetCameraFeedHandler(w http.ResponseWriter, r *http.Request) {
	if realClient == nil {
		WriteJsonResponse(w, http.StatusServiceUnavailable, map[string]string{"error": "Real Tesla client not initialized. Check server configuration."})
		return
	}
	feedURL, err := realClient.GetCameraFeed()
	if err != nil {
		// Specific error for camera feed not implemented yet by real client
		if err.Error() == "GetCameraFeed not yet fully implemented with SDK" {
			WriteJsonResponse(w, http.StatusNotImplemented, map[string]string{"error": err.Error()})
		} else {
			WriteJsonResponse(w, http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Error from Tesla API: %v", err)})
		}
		return
	}
	WriteJsonResponse(w, http.StatusOK, map[string]string{"camera_feed_url": feedURL})
}
