import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'credentials',
            async authorize(credentials: any, req: any) {
                if (credentials) {
                    let user;
                    user = credentials
                    return user;
                } else return null;
            },
        } as any),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            let flag = true;
            if (account?.provider === "credentials") {
                flag = true
            }
            return flag
        },
        async jwt({ token, user }) {
            return { ...token, ...user };
        },

        async session({ session, token, user }) {

            let obj = { "number": token.number, "dial_code": token.dial_code, "email": token.email };

            if(token?.access_token !==undefined || token?.access_token !==null){

                const datauser = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/checkjwt`, {
                    method: "GET",
                    headers: { 'authorization': token?.access_token }
                } as any).then(response => response.json());

                // console.log(datauser,'=====jwt');
                
                if(datauser?.data?.message !==undefined){
                    session = null as any
                }
                else{
                    // console.log(token,'==============token==============');
                    
                    session.user = { name: token?.own_code, email: session.user?.email, number: token?.number, user_id: token.id, access_token: token?.access_token, refer_code: token?.own_code, TwoFA:datauser?.data?.TwoFA === 1?true:false, secret:datauser?.data?.secret } as any;
                }
            }
            
            return session;
        }
    },
    pages: {
        signIn: '/login'
    },
}

export default NextAuth(authOptions);