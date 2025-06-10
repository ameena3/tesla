package tesla

import "fmt"

// MockClient is a mock implementation of the Tesla Client interface.
type MockClient struct{}

// NewMockClient creates a new instance of MockClient.
func NewMockClient() *MockClient {
	return &MockClient{}
}

// GetVehicleStats returns dummy vehicle statistics.
func (mc *MockClient) GetVehicleStats() (map[string]interface{}, error) {
	return map[string]interface{}{
		"vehicle_name": "DevTesla",
		"battery_level": 75,
		"range_miles":   200,
		"locked":        true,
		"location":      "123 Mock St, Dev City",
		"charging":      false,
	}, nil
}

// LockVehicle simulates locking the vehicle.
func (mc *MockClient) LockVehicle() (bool, error) {
	fmt.Println("MockClient: Vehicle locked")
	return true, nil
}

// UnlockVehicle simulates unlocking the vehicle.
func (mc *MockClient) UnlockVehicle() (bool, error) {
	fmt.Println("MockClient: Vehicle unlocked")
	return true, nil
}

// GetCameraFeed returns a dummy camera feed URL.
func (mc *MockClient) GetCameraFeed() (string, error) {
	return "https://via.placeholder.com/1280x720.png?text=Mock+Camera+Feed", nil
}
