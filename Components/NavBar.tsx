'use client'
import Image from 'next/image'
import logo from '../public/logo.png'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

export default function NavBar() {
    const router = useRouter()
    const { data: session, status } = useSession()

    return (
        <div className='flex flex-row justify-between text-black p-2 bg-gray-100'>
            <Image src={logo} alt="Logo" width={40} height={40} />
            <div>

                {status === 'loading' ? (
                    <span className="ml-2">Loading...</span>
                ) : session?.user ? (
                    <>
                        <span className="ml-2 mr-2">{session.user.name ?? session.user.email}</span>
                        <button onClick={() => router.push('/ListPage')} className="mt-1 mb-1 ml-2 mr-2 p-2 rounded-md border-1 bg-gray-200 hover:bg-gray-300">TaskList</button>
                        <button onClick={() => signOut({ callbackUrl: '/' })} className="mt-1 mb-1 ml-2 mr-2 p-2 rounded-md border-1 bg-red-200 hover:bg-red-300">Logout</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => router.push('/Login')} className="mt-1 mb-1 ml-2 mr-2 p-2 rounded-md border-1 bg-gray-200 hover:bg-gray-300">Login</button>
                        <button onClick={() => router.push('/Signup')} className="mt-1 mb-1 ml-2 mr-2 p-2 rounded-md border-1 bg-gray-200 hover:bg-gray-300">Signup</button>
                    </>
                )}
                <button onClick={() => router.push('/')} className="mt-1 mb-1 ml-2 mr-2 p-2 rounded-md border-1 bg-gray-200 hover:bg-gray-300">Home</button>
            </div>
        </div>
    )
}