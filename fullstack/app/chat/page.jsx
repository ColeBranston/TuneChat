'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [email, setEmail] = useState('');
    const [chatroom, setChatroom] = useState('');
    const wsRef = useRef(null);
    const messagesEndRef = useRef(null);

    const { data: session } = useSession();

    useEffect(() => {
        fetchData(session.user.email);
    }, [session])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

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
        if (session) {
            setEmail(session.user.email);
    
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
        }
    }, [session]);

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
        <div className='h-screen flex flex-col bg-red-50'>    
            <div className="flex-grow overflow-y-auto px-4 py-2">
                <div className="flex flex-col space-y-4">
                    {messages.map((msg, index) => {
                        const [email, message] = msg.split('|');
                        const isOwnMessage = email === session?.user?.email;

                        return (
                            <div key={index} className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[70%] break-words ${isOwnMessage ? 'bg-red-400 text-white' : 'bg-gray-200 text-black'} rounded-[20px] px-4 py-2 ${isOwnMessage ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
                                    <p>{message}</p>
                                </div>
                                <p className="text-xs mt-1 text-gray-500">{email}</p>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className='flex-shrink-0 bg-red-400 p-4'>
                <div className='flex items-center max-w-4xl mx-auto'>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') sendMessage(input);
                        }}
                        placeholder="Type your message..."
                        className='flex-grow focus:outline-none rounded-l-full py-2 px-4 text-black'
                    />
                    <button 
                        onClick={() => sendMessage(input)} 
                        className='bg-red-600 text-white rounded-r-full px-6 py-2 hover:bg-red-700 transition duration-300'
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}