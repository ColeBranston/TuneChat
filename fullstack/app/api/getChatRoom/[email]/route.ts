import mongoose from 'mongoose';
const User = require('../../../schemas/User');

mongoose.connect(process.env.MONGODB_URI as string);

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const email = url.pathname.split('/')[3]; 

        if (!email) {
            return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        console.log('User:', user);
        console.log('Chatroom:', user.chatroom);

        return new Response(JSON.stringify({ chatroom: user.chatroom }), { status: 200 }); // Ensure the field matches the frontend
    } catch (error) {
        console.error('Error fetching chatroom:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}
