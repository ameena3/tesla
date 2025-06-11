# Stage 1: Build the Go application
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod ./
# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source code into the container
COPY . .

# Build the Go app
# -ldflags="-w -s" reduces the size of the binary by removing debug information
# CGO_ENABLED=0 disables Cgo, producing a statically-linked binary (important for scratch or distroless)
RUN CGO_ENABLED=0 GOOS=linux go build -a -ldflags="-w -s" -o /app/tesla-dashboard-backend ./main.go

# Stage 2: Run the application in a minimal image
FROM alpine:latest

WORKDIR /app

# Copy the built executable from the builder stage
COPY --from=builder /app/tesla-dashboard-backend /app/tesla-dashboard-backend

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the executable
# The backend will look for TESLA_API_KEY environment variable for real API mode
CMD ["/app/tesla-dashboard-backend"]
