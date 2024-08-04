import mongoose from 'mongoose';
const Chatroom = require('../../schemas/Chatroom');
import { v4 as uuidv4 } from 'uuid';
mongoose.connect(process.env.MONGODB_URI as string);

export async function POST(req: Request) {
    try {
        const { artist } = await req.json();  
        
        const id = uuidv4();
        console.log(id);

        const chatroom = new Chatroom({chatroom:id, full: false, artist:artist, users:1});
        await chatroom.save();

        return new Response(JSON.stringify({ id: id, message: `Chatroom for artist ${artist} was made` }), { status: 200 });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}

