"use client";
import React, { useState } from "react";
import {signIn, signOut, useSession} from "next-auth/react";

const SigninButton = () => {
    const {data: session} = useSession();
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    if(session && session.user) {
        return (
            <div className="relative flex gap-4 ml-auto">
                <img onClick={toggleModal} src={session.user.image || "../../public/default_profile.png"} alt="User profile" className="w-8 h-8 rounded-full cursor-pointer" />
                {showModal && (
                    <div className="absolute top-full right-0 mt-2 bg-white p-4 rounded shadow-lg w-40 flex flex-col items-center justify-center">
                        <h2 className="text-xl mb-4 text-black">{session.user.name}</h2>
                        <button onClick={() => {signOut(); toggleModal();}} className="px-4 py-2 bg-red-600 text-white rounded">
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        )
    }
    return (
        <button onClick={() => signIn()} className="text-green-600 ml-auto">
            Sign In
        </button>
    )
}

export default SigninButton;