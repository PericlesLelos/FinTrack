'use client'

import { useRouter } from "next/navigation"
import React from "react"
import { useState } from "react"

export default function SignupForm() {
    const [error, setError] = useState('')

    const router = useRouter()

    const [form, setForm] = useState<{
        email: string
        password: string
        firstName: string
        lastName: string
        tos: boolean
    }>({
        email: '',
        password:'',
        firstName: '',
        lastName: '',
        tos: false
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const {name, value, type} = e.target
        const isChecked = e.target.checked
        setForm({
            ...form,
            [name] : type === "checkbox" ? isChecked : value
        })
    }

    const [isSubmitting, setIsSubmitting] = useState(false)
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")

        // Build payload sent to the server. Password hashing is handled server-side.
        const payload = {
            email: form.email,
            password: form.password,
            firstName: form.firstName,
            lastName: form.lastName,
        }

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                if (res.status === 409) {
                    setError('An account with that email already exists.')
                } else {
                    const json = await res.json().catch(() => ({}))
                    setError(json?.error || 'Failed to create account')
                }
                return
            }

            // Success — navigate to sign-in or another page
            router.push('/Login')
        } catch (err) {
            console.error('Signup error', err)
            setError('Unexpected error. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }    
    
    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Create an account</h2>
                {error && (
                    <div role="alert" className="text-red-600 mb-4 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                            <input
                                id="firstName"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                placeholder="First"
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                            <input
                                id="lastName"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                placeholder="Last"
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex items-start gap-2">
                        <input
                            id="tos"
                            type="checkbox"
                            name="tos"
                            checked={form.tos}
                            onChange={handleChange}
                            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            required
                        />
                        <label htmlFor="tos" className="text-sm text-gray-700">I have read and accept the Terms of Service</label>
                    </div>

                    <div>
                        <button type="submit" className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                            {isSubmitting ? 'Registering...' : 'Create account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
