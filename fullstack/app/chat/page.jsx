'use client';

import { useEffect, useState, useRef } from 'react';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [email, setEmail] = useState('');
    const [isEmailSet, setIsEmailSet] = useState(false);
    const [chatroom, setChatroom] = useState('');
    const wsRef = useRef(null);

    // Log chatroom changes
    useEffect(() => {
        console.log("\n\n Chatroom \n ------------------------ \n");
        console.log(chatroom + "\n------------------------\n\n");
    }, [chatroom]);

    useEffect(() => {
        if (isEmailSet) {
            const socket = new WebSocket('ws://localhost:8080/ws');
    
            socket.onopen = () => {
                console.log('Connected to WebSocket');
                socket.send(JSON.stringify({ type: 'join', email }));
            };
    
            socket.onmessage = async (event) => {
                console.log('Received message:', event.data);
                const newMessage = JSON.parse(event.data);
                console.log(newMessage);
                await fetch('http://localhost:3000/api/chat', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "email": email,
                        "message": newMessage
                    })
                });
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

    // const getChatroom = async () => {
    //     console.log("getting chatroom...")
    //     try {
    //         const response = await fetch(`http://localhost:3000/api/getChatRoom?email=${encodeURIComponent(email)}`, {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json" // Optional for GET requests
    //             }
    //         });
    
    //         if (response.ok) {
    //             const data = await response.json();
    //             console.log("Response Data:", data);
    
    //             const chatroom = data.chatroom; // Ensure this matches the backend response
    //             setChatroom(chatroom);
    
    //             console.log("The Chatroom is", chatroom);
    //         } else {
    //             console.error("Something went wrong with your GET request:", response.statusText);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching chatroom:", error);
    //     }
    // };
    

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (email.trim()) {
            console.log(email);
            setIsEmailSet(true);
            // await getChatroom();
            // console.log("The chatroom is", chatroom);
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
