import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Game = ({ onDrawCard }) => {
    const [index, setIndex] = useState(0);
    const deck = useSelector(state => state.deck);

    const handleDraw = () => {
        if (index < deck.length - 1) {
            onDrawCard(index);
            setIndex(index + 1);
        }
    };

    return (
        <div>
            <h2>Game</h2>
            <p>
                Deck: {deck.map((card, i) => (
                    <span key={i}>{i === index ? '[Drawn] ' : ''}{card.type} </span>
                ))}
            </p>
            <button onClick={handleDraw}>Draw Card</button>
        </div>
    );
};

export default Game;
