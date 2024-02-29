// App.js
import React from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';

function App() {
  const gameStarted = useSelector(state => state.gameStarted);
  const gameEnded = useSelector(state => state.gameEnded);
  const dispatch = useDispatch();

  const handleStartGame = () => {
    dispatch({ type: 'START_GAME' });
  };

  const handleDrawCard = index => {
    dispatch({ type: 'DRAW_CARD', index });
  };

  return (
    <div className="App">
      <h1>Exploding Kitten</h1>
      <button onClick={handleStartGame}>Start Game</button>
      {gameStarted && !gameEnded && <Game onDrawCard={handleDrawCard} />}
      {gameEnded && <Leaderboard />}
    </div>
  );
}

const AppWithStore = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default AppWithStore;
