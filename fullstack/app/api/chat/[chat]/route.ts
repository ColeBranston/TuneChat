import mongoose from 'mongoose';
const User = require('../../../schemas/User');
const Chatroom = require('../../../schemas/Chatroom');

mongoose.connect(process.env.MONGODB_URI as string);

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const email = url.pathname.split('/')[3]; // Extract email from query parameters

        if (!email) {
            return new Response(
                JSON.stringify({ message: 'Email query parameter is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const user = await User.findOne({ email });

        if (!user) {
            return new Response(
                JSON.stringify({ message: 'User not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        console.log('User:', user);
        console.log('Chat Room:', user.chatroom);

        const chatroom = await Chatroom.findOne({chatroom:user.chatroom})
        console.log(chatroom);

        const chat_history_arr = Array.from(chatroom.chat_history);

        // Assuming user.chatroom contains the chatroom ID or relevant data
        return new Response(
            JSON.stringify({ message: chat_history_arr }), 
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Error fetching chatroom:', error);
        return new Response(
            JSON.stringify({ message: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
