import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/jwt'

export async function GET(request: Request) {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { rows } = await pool.query(
        `SELECT id, user_id AS "userId", name, description, duedate, priority, completed, created_at AS "createdAt", updated_at AS "updatedAt" FROM todos WHERE user_id = $1 ORDER BY duedate ASC LIMIT 100`,
        [userId]
    )
    return NextResponse.json(rows)
}

export async function POST(request: Request) {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const { name, description, duedate, priority } = body

    if (!name || !duedate) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const query = `
        INSERT INTO todos (user_id, name, description, duedate, priority)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, user_id AS "userId", name, description, duedate, priority, completed, created_at AS "createdAt", updated_at AS "updatedAt"
    `

    const values = [userId, name, description ?? null, duedate, priority ?? 0]
    const { rows } = await pool.query(query, values)
    return NextResponse.json(rows[0], { status: 201 })
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json()
        const { id, name, description, duedate, priority, completed } = body
        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 })
        }
        const userId = await getUserIdFromRequest(request)
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Build dynamic update set
        const fields: string[] = []
        const values: any[] = []
        let idx = 1
        if (name !== undefined) { 
            fields.push(`name = $${idx++}`)
            values.push(name) 
        }
        if (description !== undefined) { 
            fields.push(`description = $${idx++}`)
            values.push(description)
        }
        if (duedate !== undefined) { 
            fields.push(`duedate = $${idx++}`)
            values.push(duedate)
        }
        if (priority !== undefined) { 
            fields.push(`priority = $${idx++}`)
            values.push(priority)
        }
        if (completed !== undefined) {
            fields.push(`completed = $${idx++}`)
            values.push(completed)
        }

        if (fields.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
        }

        // update updated_at too
        fields.push(`updated_at = NOW()`)

        // ensure we only update rows belonging to the user
        const query = `UPDATE todos SET ${fields.join(', ')} WHERE id = $${idx} AND user_id = $${idx + 1} RETURNING id, user_id AS "userId", name, description, duedate, priority, completed, created_at AS "createdAt", updated_at AS "updatedAt"`
        values.push(id)
        values.push(userId)

        const { rows } = await pool.query(query, values)
        if (rows.length === 0) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }
        return NextResponse.json(rows[0])
    } catch (err) {
        console.error('Error in /api/todos PATCH', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        // support id as query param or JSON body
        const url = new URL(request.url)
        let id = url.searchParams.get('id')
        if (!id) {
        const body = await request.json().catch(() => null)
        id = body?.id
        }

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 })
        }
        const userId = await getUserIdFromRequest(request)
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const { rows } = await pool.query('DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId])
        if (rows.length === 0) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }
        return NextResponse.json({ message: 'Deleted', id: rows[0].id })
    } catch (err) {
        console.error('Error in /api/todos DELETE', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
