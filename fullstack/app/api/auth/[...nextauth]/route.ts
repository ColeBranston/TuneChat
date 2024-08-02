import NextAuth from 'next-auth/next';
import GoogleProvider from "next-auth/providers/google";
import uuid from 'uuidv4';
import {query} from '../../../../db';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    // events: {
    //     signIn: async (user, account, profile) => {
    //         const { email } = user;
    //         console.log(profile)
            
    //         const result = await query(`SELECT * FROM users WHERE email = '${email}'`);
    //         if (result.length > 0) {
    //             console.log("Result exists");
    //         } else {
    //             // Result does not exist
    //             console.log("Result does not exist");
    //         }
    //         console.log(result); // Do something with the query result
    //     }
    // }
});

export { handler as GET, handler as POST };
