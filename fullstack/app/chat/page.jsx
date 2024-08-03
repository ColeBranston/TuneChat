'use client';

import { useEffect, useState, useRef } from 'react';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState('');
    const [isUsernameSet, setIsUsernameSet] = useState(false);
    const wsRef = useRef(null);

    useEffect(() => {
        if (isUsernameSet) {
            const socket = new WebSocket('ws://localhost:8080/ws');
            
            socket.onopen = () => {
                console.log('Connected to WebSocket');
                socket.send(JSON.stringify({ type: 'join', username }));
            };

            socket.onmessage = (event) => {
                console.log('Received message:', event.data);
                const newMessage = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            socket.onclose = () => {
                console.log('Disconnected from WebSocket');
            };

            wsRef.current = socket;

            return () => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.close();
                }
            };
        }
    }, [isUsernameSet, username]);

    const sendMessage = () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && input.trim()) {
            const message = { type: 'message', username, content: input.trim() };
            wsRef.current.send(JSON.stringify(message));
            setInput('');
        }
    };

    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            setIsUsernameSet(true);
        }
    };

    if (!isUsernameSet) {
        return (
            <form onSubmit={handleUsernameSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    style={{ color: 'red' }}
                />
                <button type="submit" style={{ color: 'red' }}>Join Chat</button>
            </form>
        );
    }

    return (
        <div>
            <h1 style={{ color: 'red' }}>Global Chat Room</h1>
            <div style={{ border: '1px solid red', height: '300px', overflowY: 'auto', padding: '10px' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ color: 'red' }}>
                        {msg.type === 'join' && <em>{msg.username} has joined the chat</em>}
                        {msg.type === 'message' && <><strong>{msg.username}:</strong> {msg.content}</>}
                    </div>
                ))}
            </div>
            <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') sendMessage();
                }}
                placeholder="Type a message..."
                style={{ color: 'red' }}
            />
            <button onClick={sendMessage} style={{ color: 'red' }}>Send</button>
        </div>
    );
}
