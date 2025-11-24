"use client"

import { useState } from 'react'

type Props = {
    onCreate: (todo: any) => void
    onCancel?: () => void
    defaultUserId?: number
}

export default function AddTodoForm({ onCreate, onCancel, defaultUserId = 1 }: Props) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [duedate, setDuedate] = useState('')
    const [priority, setPriority] = useState<number>(0)
    const [adding, setAdding] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        setAdding(true)
        setError(null)
        try {
            const payload = {
                userId: defaultUserId,
                name,
                description,
                duedate: new Date(duedate).toISOString(),
                priority: Number(priority || 0),
            }

            const res = await fetch('/api/todos', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const json = await res.json().catch(() => ({}))
                throw new Error(json?.error || `Failed to add task (${res.status})`)
            }

            const created = await res.json()
            onCreate(created)
            // reset
            setName('')
            setDescription('')
            setDuedate('')
            setPriority(0)
            onCancel?.()
        } catch (err: any) {
            console.error(err)
            setError(err?.message || 'Failed to add task')
        } finally {
            setAdding(false)
        }
    }

    return (
        <form onSubmit={submit} className="mb-4 p-4 border rounded bg-gray-50">
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Task name" className="p-2 border rounded" />
                <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="p-2 border rounded" />
                <input required type="datetime-local" value={duedate} onChange={(e) => setDuedate(e.target.value)} className="p-2 border rounded" />
                <input type="number" value={priority} onChange={(e) => setPriority(Number(e.target.value))} className="p-2 border rounded" min={0} max={5} />
            </div>
            <div className="mt-3">
                <button type="submit" disabled={adding} className="px-3 py-2 bg-green-600 text-white rounded mr-2">{adding ? 'Adding...' : 'Add Task'}</button>
                <button type="button" onClick={() => onCancel?.()} className="px-3 py-2 bg-gray-300 rounded">Cancel</button>
            </div>
        </form>
    )
}
