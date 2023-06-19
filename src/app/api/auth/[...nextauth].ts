import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import axios from '../../../lib/api'
import { error_can_happen } from '@/hooks/util';


export const authOptions = {
  site: process.env.NEXT_PUBLIC_API_URL,
  
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        let response: any;
        await error_can_happen(async () => {
          response = await axios.post('/auth/signin', credentials)
        })
        const user = response.data

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null
  
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    }),
  ],
  pages: {
    signIn: '/login',
    newUser: '/login/sign-up' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: any) {
      return true
    },
    async redirect({ url, baseUrl }: any) {
      return baseUrl
    },
    async session({ session, user, token }: any) {
      if (token) {
        session.accessToken = token.accessToken
      }
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }: any) {
      if (user) {
        token.accessToken = user.token;
      }
      return token
    }
  }
};

export default NextAuth(authOptions)