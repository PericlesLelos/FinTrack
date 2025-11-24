'use client'

import { useRouter } from "next/navigation"
import React from "react"
import { useState } from "react"
import { signIn } from 'next-auth/react'

export default function LoginForm() {
    const [error, setError] = useState('')

    const router = useRouter()

    const [form, setForm] = useState<{
        email: string
        password: string
    }>({
        email: '',
        password: ''
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value,
        })
    }

    const [isSubmitting, setIsSubmitting] = useState(false)
    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: form.email,
                password: form.password,
            } as any)

            if (!result || (result as any).error) {
                const status = (result as any)?.status
                if (status === 401) setError('Invalid email or password')
                else setError((result as any)?.error || 'Failed to sign in')
                return
            }

            router.push('/ListPage')
        } catch (err) {
            console.error('Signin error', err)
            setError('Unexpected error. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }
    
    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Sign in to your account</h2>
                {error && (
                    <div role="alert" className="text-red-600 mb-4 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            placeholder="Password"
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
