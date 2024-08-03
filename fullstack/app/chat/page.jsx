'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [email, setEmail] = useState('');
    const [chatroom, setChatroom] = useState('');
    const wsRef = useRef(null);

    const { data: session } = useSession();

    // Set the email state when the session data is available
    useEffect(() => {
        if (session) {
            setEmail(session.user.email);
        }
    }, [session]);

    // Log chatroom changes
    useEffect(() => {
        console.log("\n\n Chatroom \n ------------------------ \n");
        console.log(chatroom + "\n------------------------\n\n");
    }, [chatroom]);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/ws');

        socket.onopen = () => {
            console.log('Connected to WebSocket');
            fetchData(session.user.email);
        };

        socket.onmessage = async (event) => {
            console.log('Received message:', event.data);
            fetchData(session.user.email);
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
    }, []);

    const sendMessage = (input) => {
        console.log("input", input);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && input.trim()) {
            const message = `${email}|${input.trim()}`;
            wsRef.current.send(message);
            setInput('');
        }
    };

    const fetchData = async (email) => {
        console.log("fetching data ...");
        try {
            const response = await fetch(`http://localhost:3000/api/chat/${email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Response Data:", data);

                const messages = data.message;
                setMessages(messages);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div>
            <h1 style={{ color: 'red' }}>Global Chat Room</h1>
            <div style={{ border: '1px solid red', height: '300px', overflowY: 'auto', padding: '10px' }}>
                {messages.map((msg, index) => {
                    const [email, message] = msg.split('||');
                    return (
                        <div key={index} style={{ color: 'red' }}>
                            <strong>{email}:</strong> {message}
                        </div>
                    );
                })}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') sendMessage(input);
                }}
                placeholder="Type a message..."
                style={{ color: 'red' }}
            />
            <button onClick={() => sendMessage(input)} style={{ color: 'red' }}>Send</button>
        </div>
    );
}
