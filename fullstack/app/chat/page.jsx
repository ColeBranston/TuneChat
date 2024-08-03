'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

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

    return (
        <div className='min-h-screen flex flex-col justify-between bg-red-50'> 
            <div>          
                <h1 className='font-sans text-4xl h-[100%] bg-red-400 text-white p-2'>Global Chat Room</h1>
                <Link href="/" className='text-[15px] ml-[10px] mt-[5px] cursor-pointer bg-red-50 text-black'>← Back to home</Link>
            </div>    
            <div className="border-l border-r border-red-800 p-2">
                {messages.map((msg, index) => (
                    <div key={index} style={{ color: 'red' }}>
                        <strong>{msg.email}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            <div className='h-[100px] flex items-center bg-red-400 mb-[64px]'>
                <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') sendMessage(input);
                    }}
                    placeholder="Type in chat..."
                    className='focus: outline-none w-[80%] ml-[20px] pl-[15px] rounded-l-[3px] border-none text-black border h-[50px] border-red-800 '
                />
                <button 
                    onClick={() => sendMessage(input)} 
                    className='text-xl text-red-600 h-[50px] flex items-center bg-red-100 p-3 rounded-r-[3px]'
                >
                    Send
                </button>
            </div>
        </div>
    );
}
