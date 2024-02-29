// store.js
import { createStore } from 'redux';

const initialState = {
    username: '',
    points: 0,
    deck: [
        { type: 'cat' },
        { type: 'defuse' },
        { type: 'shuffle' },
        { type: 'exploding-kitten' },
        { type: 'exploding-kitten' },
    ],
    gameStarted: false,
    gameEnded: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'START_GAME':
            return { ...state, gameStarted: true, gameEnded: false };
        case 'DRAW_CARD':
            const newDeck = [...state.deck];
            const drawnCard = newDeck.splice(action.index, 1)[0];

            if (drawnCard.type === 'exploding-kitten') {
                return { ...state, gameEnded: true };
            }

            if (drawnCard.type === 'cat') {
                return { ...state, points: state.points + 1 };
            }

            if (drawnCard.type === 'defuse') {
                return { ...state, gameEnded: false };
            }

            if (drawnCard.type === 'shuffle') {
                newDeck.sort(() => Math.random() - 0.5);
                return { ...state, deck: newDeck };
            }

            return state;
        default:
            return state;
    }
};

const store = createStore(reducer);

export default store;