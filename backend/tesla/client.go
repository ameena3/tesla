package tesla

// Client defines the interface for interacting with the Tesla API (or a mock).
type Client interface {
	GetVehicleStats() (map[string]interface{}, error)
	LockVehicle() (bool, error)
	UnlockVehicle() (bool, error)
	GetCameraFeed() (string, error) // Returns a URL or data for the camera feed
}
