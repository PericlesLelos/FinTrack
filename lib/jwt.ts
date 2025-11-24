import { getToken } from 'next-auth/jwt'

const SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'dev-secret-change-me'

export async function getUserIdFromRequest(request: Request): Promise<number | null> {
    try {
        // getToken will parse the NextAuth JWT session token from cookies/headers
        const token = await getToken({ req: request as any, secret: SECRET }) as any
        if (!token) {
            return null
        }
        // token.userId is set in our NextAuth jwt callback
        return typeof token.userId === 'number' ? token.userId : (token.userId ? Number(token.userId) : null)
    } catch (err) {
        console.error('getUserIdFromRequest error', err)
        return null
    }
}

export default null as unknown as undefined
