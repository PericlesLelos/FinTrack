import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import pool from '@/lib/db'
import { scrypt as _scrypt, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(_scrypt)

async function verifyPassword(password: string, stored: string) {
    const [salt, hashHex] = (stored || '').split(':')
    if (!salt || !hashHex) {
        return false
    }
    const derived = (await scrypt(password, salt, 64)) as Buffer
    const expected = Buffer.from(hashHex, 'hex')
    if (derived.length !== expected.length) {
        return false
    }
    return timingSafeEqual(derived, expected)
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }
                
                const res = await pool.query('SELECT id, email, password_hash, display_name FROM users WHERE email = $1', [credentials.email])
                
                if (res.rowCount === 0) {
                    return null
                }
                
                const user = res.rows[0]
                const ok = await verifyPassword(credentials.password, user.password_hash)
                
                if (!ok) {
                    return null
                }
                return { id: user.id, email: user.email, name: user.display_name }
            },
        }),
    ],
    session: { strategy: 'jwt' },
    callbacks: {
        async jwt({ token, user }) {
        if (user) {
            // @ts-ignore
            token.userId = (user as any).id
        }
        return token
        },
        async session({ session, token }) {
        // attach userId to session.user
        // @ts-ignore
        session.user = session.user || {}
        // @ts-ignore
        session.user.id = (token as any).userId
        return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'dev-secret-change-me',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
