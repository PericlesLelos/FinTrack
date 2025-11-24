import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(_scrypt)

async function hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex')
    const derived = (await scrypt(password, salt, 64)) as Buffer
    return `${salt}:${derived.toString('hex')}`
}

export async function GET() {
    try {
        const { rows } = await pool.query('SELECT id, email, display_name AS "displayName", created_at AS "createdAt" FROM users ORDER BY id DESC LIMIT 100')
        return NextResponse.json(rows)
    } catch (err) {
        console.error('Error in /api/users GET', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, firstName, lastName } = body

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
        }

        // prevent duplicate accounts
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
        if (existing.rows.length > 0) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 })
        }

        const password_hash = await hashPassword(password)
        const display_name = `${firstName || ''} ${lastName || ''}`.trim() || null

        const insert = await pool.query(`INSERT INTO users (email, password_hash, display_name) VALUES ($1, $2, $3) RETURNING id, email, display_name, created_at`, [email, password_hash, display_name])
        const user = insert.rows[0]
        return NextResponse.json({ user }, { status: 201 })
    } catch (err) {
        console.error('Error in /api/users POST', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        // Support id as query param: /api/users?id=123 or JSON body { id: 123 }
        const url = new URL(request.url)
        let id = url.searchParams.get('id')

        if (!id) {
            const body = await request.json().catch(() => null)
            id = body?.id
        }

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 })
        }

        const del = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id])
        if (del.rowCount === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'User deleted', id: del.rows[0].id })
    } catch (err) {
        console.error('Error in /api/users DELETE', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
