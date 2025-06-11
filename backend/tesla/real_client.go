package tesla

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"

	"github.com/teslamotors/vehicle-command/pkg/cli"
	"github.com/teslamotors/vehicle-command/pkg/vehicle"
	"github.com/teslamotors/vehicle-command/pkg/protocol/protobuf/carserver" // For VehicleData and StateCategory
)

// RealClient is the implementation for interacting with the actual Tesla API.
type RealClient struct {
	vehicle *vehicle.Vehicle
}

// NewRealClient creates a new instance of RealClient using pkg/cli for setup.
// Environment variables like TESLA_VIN, TESLA_KEY_NAME, TESLA_TOKEN_NAME, TESLA_CACHE_FILE are expected.
func NewRealClient(vehicleID string) (*RealClient, error) {
	if vehicleID == "" {
		return nil, errors.New("vehicle ID (VIN) is required for RealClient")
	}

	// 1. Create CLI Config
	// FlagBLE is included as per prompt, though for pure internet connectivity, VIN|OAuth|PrivateKey might be enough.
	cliCfg, err := cli.NewConfig(cli.FlagVIN | cli.FlagOAuth | cli.FlagPrivateKey | cli.FlagBLE)
	if err != nil {
		return nil, fmt.Errorf("failed to create cli config: %w", err)
	}

	// 2. Set VIN explicitly (though ReadFromEnvironment might also pick it up if TESLA_VIN is set)
	cliCfg.VIN = vehicleID

	// 3. Load settings from Environment Variables
	// This will attempt to populate fields like KeyFilename, TokenFilename, CacheFilename, etc.,
	// from TESLA_KEY_FILE, TESLA_TOKEN_FILE, TESLA_CACHE_FILE.
	// It also reads TESLA_KEY_NAME, TESLA_TOKEN_NAME for keyring identification.
	cliCfg.ReadFromEnvironment()

	// 4. Load Credentials (potentially from keyring if filenames aren't set or found)
	if err := cliCfg.LoadCredentials(); err != nil {
		// This step prompts for keyring password if needed.
		return nil, fmt.Errorf("failed to load credentials via cli config: %w", err)
	}

	// 5. Connect to the vehicle using the cli.Config
	// This handles obtaining private key, OAuth token, and establishing the connection.
	// It returns an account object (which we don't use directly here) and the vehicle object.
	ctx := context.Background() // Or a more specific context
	_, car, err := cliCfg.Connect(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to vehicle via cli config: %w", err)
	}
	if car == nil {
		return nil, errors.New("cli config connected but returned a nil car object")
	}

	// The cli.Config.Connect should handle waking the vehicle if necessary,
	// and also manage session caching via UpdateCachedSessions if set up.
	// We might want to call `defer cliCfg.UpdateCachedSessions(car)` if we make cliCfg part of RealClient or manage its lifecycle.
	// For now, the session cache is updated when `tesla-control` (the CLI tool) exits.
	// In a long-running server, this might need more explicit management if cliCfg is not persisted.

	return &RealClient{vehicle: car}, nil
}

// GetVehicleStats fetches real vehicle statistics using the Tesla SDK.
func (rc *RealClient) GetVehicleStats() (map[string]interface{}, error) {
	if rc.vehicle == nil {
		return nil, errors.New("Tesla client not initialized")
	}

	ctx := context.Background()
	// Fetch the comprehensive VehicleData object.
	// The category given here might influence what data is prioritized or ensured,
	// but when connected via Fleet API (as cli.Connect likely does),
	// the returned VehicleData object is often populated with most available states.
	vehicleData, err := rc.vehicle.GetState(ctx, vehicle.StateCategoryCharge) // Using StateCategoryCharge as a starting point.
	if err != nil {
		return nil, fmt.Errorf("SDK error getting vehicle data: %w", err)
	}

	if vehicleData == nil {
		return nil, errors.New("SDK returned nil vehicle data")
	}

	// Marshal the entire carserver.VehicleData object to JSON, then to map.
	var statsMap map[string]interface{}
	jsonData, err := json.Marshal(vehicleData)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal vehicle data to JSON: %w", err)
	}
	err = json.Unmarshal(jsonData, &statsMap)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal vehicle data JSON to map: %w", err)
	}

	// Add VIN to the map as it's a key identifier, accessible from the vehicle object.
	statsMap["vin"] = rc.vehicle.VIN()

	return statsMap, nil
}

// LockVehicle sends a command to lock the vehicle using the Tesla SDK.
func (rc *RealClient) LockVehicle() (bool, error) {
	if rc.vehicle == nil {
		return false, errors.New("Tesla client not initialized")
	}
	ctx := context.Background()
	err := rc.vehicle.Lock(ctx)
	if err != nil {
		return false, fmt.Errorf("SDK error locking vehicle: %w", err)
	}
	return true, nil
}

// UnlockVehicle sends a command to unlock the vehicle using the Tesla SDK.
func (rc *RealClient) UnlockVehicle() (bool, error) {
	if rc.vehicle == nil {
		return false, errors.New("Tesla client not initialized")
	}
	ctx := context.Background()
	err := rc.vehicle.Unlock(ctx)
	if err != nil {
		return false, fmt.Errorf("SDK error unlocking vehicle: %w", err)
	}
	return true, nil
}

// GetCameraFeed fetches the real camera feed using the Tesla SDK.
func (rc *RealClient) GetCameraFeed() (string, error) {
	if rc.vehicle == nil {
		return "", errors.New("Tesla client not initialized")
	}
	// TODO: Camera feed functionality is not directly available in pkg/vehicle's high-level API.
	// This might require using v.Send() with specific protobuf messages for the carserver domain,
	// or it might be part of a different API/package not yet explored.
	// For now, returning not implemented.
	return "", errors.New("GetCameraFeed not yet fully implemented with SDK")
}
