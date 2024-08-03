'use client';

import { useEffect, useState, useRef } from 'react';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [email, setEmail] = useState('');
    const [chatroom, setChatroom] = useState('');
    const wsRef = useRef(null);

    // Log chatroom changes
    useEffect(() => {
        console.log("\n\n Chatroom \n ------------------------ \n");
        console.log(chatroom + "\n------------------------\n\n");
    }, [chatroom]);

    useEffect(() => {
            const socket = new WebSocket('ws://localhost:8080/ws');
    
            socket.onopen = () => {
                console.log('Connected to WebSocket');
                socket.send(JSON.stringify({ type: 'join', email }));
            };
    
            socket.onmessage = async (event) => {
                console.log('Received message:', event.data);
                const newMessage = JSON.parse(event.data);
                console.log(newMessage);
                fetchData(email);
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
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && input.trim()) {
            const message = `${email}|${input.trim()}`;
            wsRef.current.send(message);
            setInput('');
        }
    };

    const fetchData = async (email) => {
        console.log("fetching data ...")
        try {
            const response = await fetch(`http://localhost:3000/api/chat/${email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if(response.ok) {
                const data = await response.json();
                console.log("Response Data:", data);

                const messages = data.message;
                setMessages(messages);
            }
        } catch(error) {
            console.error("Error fetching data:", error);
        }
    }

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
                        <strong>{msg.email}:</strong> {msg.message}
                    </div>
                ))}
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
