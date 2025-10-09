import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbconnect from "./dbconnect";
import bcrypt from "bcryptjs";

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			profile: async (profile) => {
				const users = await dbconnect("users");

				// Check if user exists
				let user = await users.findOne({ email: profile.email });

				// If not, create new user document
				if (!user) {
					const newUser = {
						name: profile.name,
						email: profile.email,
						photoUrl: profile.picture,
						provider: "google",
					};
					const result = await users.insertOne(newUser);
					user = { ...newUser, _id: result.insertedId };
				}

				// Always return MongoDB _id here 👇
				return {
					id: user._id.toString(),
					name: user.name,
					email: user.email,
					photoUrl: user.photoUrl,
				};
			},
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
					photoUrl: user.photoUrl || null,
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
		async jwt({ token, user }) {
			if (user) token.id = user.id || user._id?.toString();
			return token;
		},
		async session({ session, token }) {
			if (token) session.user.id = token.id;
			return session;
		},
	},
};
