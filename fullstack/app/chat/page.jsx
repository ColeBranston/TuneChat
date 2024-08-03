'use client';

import { useEffect, useState, useRef } from 'react';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [email, setEmail] = useState('');
    const [isEmailSet, setIsEmailSet] = useState(false);
    const wsRef = useRef(null);

    useEffect(() => {
        if (isEmailSet) {
            const socket = new WebSocket('ws://localhost:8080/ws');
            
            socket.onopen = () => {
                console.log('Connected to WebSocket');
                socket.send(JSON.stringify({ type: 'join', email }));
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
    }, [isEmailSet, email]);

    const sendMessage = () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && input.trim()) {
            const message = { type: 'message', email, content: input.trim() };
            wsRef.current.send(JSON.stringify(message));
            setInput('');
        }
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setIsEmailSet(true);
        }
    };

    if (!isEmailSet) {
        return (
            <form onSubmit={handleEmailSubmit}>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
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
                        {msg.type === 'join' && <em>{msg.email} has joined the chat</em>}
                        {msg.type === 'message' && <><strong>{msg.email}:</strong> {msg.content}</>}
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
