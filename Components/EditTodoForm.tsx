"use client"

import { useState } from 'react'

type Props = {
    todo: {
        id: number
        name: string
        description?: string | null
        duedate: string
        priority: number
        completed: boolean
    }
    onCancel: () => void
    onSaved: (updated: any) => void
}

export default function EditTodoForm({ todo, onCancel, onSaved }: Props) {
    const [name, setName] = useState(todo.name ?? '')
    const [description, setDescription] = useState<string>(todo.description ?? '')
    const [duedate, setDuedate] = useState(() => {
        // Convert ISO to datetime-local input format
        try {
        const d = new Date(todo.duedate)
        const tzOffset = d.getTimezoneOffset() * 60000
        const local = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16)
        return local
        } catch { return '' }
    })
    const [priority, setPriority] = useState<number>(todo.priority ?? 0)
    const [completed, setCompleted] = useState<boolean>(!!todo.completed)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        setError(null)
        try {
            const payload: any = {
                id: todo.id,
                name,
                description,
                duedate: new Date(duedate).toISOString(),
                priority: Number(priority || 0),
                completed,
            }

            const res = await fetch('/api/todos', {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            if (!res.ok) {
                const json = await res.json().catch(() => ({}))
                throw new Error(json?.error || `Failed to save (${res.status})`)
            }
            const updated = await res.json()
            onSaved(updated)
        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Failed to save')
        } finally {
            setSaving(false)
        }
  }

    return (
        <form onSubmit={submit} className="p-3 border rounded bg-white">
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input value={name} onChange={(e) => setName(e.target.value)} required className="p-2 border rounded" />
                <input value={description ?? ''} onChange={(e) => setDescription(e.target.value)} className="p-2 border rounded" />
                <input type="datetime-local" value={duedate} onChange={(e) => setDuedate(e.target.value)} required className="p-2 border rounded" />
                <input type="number" value={priority} onChange={(e) => setPriority(Number(e.target.value))} min={0} max={5} className="p-2 border rounded" />
            </div>
            <div className="flex gap-2 mt-3">
                <label className="flex items-center gap-2"><input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} /> Completed</label>
                <button type="submit" disabled={saving} className="px-3 py-2 bg-gray-300 text-black rounded hover:bg-gray-400">{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={onCancel} className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            </div>
        </form>
    )
}
