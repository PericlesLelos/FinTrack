'use client'

import { useRouter } from "next/navigation";
import React from "react"
import { useState } from "react";

export default function SignupForm() {
    const [error, setError] = useState('');

    const router = useRouter();

    const [form, setForm] = useState<{
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        tos: boolean;
    }>({
        email: '',
        password:'',
        firstName: '',
        lastName: '',
        tos: false
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const {name, value, type} = e.target;
        const isChecked = e.target.checked;
        setForm({
            ...form,
            [name] : type === "checkbox" ? isChecked : value
        })
    }

    const [isSubmitting, setIsSubmitting] = useState(false);
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

    }

/*
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        // Handle signin here
        // console.log("Form Submitted: ", form);

        try {
            const response = await fetch('/api/users', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                // throw new Error('ERROR');
                setError("An error occurrred while adding user");
                return;
            }

            const data = await response.json();
            console.log("User added: ", data);
            
            router.push("/signin");

            
        } catch (error) {
            console.error("Error in CreateUser!", error);
            setError("Cheack your Credentials");
        } finally{
            setIsSubmitting(false);
        }
        

    }
*/
    
    
    return (
        <div className="flex flex-row justify-center">
            <div className="flex justify-center items-center bg-white w-min m-2 p-5 rounded-md border-1 border-gray-300 ">
                {error && <p className="text-red-500 mb-4 text-center"> {error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <label htmlFor="email" className="border-1 rounded-md w-min m-1 p-1 bg-gray-300">Email</label>
                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="email@gmail.com"
                        required
                        className="border-1 border-black rounded-md"
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="name"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="First"
                        required
                    />
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="name"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Last"
                        required
                    />
                    <div className="flex-row m-2 p-2">
                        <input
                            type="checkbox"
                            name="tos"
                            checked={form.tos}
                            onChange={handleChange}
                            className="p-2"
                            required
                        />
                        <label htmlFor="tos" className="p-2 !bg-gray-100">I have read and accept the Terms of Service</label>
                    </div>
                    <button type='submit' className='w-fill'>
                        {isSubmitting ? "Registering..." : "Register"}
                        </button>
                </form>
            </div>
        </div>
    )
}
