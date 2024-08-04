import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import SpotifyProvider from 'next-auth/providers/spotify';
import mongoose from 'mongoose';
import User from '../../../schemas/User';

mongoose.connect(process.env.MONGODB_URI);

// Function to fetch additional Spotify user info
const fetchSpotifyUserInfo = async (accessToken: string) => {
  console.log('Fetching Spotify user info with token:', accessToken);  // Debug log
  const response1 = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  if (!response1.ok) {
    const errorText = await response1.text();
    console.error('Failed to fetch Spotify user info:', response1.status, errorText);  // Debug log
    throw new Error('Failed to fetch Spotify user info');
  }
  
  return await response1.json();
};

const fetchSpotifyUserPlayLists = async (accessToken: string, user_id: string) => {
  const playLists = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
      
    }
    
  });
  if (playLists.ok){
    console.log(playLists)
  }

  return await playLists.json()
};

const fetchSpotifyUserTopArtists = async (accessToken: string) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/top/artists', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch top artists:', response.status, errorText);
      throw new Error('Failed to fetch top artists');
    }

    const topArtistsData = await response.json();
    console.log('Top artists data:', topArtistsData); // Log the response data

    return topArtistsData;
  } catch (error) {
    console.error('Error fetching Spotify top artists:', error);
    throw error; // Rethrow the error after logging it
  }
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
          scope: 'user-read-email user-read-private user-top-read',
        },
      },
    })
    ,
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
        const userID = spotifyUserInfo.id
        const playLists = await fetchSpotifyUserPlayLists(account.access_token, userID);
        const topArtists = await fetchSpotifyUserTopArtists(account.access_token, userID)
        console.log('Spotify user info:', spotifyUserInfo);
        console.log("user's playlists: ", playLists)
        console.log("Top Artists: ", topArtists)
        
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
