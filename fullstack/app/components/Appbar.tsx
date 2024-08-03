import React from "react";
import SigninButton from "./SigninButton";
import logo1 from "../../public/logo1.png";
import logo2 from "../../public/logo2.png";
import Image from 'next/image';

const Appbar = () => {
    return (
        <header className="flex justify-between items-center pl-4 pr-4 pu-1 pd-1 bg-gradient-to-b from-white to-red-100 shadow">
            <Image src={logo1} alt="Logo" width={70} /> 
            <SigninButton />
        </header>
    )
}

export default Appbar;