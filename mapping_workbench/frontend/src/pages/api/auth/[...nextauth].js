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
 callbacks: {
     async signIn({ user, account, profile, email, credentials }) {
         console.log('signIn',user, account, profile, email, credentials )
      return true
    },
    async redirect({ url, baseUrl }) {
         console.log('redirect',url, baseUrl)
      return baseUrl
    },
    async session({ session, user, token }) {
         console.log('session',session, user, token)
      return {...session, accessToken: token.accessToken}
    },
    async jwt({ token, user, account, profile, isNewUser }) {
         console.log('jwt',token, user, account, profile, isNewUser)
        if(account)
            token.accessToken = account.access_token
      return token
    }
  }
};
export default NextAuth(authOptions);