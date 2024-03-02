import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const Login = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (username.length < 3) {
      setMessage('Username must be at least 3 characters long');
      return;
    }
    if (username === '') {
      setMessage('Username cannot be empty');
      return;
    }
    setIsLoading(true);
    // Dispatch action to update username in store using redux-thunk
    dispatch(async (dispatch) => {
      try {
        await dispatch({ type: 'SET_USERNAME', payload: username });
        setMessage('Login successful');
      } catch (error) {
        setMessage('Login failed');
      } finally {
        setIsLoading(false);
      }
    });
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
      />
      <button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;