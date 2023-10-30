import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      number: any,
      user_id: any,
      access_token:any,
      refer_code:any,
      secret:any;
      TwoFA:any;
    } & DefaultSession["user"]
  }
}