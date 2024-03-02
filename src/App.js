import React from 'react';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';

// Initialize the Redux store
const store = createStore(rootReducer);

function App() {
  const isLoggedIn = useSelector(state => state.game.username !== '');

  return (
    <div className="App">
      <h1>Exploding Kitten</h1>
      {!isLoggedIn && <Login />}
      {isLoggedIn && (
        <>
          <Game />
          <Leaderboard />
        </>
      )}
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