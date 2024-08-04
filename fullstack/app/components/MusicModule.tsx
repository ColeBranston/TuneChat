import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MusicModuleProps {
    img: string;
    title: string;
    artist: string;
}

export default function MusicModule({img, title, artist}: MusicModuleProps) {

    return (
        <div className="flex mt-[20px] items-center gap-[30px] justify-start p-4 border bg-black text-white border-red-300 border-4 rounded-lg">
            <img className="w-[90px] h-[90px]" src={img} alt={title}/>
            <div>
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-sm text-gray-500">{artist}</p>
                <Link className="text-xl text-white font-sans cursor-pointer" href="/chat">→ Go to Chat Rooms</Link>
            </div>
        </div>
    );
}