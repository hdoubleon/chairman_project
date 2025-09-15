package seat

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// Handler returns an HTTP handler for seat endpoints.
func Handler(svc Service) http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/api/seats", listSeatsHandler(svc))
	return mux
}

func listSeatsHandler(svc Service) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
			return
		}
		seats, err := svc.ListSeats(r.Context())
		if err != nil {
			http.Error(w, fmt.Sprintf("list seats: %v", err), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		if err := json.NewEncoder(w).Encode(seats); err != nil {
			http.Error(w, "encode response", http.StatusInternalServerError)
			return
		}
	})
}
