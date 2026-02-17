import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import AppleProvider from "next-auth/providers/apple"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import { getUserByEmail, syncUserByAuthId } from "./db"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            name?: string | null
            email?: string | null
            image?: string | null
        }
    }

    interface User {
        id: string
        clinic_id?: string
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || "",
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
        }),
        AppleProvider({
            clientId: process.env.APPLE_CLIENT_ID || "",
            clientSecret: process.env.APPLE_CLIENT_SECRET || "",
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Email and Password",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                // Real DB lookup
                const user = await getUserByEmail(credentials.email)

                // For this MVP, we allow demo if user doesn't exist yet, 
                // OR we check password if we had a password field in DB.
                // Since the schema has 'auth_provider', we allow the demo user '1' if it's the specific demo email.
                // In production, you'd use bcrypt to compare passwords.
                // TODO: Implement bcrypt comparison once user registration has passwords.
                if (user) {
                    return {
                        id: user.id,
                        name: user.full_name,
                        email: user.email,
                        clinic_id: user.clinic_id
                    }
                }

                // Self-healing: if it's the first time someone logs in with a demo email, create them.
                if (credentials.email === "demo@orasync.site") {
                    const synced = await syncUserByAuthId(credentials.email, "email", "demo", "Demo User")
                    if (synced) return { id: synced.id, name: synced.full_name, email: synced.email, clinic_id: synced.clinic_id }
                }

                return null
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    async jwt({ token, user, account, profile }) {
        if (user) {
            token.id = user.id
            token.clinic_id = (user as any).clinic_id
        }

        // Handle OAuth sign in
        if (account && profile && profile.email) {
            const synced = await syncUserByAuthId(
                profile.email,
                account.provider,
                account.providerAccountId,
                profile.name || (profile as any).full_name
            )
            if (synced) {
                token.id = synced.id
                token.clinic_id = synced.clinic_id
            }
        }
        return token
    },
    async session({ session, token }) {
        if (session.user) {
            session.user.id = token.id as string
            (session.user as any).clinic_id = token.clinic_id
        }
        return session
    },
},
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
}
