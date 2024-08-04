import React, { useEffect } from 'react';
import Image from 'next/image';

interface MusicModuleProps {
    img: string;
    title: string;
    artist: string;
}

export default function MusicModule({img, title, artist}: MusicModuleProps) {
    useEffect(() => {
        console.log('12', img)

    }, [])
    return (
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
            <img src={img} alt={title} height={50}/>
            <div>
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-sm text-gray-500">{artist}</p>
            </div>
        </div>
    );
}