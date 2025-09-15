package main

import (
	"log"
	"net/http"

	"chairman/internal/seat"
)

func main() {
	svc := seat.NewInMemoryService([]seat.Seat{
		{ID: 1, Status: "empty"},
		{ID: 2, Status: "occupied"},
		{ID: 3, Status: "empty"},
	})

	handler := seat.Handler(svc)

	log.Println("server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
