import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { scrypt as _scrypt, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(_scrypt)

async function verifyPassword(password: string, stored: string) {
    // stored format: salt:derivedHex
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

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password } = body
        if (!email || !password) {
            return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
        }

        const dbRes = await pool.query('SELECT id, email, password_hash, display_name FROM users WHERE email = $1', [email])
        if (dbRes.rowCount === 0) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const user = dbRes.rows[0]
        const ok = await verifyPassword(password, user.password_hash)
        if (!ok) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        // Authentication successful. Do not return password_hash.
        const safeUser = { id: user.id, email: user.email, displayName: user.display_name }

        // This endpoint is deprecated when using NextAuth. Use NextAuth credentials provider at /api/auth.
        return NextResponse.json({ error: 'Deprecated: use NextAuth credentials provider' }, { status: 501 })
    } catch (err) {
        console.error('Error in /api/auth/signin', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
