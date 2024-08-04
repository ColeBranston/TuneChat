import React from "react";

interface SearchProps {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    handleSearch: () => void;
}

export default function Search(props: SearchProps) {
    const { search, setSearch, handleSearch } = props;
    return (
        <div>
            <input 
                type="text" 
                placeholder="Search for your favourite song"
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="flex-grow w-[300px] focus:outline-none rounded-l-[10px] py-2 px-4 text-black"
            />
            <button onClick={handleSearch} className="mt-10 rounded-r-[10px] hover:bg-red-400 bg-red-300 h-[40px] w-[70px]">Search</button>
        </div>
    )
}