// Leaderboard.js
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Leaderboard = () => {
    const username = useSelector(state => state.username);
    const points = useSelector(state => state.points);

    useEffect(() => {
        const updatePoints = async () => {
            await axios.put(`/games/${username}`, { points });
        };

        updatePoints();
    }, [username, points]);

    const handleLogout = () => {
        // handle logout logic here
    };

    const fetchLeaderboard = async () => {
        const response = await axios.get('/games');
        console.log(response.data);
    };

    return (
        <div>
            <h2>Leaderboard</h2>
            <p>
                Your username: <b>{username}</b> - Points: <b>{points}</b>
            </p>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={fetchLeaderboard}>Fetch Leaderboard</button>
        </div>
    );
};

export default Leaderboard;