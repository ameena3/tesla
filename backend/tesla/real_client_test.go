package tesla

import (
	"os"
	"testing"
)

func TestNewRealClient_MissingEnvVars(t *testing.T) {
	// Store original environment variables to restore them later
	originalVIN := os.Getenv("TESLA_VIN")
	originalKeyName := os.Getenv("TESLA_KEY_NAME")
	originalTokenName := os.Getenv("TESLA_TOKEN_NAME")
	originalCacheFile := os.Getenv("TESLA_CACHE_FILE")

	// Unset environment variables crucial for cli.Config initialization and connection
	// Note: t.Setenv is available in Go 1.17+. If using an older version,
	// os.Setenv and os.Unsetenv would be used, with more care for parallel tests.
	if err := os.Unsetenv("TESLA_VIN"); err != nil {
		// t.Setenv in Go 1.17+ handles this more gracefully.
		// For older Go, os.Unsetenv might error if var not set; ignore for test setup.
	}
	if err := os.Unsetenv("TESLA_KEY_NAME"); err != nil {
		// as above
	}
	if err := os.Unsetenv("TESLA_TOKEN_NAME"); err != nil {
		// as above
	}
	if err := os.Unsetenv("TESLA_CACHE_FILE"); err != nil {
		// as above
	}


	// Restore environment variables after the test
	defer func() {
		os.Setenv("TESLA_VIN", originalVIN)
		os.Setenv("TESLA_KEY_NAME", originalKeyName)
		os.Setenv("TESLA_TOKEN_NAME", originalTokenName)
		os.Setenv("TESLA_CACHE_FILE", originalCacheFile)
	}()

	// Call NewRealClient with a VIN argument.
	// Even if a VIN is passed as an argument, NewRealClient internally uses cli.Config,
	// which relies on environment variables (TESLA_KEY_NAME, TESLA_TOKEN_NAME etc.)
	// for loading credentials and establishing a connection.
	// Without these, cliCfg.Connect() is expected to fail.
	client, err := NewRealClient("test-vin-arg")

	if err == nil {
		t.Errorf("NewRealClient() was expected to return an error when crucial environment variables are missing, but it did not")
	}

	if client != nil {
		t.Errorf("NewRealClient() was expected to return a nil client when an error occurs, but it returned a non-nil client")
	}

	// Further check on error message if desired, e.g. strings.Contains(err.Error(), "TESLA_KEY_NAME")
	// For now, just checking for any error is sufficient for this basic test.
}
