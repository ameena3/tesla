package main

import (
	"fmt"
	"github.com/ameena3/tesla/backend/handlers"
	"github.com/ameena3/tesla/backend/middleware"
	"github.com/ameena3/tesla/backend/tesla" // Required for initializing real client later
	"log"
	"net/http"
	"os" // Required for initializing real client later
)

var realTeslaClient tesla.Client // Declare at package level

func main() {
	// Initialize Real Tesla Client - this is a basic way.
	// In a production app, consider when and how apiKey is refreshed if it's short-lived.
	// For now, we'll rely on an environment variable.
	// The actual client will only be used if TESLA_API_KEY is set.
	apiKey := os.Getenv("TESLA_API_KEY")
	if apiKey != "" {
		realTeslaClient = tesla.NewRealClient(apiKey)
		fmt.Println("Real Tesla client initialized with API key from TESLA_API_KEY env var.")
	} else {
		fmt.Println("TESLA_API_KEY environment variable not set. Real API endpoints will not be fully functional.")
		// We can let it be nil, and the handlers should check or we can use a mock client for real endpoints too if no key
		// For now, the handlers for real endpoints are placeholders.
	}

	// Dev API routes (no auth needed)
	http.HandleFunc("/api/dev/stats", handlers.DevGetStatsHandler)
	http.HandleFunc("/api/dev/lock", handlers.DevLockVehicleHandler)
	http.HandleFunc("/api/dev/unlock", handlers.DevUnlockVehicleHandler)
	http.HandleFunc("/api/dev/camera", handlers.DevGetCameraFeedHandler)

	// Real API routes (protected by API Key Auth Middleware)
	// Note: The actual client injection into these handlers needs to be thought out.
	// For now, they are placeholders. A better way would be to pass the client to the handlers.
	// e.g. http.Handle("/api/stats", middleware.APIKeyAuthMiddleware(handlers.GetStatsHandler(realTeslaClient)))
	// This requires handlers.GetStatsHandler to be a function that returns an http.Handler or http.HandlerFunc
	// and takes a tesla.Client as an argument. We will refactor this later if needed.
	// For simplicity now, the handlers themselves would need to access the global `realTeslaClient` or initialize one.
	// The current placeholder handlers don't use the client yet.

	http.HandleFunc("/api/stats", middleware.APIKeyAuthMiddleware(handlers.GetStatsHandler))
	http.HandleFunc("/api/lock", middleware.APIKeyAuthMiddleware(handlers.LockVehicleHandler))
	http.HandleFunc("/api/unlock", middleware.APIKeyAuthMiddleware(handlers.UnlockVehicleHandler))
	http.HandleFunc("/api/camera", middleware.APIKeyAuthMiddleware(handlers.GetCameraFeedHandler))

	fmt.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Could not start server: %s\n", err.Error())
	}
}
