"use client"
import { ToastContainer } from "react-toastify"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import SpinnerFullScreen from "@/app/components/FullScreenSpinner"
import { useSession, signOut } from "@/lib/auth-client"

const links = [
    { href: "dashboard/add-new-destination", title: "Add Destination" },
    { href: "dashboard/edit-destination", title: "Edit Destination" },
    { href: "dashboard/delete-destination", title: "Remove Destination" },
    { href: "dashboard/add-new-package", title: "Add Package" },
    { href: "dashboard/edit-package", title: "Edit Package" },
    { href: "dashboard/delete-package", title: "Remove Package" },
]

export default function AdminDashboard() {
    const router = useRouter()
    const { data: session, isPending } = useSession()

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/admin?message=Please Login")
        }
    }, [session, isPending, router])

    if (isPending) return <SpinnerFullScreen />

    return (
        <>
            <ToastContainer />
            <section id="admin-dashboard">
                <div className="bg-neutral-200 flex flex-col items-center justify-center w-screen h-screen text-white gap-8">
                    <div className="flex items-center gap-4">
                        <p className="text-gray-600 text-sm">Logged in as {session?.user?.email}</p>
                        <button
                            onClick={async () => {
                                await signOut()
                                router.push("/admin")
                            }}
                            className="text-sm text-red-600 hover:underline"
                        >
                            Sign out
                        </button>
                    </div>
                    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {links.map((link, index) => (
                            <li key={index} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
                                <Link
                                    href={link.href}
                                    className="w-full flex items-center justify-center p-6 space-x-6 rounded-lg hover:ring hover:ring-indigo-700"
                                >
                                    <p className="mt-1 text-gray-500 text-sm truncate">{link.title}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </>
    )
}
