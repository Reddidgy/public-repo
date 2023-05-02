package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(`{"Hello" : "world!"}`))
	})

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatalf("error: %v", err)
	}
}
