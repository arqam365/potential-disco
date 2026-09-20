"use client"
import React, { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import dynamic from "next/dynamic"
import { signIn, useSession } from "@/lib/auth-client"

const SpinnerFullScreen = dynamic(() => import("@/app/components/FullScreenSpinner"), { ssr: false })

function AdminEntryContent() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const { data: session, isPending } = useSession()

    useEffect(() => {
        if (searchParams?.get("message")) {
            toast.warning(searchParams.get("message"))
        }
    }, [searchParams])

    useEffect(() => {
        if (!isPending && session) {
            const src = searchParams?.get("src")
            router.push(src ?? "/admin/dashboard")
        }
    }, [session, isPending, router, searchParams])

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        try {
            const result = await signIn.email({
                email,
                password,
                callbackURL: searchParams?.get("src") ?? "/admin/dashboard",
            })
            if (result.error) {
                toast.error(result.error.message ?? "Login failed")
            }
        } catch (err) {
            if (err instanceof Error) toast.error(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (isPending) return <SpinnerFullScreen />

    return (
        <>
            <ToastContainer />
            <section id="login-section">
                <div className="absolute inset-0 bg-neutral-700 flex items-center justify-center w-screen h-screen">
                    <div className="bg-white rounded-lg px-6 py-8 shadow-xl w-full max-w-sm">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-500 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 text-center mb-1">Admin Login</h3>
                        <p className="text-sm text-gray-500 text-center mb-6">Sign in to access the dashboard.</p>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="admin@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>
                        <p className="mt-4 text-center text-xs text-gray-400">
                            No account?{" "}
                            <a href="/admin/register" className="text-indigo-600 hover:underline">
                                Register admin
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default function AdminEntryPage() {
    return (
        <Suspense fallback={<SpinnerFullScreen />}>
            <AdminEntryContent />
        </Suspense>
    )
}
