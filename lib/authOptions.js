import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbconnect from "./dbconnect";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const users = await dbconnect("users");
        const user = await users.findOne({ email: credentials.email });
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
   async signIn({ user, account, profile }) {
  if (account.provider === "google") {
    const users = await dbconnect("users");
    const existingUser = await users.findOne({ email: user.email });

    if (!existingUser) {
      // Insert Google user into MongoDB
      const result = await users.insertOne({
        name: user.name,
        email: user.email,
        googleId: profile.sub,
        photoUrl: profile.picture || null, 
        createdAt: new Date(),
      });
      user.id = result.insertedId.toString();
    } else {
      user.id = existingUser._id.toString();
      if (!existingUser.photoUrl && profile.picture) {
        await users.updateOne(
          { _id: existingUser._id },
          { $set: { photoUrl: profile.picture } }
        );
      }
    }
  }
  return true;
},

    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },

    async session({ session, token }) {
      if (token) session.user.id = token.id;
      return session;
    },
  },
};
