"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from 'next/link';

interface User { // change later
  name: string;
  messages: string
}
export default function Home() {
  const [userData, setUserData] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users");
        if (!response.ok) throw new Error(JSON.stringify(response));
        console.log("response", response);
        const data = await response.json();
        console.log("data", data);
        setUserData(data.users);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

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

  return (
    <main className="flex min-h-screen bg-gradient-to-r from-red-50 to-red-200 flex-col items-center justify-between p-24">
      <div className="flex flex-col gap-[10px]">
        <h1 className="text-5xl font-sans">Welcome to TuneChat</h1>
        <Link className="text-2xl font-sans" href="/chat">→ Go to Chat Rooms</Link>
      </div>
    </main>
  );
}
