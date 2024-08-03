import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import SpotifyProvider from 'next-auth/providers/spotify';
import mongoose from 'mongoose';
import User from '../../../schemas/User';

mongoose.connect(process.env.MONGODB_URI);

// Function to fetch additional Spotify user info
const fetchSpotifyUserInfo = async (accessToken: string) => {
  console.log('Fetching Spotify user info with token:', accessToken);  // Debug log
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to fetch Spotify user info:', response.status, errorText);  // Debug log
    throw new Error('Failed to fetch Spotify user info');
  }
  console.log(response)
  return await response.json();
};

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
  },
  events: {
    signIn: async ({ user, account }) => {
      console.log('SignIn event triggered');
      const email = user.email;
      const id = user.id;
      const chatroom = "a434dbc0-7933-4cd9-be42-46b4f280ddef";
      
      try {
        const spotifyUserInfo = await fetchSpotifyUserInfo(account.access_token);
        const profile_pic = spotifyUserInfo.images?.[0]?.url ?? null;
        console.log('Spotify user info:', spotifyUserInfo);
        
        const userExists = await User.findOne({ id });
        if (!userExists) {
          const newUser = new User({ email, id, profile_pic, chatroom });
          await newUser.save();
        }
      } catch (error) {
        console.error('Error fetching Spotify user info:', error);
      }
    },
  },
});

export { handler as GET, handler as POST };
