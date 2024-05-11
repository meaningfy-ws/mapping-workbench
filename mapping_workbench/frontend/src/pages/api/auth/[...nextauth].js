import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
export const authOptions = {
 providers: [
  GoogleProvider({
   clientId: process.env.GOOGLE_ID,
   clientSecret: process.env.GOOGLE_SECRET,
  }),
 ],
 session: {
  strategy: 'jwt',
 },
 pages: {
    signIn: '/auth/login',
    session: '/auth/login',
    error: '/auth/login'
  },
};
export default NextAuth(authOptions);