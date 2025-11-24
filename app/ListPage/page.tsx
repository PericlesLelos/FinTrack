"use client"

import { useEffect, useState } from 'react'
import ToDoCard from '@/Components/ToDoCard'
import NavBar from '@/Components/NavBar'
import TaskSummary from '@/Components/TaskSummary'
import AddTodoForm from '@/Components/AddTodoForm'
import EditTodoForm from '@/Components/EditTodoForm'

type TodoFromApi = {
    id: number
    userId?: number
    name: string
    description?: string | null
    duedate: string
    priority: number
    completed: boolean
}

export default function ListPage() {
    const [todos, setTodos] = useState<TodoFromApi[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showAdd, setShowAdd] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')

    useEffect(() => {
        let mounted = true
                async function load() {
            try {
                const res = await fetch('/api/todos', { credentials: 'include' })
                if (!res.ok) throw new Error(`Failed to load todos: ${res.status}`)
                const data = await res.json()
                if (mounted) setTodos(data)
            } catch (err: any) {
                console.error(err)
                if (mounted) setError(err.message ?? 'Failed to load')
            } finally {
                if (mounted) setLoading(false)
            }
        }
        load()
        return () => { mounted = false }
    }, [])

    // derive summary stats from todos
    const summary = (() => {
        const now = new Date()
        const total = todos.length
        const completed = todos.filter((t) => t.completed).length
        const pending = total - completed
        const overdue = todos.filter((t) => !t.completed && new Date(t.duedate) < now).length
        const highPriority = todos.filter((t) => (t.priority ?? 0) >= 3).length
        // next due (nearest future duedate)
        const upcoming = todos
            .filter((t) => new Date(t.duedate) >= now)
            .sort((a, b) => new Date(a.duedate).getTime() - new Date(b.duedate).getTime())[0]
        const nextDue = upcoming ? new Date(upcoming.duedate) : null
        return { total, completed, pending, overdue, highPriority, nextDue }
    })()
    

    return (
        <div>
            <NavBar />
            <TaskSummary summary={summary} />
            <div className="bg-white text-black min-h-screen p-4">
                <div className="mb-4 flex items-center gap-4">
                    <div className='flex flex-row w-full justify-between'>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-black text-white' : 'bg-gray-300 text-black'}`}>
                                All
                            </button>
                            <button
                                onClick={() => setFilter('pending')}
                                className={`px-3 py-1 rounded ${filter === 'pending' ? 'bg-black text-white' : 'bg-gray-300 text-black'}`}>
                                Pending
                            </button>
                            <button
                                onClick={() => setFilter('completed')}
                                className={`px-3 py-1 rounded ${filter === 'completed' ? 'bg-black text-white' : 'bg-gray-300 text-black'}`}>
                                Completed
                            </button>
                        </div>
                        <div>
                            <button
                                className="px-3 py-2 bg-gray-300 text-black rounded mr-2 hover:bg-gray-400"
                                onClick={() => setShowAdd((s) => !s)}
                            >
                                {showAdd ? 'Cancel' : 'Add Task'}
                            </button>
                        </div>
                    </div>
                </div>

                {showAdd && (
                    <AddTodoForm
                        defaultUserId={1}
                        onCancel={() => setShowAdd(false)}
                        onCreate={(created) => {
                            setTodos((t) => [...t, {
                                id: created.id,
                                userId: created.userId,
                                name: created.name,
                                description: created.description,
                                duedate: created.duedate,
                                priority: created.priority,
                                completed: created.completed,
                            },])
                        }}
                    />
                )}
                {loading && <div>Loading todos...</div>}
                {error && <div className="text-red-500">{error}</div>}
                {!loading && !error && (
                    <div className="grid grid-cols-1 gap-4">
                        {todos
                            .filter((t) => {
                                if (filter === 'all') {
                                    return true
                                }
                                if (filter === 'completed') {
                                    return !!t.completed
                                }
                                return !t.completed
                            })
                            .slice()
                            .sort((a, b) => b.priority - a.priority)
                            .map((item) => (                               
                                <div key={item.id}>
                                {editingId === item.id ? (
                                    <EditTodoForm
                                        todo={item}
                                        onCancel={() => setEditingId(null)}
                                        onSaved={(updated) => {
                                            setTodos((prev) =>
                                                prev.map((t) => (t.id === updated.id ? updated : t)),
                                            )
                                            setEditingId(null)
                                        }}
                                    />
                                ) : (
                                    <ToDoCard
                                        id={item.id}
                                        name={item.name}
                                        description={item.description ?? ''}
                                        dueDate={new Date(item.duedate)}
                                        priority={item.priority}
                                        completed={item.completed}
                                        onEdit={() => setEditingId(item.id)}
                                        onDelete={async () => {
                                            if (!confirm('Delete this todo?')) {
                                                return
                                            }
                                            try {
                                                const res = await fetch(`/api/todos`, {
                                                    method: 'DELETE',
                                                    credentials: 'include',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ id: item.id }),
                                                })
                                                if (!res.ok) {
                                                    throw new Error('Delete failed')
                                                }
                                                setTodos((prev) => prev.filter((t) => t.id !== item.id))
                                            } catch (err) {
                                                console.error(err)
                                                setError('Failed to delete todo')
                                            }
                                        }}
                                    />
                                )}
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    )
}