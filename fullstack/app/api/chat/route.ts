import mongoose from 'mongoose';
const User = require('../../schemas/User');
const Chatroom = require('../../schemas/Chatroom');

mongoose.connect(process.env.MONGODB_URI as string);

export async function POST(req: Request) {
    try {
        const { email, message } = await req.json();  
        
        console.log('Request Body:', { email, message }); 

        if (!email || !message) {
            return new Response(JSON.stringify({ message: 'Email and message are required' }), { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        const chatroomId = user.chatroom;
        const chatroom = await Chatroom.findOne({ chatroom: chatroomId });

        if (!chatroom) {
            return new Response(JSON.stringify({ message: 'Chatroom not found' }), { status: 404 });
        }


        chatroom.chat_history.push(email + "|" + message);
        await chatroom.save();

        return new Response(JSON.stringify({ message: 'Message added to chat history' }), { status: 200 });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}

