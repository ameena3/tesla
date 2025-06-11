package middleware

import (
	"github.com/ameena3/tesla/backend/handlers" // For WriteJsonResponse
	"net/http"
	"os" // For getting API key from environment variable
)

// APIKeyAuthMiddleware protects routes that require a valid API key.
// It checks for an "X-API-KEY" header.
func APIKeyAuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// In a real application, the expected API key would come from a secure config or env variable.
		// For now, let's assume it's stored in an environment variable TESLA_API_KEY.
		expectedAPIKey := os.Getenv("TESLA_API_KEY")
		if expectedAPIKey == "" {
			// This is a server configuration error if the key isn't set for routes that need it.
			// Log this internally. For the client, it's an unauthorized access.
			handlers.WriteJsonResponse(w, http.StatusInternalServerError, map[string]string{"error": "API key not configured on server"})
			return
		}

		providedKey := r.Header.Get("X-API-KEY")
		if providedKey == "" {
			handlers.WriteJsonResponse(w, http.StatusUnauthorized, map[string]string{"error": "API key missing in X-API-KEY header"})
			return
		}

		if providedKey != expectedAPIKey {
			handlers.WriteJsonResponse(w, http.StatusUnauthorized, map[string]string{"error": "Invalid API key"})
			return
		}

		next.ServeHTTP(w, r)
	}
}
