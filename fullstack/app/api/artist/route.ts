import mongoose from 'mongoose';
const User = require('../../schemas/User');
const Chatroom = require('../../schemas/Chatroom');
import { v4 as uuidv4 } from 'uuid';

mongoose.connect(process.env.MONGODB_URI as string);

export async function POST(req: Request) {
    try {
        const { email, artist } = await req.json();  
        
        console.log('Request Body:', { email, artist }); 

        if (!email || !artist) {
            return new Response(JSON.stringify({ message: 'artist and email are required' }), { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        const chatroom = await Chatroom.findOne({ artist: artist.toLowerCase() });

        if (!chatroom) {
            const id = uuidv4();
            const newChatroom = await new Chatroom({chatroom:id, artist:artist.toLowerCase()})
            await newChatroom.save();
            user.chatroom = id;
            await user.save();
            return new Response(JSON.stringify({ message: 'New chatroom made'}))
        } else {
            const chatroomId = chatroom.chatroom; 
            user.chatroom = chatroomId;
            await user.save();
            return new Response(JSON.stringify({ message: 'User added to chatroom'}))
        }

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}

