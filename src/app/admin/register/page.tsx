"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import { signUp } from "@/lib/auth-client"

export default function AdminRegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        try {
            const result = await signUp.email({ name, email, password, callbackURL: "/admin/dashboard" })
            if (result.error) {
                toast.error(result.error.message ?? "Registration failed")
            } else {
                toast.success("Account created. Redirecting...")
                setTimeout(() => router.push("/admin/dashboard"), 1500)
            }
        } catch (err) {
            if (err instanceof Error) toast.error(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="absolute inset-0 bg-neutral-700 flex items-center justify-center w-screen h-screen">
                <div className="bg-white rounded-lg px-6 py-8 shadow-xl w-full max-w-sm">
                    <h3 className="text-lg font-medium text-gray-900 text-center mb-1">Create Admin Account</h3>
                    <p className="text-sm text-gray-500 text-center mb-6">First time setup only.</p>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                   className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                   placeholder="Admin" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                   className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                   placeholder="admin@example.com" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
                                   className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                   placeholder="min 8 characters" />
                        </div>
                        <button type="submit" disabled={isLoading}
                                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50">
                            {isLoading ? "Creating..." : "Create Account"}
                        </button>
                    </form>
                    <p className="mt-4 text-center text-xs text-gray-400">
                        Already have an account?{" "}
                        <a href="/admin" className="text-indigo-600 hover:underline">Sign in</a>
                    </p>
                </div>
            </div>
        </>
    )
}
