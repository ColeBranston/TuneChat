import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import SpotifyProvider from 'next-auth/providers/spotify';
const mongoose = require('mongoose');
const User = require('../../../schemas/User');
const Chatroom = require('../../../schemas/Chatroom');

mongoose.connect(process.env.MONGODB_URI);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID ?? '',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope: 'user-read-email user-read-private',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token?.accessToken ?? null;
      return session;
    },
  },
  events: {
    signIn: async (user, account, profile) => {
      const email = user?.user?.email;
      const id = user?.user?.id;
      const profile_pic = user?.profile?.image;
      const chatroom = "a434dbc0-7933-4cd9-be42-46b4f280ddef"
      console.log("\n\n" + email + "\n\n" + id + "\n\n" + profile_pic);

      const userExists = await User.findOne({id:id});
      if(!userExists){
        const userExists = new User({email: email, id: id, profile_pic: profile_pic, chatroom: chatroom});
        // const chatroom = new Chatroom();
        // await chatroom.save();
        await userExists.save();
      }
    },
  },
});

export { handler as GET, handler as POST };
