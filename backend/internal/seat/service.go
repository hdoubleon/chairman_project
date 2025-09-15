package seat

import (
	"context"
	"errors"
	"sync"
)

// ErrSeatNotFound is returned when a seat does not exist.
var ErrSeatNotFound = errors.New("seat not found")

// Seat represents a single seat status.
type Seat struct {
	ID     int    `json:"id"`
	Status string `json:"status"` // "empty" or "occupied"
}

// Service provides seat-related operations.
type Service interface {
	ListSeats(ctx context.Context) ([]Seat, error)
}

// InMemoryService is a simple in-memory implementation of Service.
type InMemoryService struct {
	mu    sync.RWMutex
	seats []Seat
}

// NewInMemoryService initializes an in-memory seat service.
func NewInMemoryService(initial []Seat) *InMemoryService {
	cp := make([]Seat, len(initial))
	copy(cp, initial)
	return &InMemoryService{seats: cp}
}

// ListSeats returns a snapshot of the current seats.
func (s *InMemoryService) ListSeats(_ context.Context) ([]Seat, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	out := make([]Seat, len(s.seats))
	copy(out, s.seats)
	return out, nil
}
