package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/mux"
)

var ctx = context.Background()
var rdb *redis.Client

func init() {
	rdb = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
}

type User struct {
	Username string `json:"username"`
	Points   int    `json:"points"`
}

type GameState struct {
	Username    string   `json:"username"`
	Points      int      `json:"points"`
	Deck        []string `json:"deck"`
	GameStarted bool     `json:"game_started"`
	GameEnded   bool     `json:"game_ended"`
}

func createUserHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err := rdb.Set(ctx, user.Username, user.Points, 0).Err()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func updateUserHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	username := params["username"]

	var user User
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	val, err := rdb.Get(ctx, username).Result()
	if err == redis.Nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	oldPoints, _ := strconv.Atoi(val)
	newPoints := oldPoints + user.Points

	rdb.Set(ctx, username, newPoints, 0)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(User{Username: username, Points: newPoints})
}

func startGameHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	username := params["username"]

	val, err := rdb.Get(ctx, username).Result()
	if err == redis.Nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	points, _ := strconv.Atoi(val)

	gameState := &GameState{
		Username:    username,
		Points:      points,
		Deck:        generateDeck(), // Assuming generateDeck() generates a deck of cards
		GameStarted: true,
		GameEnded:   false,
	}

	gameStateJSON, _ := json.Marshal(gameState)

	err = rdb.Set(ctx, "game:"+username, gameStateJSON, 0).Err()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(gameState)
}

func drawCardHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	username := params["username"]

	gameStateJSON, err := rdb.Get(ctx, "game:"+username).Result()
	if err == redis.Nil {
		http.Error(w, "Game not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var gameState GameState
	json.Unmarshal([]byte(gameStateJSON), &gameState)

	if !gameState.GameStarted || gameState.GameEnded {
		http.Error(w, "Game not started or already ended", http.StatusBadRequest)
		return
	}

	drawnCard := gameState.Deck[0]
	gameState.Deck = gameState.Deck[1:]

	if drawnCard == "exploding_kitten" {
		gameState.GameEnded = true
	} else if drawnCard == "defuse" {
		// handle defuse card logic here
	} else if drawnCard == "shuffle" {
		// handle shuffle card logic here
	} else {
		gameState.Points++
	}

	gameStateJSON, _ = json.Marshal(gameState)

	rdb.Set(ctx, "game:"+username, gameStateJSON, 0)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(gameState)
}

func getLeaderboardHandler(w http.ResponseWriter, r *http.Request) {
	// Fetch leaderboard from Redis and return as JSON
}

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/users/{username}", createUserHandler).Methods("POST")
	r.HandleFunc("/users/{username}", updateUserHandler).Methods("PUT")
	r.HandleFunc("/games/{username}", startGameHandler).Methods("POST")
	r.HandleFunc("/games/{username}/draw", drawCardHandler).Methods("POST")
	r.HandleFunc("/leaderboard", getLeaderboardHandler).Methods("GET")

	srv := &http.Server{
		Handler:      r,
		Addr:         ":8000",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
