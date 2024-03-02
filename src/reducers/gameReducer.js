const initialState = {
    username: '',
    points: 0,
    gameStarted: false,
    gameEnded: false,
    deck: [
      { id: 1, value: 10 },
      { id: 2, value: 5 },
      { id: 3, value: 20 },
      { id: 4, value: 15 },
    ],
  };
  
  const gameReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'START_GAME':
        return {
          ...state,
          gameStarted: true,
          gameEnded: false,
        };
      case 'DRAW_CARD':
        if (state.deck.length === 0) {
          return {
            ...state,
            gameEnded: true,
          };
        }
        const card = state.deck.shift();
        const updatedPoints = state.points + card.value;
        return {
          ...state,
          deck: state.deck,
          points: updatedPoints,
        };
      case 'GAME_OVER':
        return {
          ...state,
          gameEnded: true,
        };
      case 'RESET_GAME':
        return {
          ...initialState,
        };
      default:
        return state;
    }
  };
  
  export default gameReducer;