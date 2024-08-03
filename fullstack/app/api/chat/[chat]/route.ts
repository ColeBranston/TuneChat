import mongoose from 'mongoose';
const Chatroom = require('../../../schemas/Chatroom');

mongoose.connect(process.env.MONGODB_URI as string);

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const chatId = url.pathname.split('/')[3];

        const chatroom = await Chatroom.findOne({ chatroom: chatId });

        if (!chatroom) {
            return new Response(JSON.stringify({ message: 'Chatroom not found' }), { status: 404 });
        }

        console.log('Chatroom:', chatroom);
        console.log('Chatroom History:', chatroom.chat_history);

        return new Response(JSON.stringify({ messages: chatroom.chat_history }), { status: 200 });
    } catch (error) {
        console.error('Error fetching chatroom:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}
