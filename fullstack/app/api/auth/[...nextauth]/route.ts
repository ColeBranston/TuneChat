import NextAuth from 'next-auth/next';
import GoogleProvider from "next-auth/providers/google";
import uuid from 'uuidv4';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ? String(process.env.GOOGLE_CLIENT_SECRET) : ""
        })
    ]
});

export { handler as GET, handler as POST };