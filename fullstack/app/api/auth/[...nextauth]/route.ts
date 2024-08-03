import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import SpotifyProvider from 'next-auth/providers/spotify';
import { query } from '../../../../db';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
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
      session.accessToken = token.accessToken;
      return session;
    },
  },
  events: {
    signIn: async (user, account, profile) => {
      const { email } = user;
      console.log(profile);

      const result = await query(`SELECT * FROM users WHERE email = '${email}'`);
      if (result.length > 0) {
        console.log('Result exists');
      } else {
        console.log('Result does not exist');
      }
      console.log(result); // Do something with the query result
    },
  },
});

export { handler as GET, handler as POST };