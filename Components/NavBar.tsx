'use client'
import Image from 'next/image'
import logo from '../public/logo.png'
import { useRouter } from 'next/navigation';
export default function NavBar() {
    const router = useRouter();

    return (
        <div className='flex flex-row justify-between text-black p-2 bg-gray-100'>
            <Image src={logo} alt="Logo" width={40} height={40} />
            <div>
                <button onClick={() => router.push('/Login')} className="mt-1 mb-1 ml-2 mr-2 p-2 rounded-md border-1 bg-gray-200 hover:bg-gray-300">Login</button>
                <button onClick={() => router.push('/Signup')} className="mt-1 mb-1 ml-2 mr-2 p-2 rounded-md border-1 bg-gray-200 hover:bg-gray-300">Signup</button>
                <button onClick={() => router.push('/')} className="mt-1 mb-1 ml-2 mr-2 p-2 rounded-md border-1 bg-gray-200 hover:bg-gray-300">Home</button>
                <button onClick={() => router.push('/ListPage')} className="mt-1 mb-1 ml-2 mr-2 p-2 rounded-md border-1 bg-gray-200 hover:bg-gray-300">TaskList</button>

            </div>
        </div>
    )
}