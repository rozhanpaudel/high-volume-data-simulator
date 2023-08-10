import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const server = 'http://localhost:30056';
const socket = io.connect(server);

function App() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('messages', (message) => {
            setMessages((prevMessages) => [message, ...prevMessages]);
        });
    }, []);

    return (
        <div className="app-container">
            <h1>Messages with priority >= 7</h1>
            <p>Total Messages: {messages.length}</p>
            <ul className="message-grid">
                {messages.map((message, index) => (
                    <li key={index} className="message-card">
                        <p>Message: {message.message}</p>
                        <p>Timestamp: {message.timestamp}</p>
                        <p>Priority: {message.priority}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
