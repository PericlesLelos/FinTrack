'use client'

import { useRouter } from "next/navigation";


export default function Splash() {

    const router = useRouter();
    return (
        <section className="min-h-screen flex items-center bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-10">
                <div className="lg:w-1/2">
                    <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Get more done with simple, focused todos</h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Capture tasks, set due dates, and track progress — all in a lightweight app built for clarity.
                    </p>
                    <div className="flex gap-3">
                        <button onClick={() => router.push('/Signup')} className="px-5 py-3 bg-green-400 text-white rounded-lg shadow hover:bg-green-600">
                            Get started — free
                        </button>
                    </div>
                    <div className="mt-8 flex gap-6 text-sm text-gray-500">
                        <div>
                            <strong>99%</strong> uptime
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/2">
                    <div className="w-full bg-white rounded-xl shadow p-4">
                        <div className="h-72 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-md flex items-center justify-center text-gray-400">
                            <Image className="flex flex-row w-full" src={UI_Image} alt={"UI image"}></Image>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}