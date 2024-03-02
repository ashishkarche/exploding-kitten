import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Game = () => {
  const [index, setIndex] = useState(0);
  const deck = useSelector(state => state.game.deck);
  const gameEnded = useSelector(state => state.game.gameEnded);
  const dispatch = useDispatch();

  const handleDrawCard = () => {
    if (!gameEnded && index < deck.length) {
      // Dispatch an action to draw a card
      dispatch({ type: 'DRAW_CARD', index });
      setIndex(prevIndex => prevIndex + 1);
    }
  };

  return (
    <div>
      <h2>Game</h2>
      <div>
        <h3>Deck:</h3>
        <div>
          {deck.map((card, i) => (
            <span key={i}>{i === index ? '[Drawn] ' : ''}{card} </span>
          ))}
        </div>
      </div>
      <button onClick={handleDrawCard} disabled={gameEnded || index >= deck.length}>
        Draw Card
      </button>
    </div>
  );
};

export default Game;
