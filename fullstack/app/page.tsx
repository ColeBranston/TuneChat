"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import logo1 from '../public/logo1.png';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Search from "./components/Search";
import MusicModule from "./components/MusicModule";

interface User { // change later
  name: string;
  messages: string
}
export default function Home() {
  const [userData, setUserData] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [song, setSong] = useState<string>(""); 
  const [artist, setArtist] = useState<string>("");
  const [artistImageUrl, setArtistImageUrl] = useState<string>("");
  const [actualSearch, setActualSearch] = useState<string>("")

  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  

  const handleNewUser = async () => {
    
    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newUser: newUser }),
      });

      if (!response) throw new Error(JSON.stringify(response));
      const data = await response.json();
      setUserData([...userData, data]);
    } catch (error) {
      console.log("Could not create new user", error);
    }
  };

  useEffect(() => {
    const fetchArtistImage = async () => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artist)}&type=artist&limit=1`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API response data:", data);
        
        if (data.artists && data.artists.items.length > 0) {
          const artistData = data.artists.items[0];
          if (artistData.images && artistData.images.length > 0) {
            setArtistImageUrl(artistData.images[0].url);
          }
        }
      } catch (error) {
        console.error("Error fetching artist image:", error);
      }
    };
  
    if (artist) {
      fetchArtistImage();
    }
  }, [artist, accessToken]);

  const handleSearch = async () => {
    setActualSearch(search)
    console.log(accessToken);
    const api = `https://api.spotify.com/v1/search?q=${encodeURIComponent(search)}&type=track`;
    
    try {
      const response = await fetch(api, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        setArtist(data?.tracks?.items[0]?.artists[0]?.name);
        setArtistImageUrl(data?.tracks?.items[0]?.artists[0]?.href);
        console.log("\n\nResponse Data:\n\n");
        console.log(data);
        
        // You can now work with the data, for example:
        if (data.tracks && data.tracks.items.length > 0) {
          const firstTrack = data.tracks.items[0];
          setSong(firstTrack.name);
          console.log("First track name:", firstTrack.name);
        }
      } else {
        console.error("Spotify API request failed:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data from Spotify API:", error);
    }
  };

  return (
    <main className="flex min-h-screen bg-gradient-to-r from-red-50 to-red-200 flex-col items-center justify-between p-24">
      <div className="flex flex-col gap-[10px]">
        <h1 className="text-5xl font-sans mt-40 text-black">Welcome to TuneChat</h1>
        {session && (
          <>
            <Search search={search} setSearch={setSearch} setActualSearch={setActualSearch} handleSearch={handleSearch} />
            {actualSearch && song && artistImageUrl && 
              <MusicModule img={artistImageUrl} title={actualSearch} artist={artist} />
            }          
          </>
        )}
      </div>
    </main>
  );
}
