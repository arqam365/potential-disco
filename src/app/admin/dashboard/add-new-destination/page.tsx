"use client"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { useSession } from "@/lib/auth-client"

const Footer = dynamic(() => import("@/app/components/Footer"))
const ToastContainer = dynamic(() => import("react-toastify").then((mod) => mod.ToastContainer))

export default function AddNewDestinationPage() {
    const [destinationId, setDestinationId] = useState<string>("")
    const [destinationName, setDestinationName] = useState<string>("")
    const [destinationDescription, setDestinationDescription] = useState<string>("")
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
    const [coverImagePreview, setCoverImagePreview] = useState<string>("")
    const [isProcessing, setIsProcessing] = useState<boolean>(false)

    const router = useRouter()
    const { data: session, isPending } = useSession()

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/admin?message=Please Login&src=/admin/dashboard/add-new-destination")
        }
    }, [session, isPending, router])

    async function handleNewDestination(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!destinationId || !destinationName || !destinationDescription.trim() || !coverImageFile) {
            toast.info("Please fill all required fields correctly.")
            return
        }

        setIsProcessing(true)

        try {
            toast.info("Uploading image...")
            const formData = new FormData()
            formData.append("file", coverImageFile)
            const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
            if (!uploadRes.ok) throw new Error("Image upload failed.")
            const { url: coverImageUrl } = await uploadRes.json()

            const destRes = await fetch("/api/destinations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: destinationId.toLowerCase(),
                    name: destinationName,
                    description: destinationDescription,
                    coverImageUrl,
                }),
            })
            if (!destRes.ok) {
                const err = await destRes.json()
                throw new Error(err.error ?? "Failed to create destination.")
            }

            const searchRes = await fetch("/api/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: destinationId.toLowerCase(),
                    destinationId: destinationId.toLowerCase(),
                    destinationName: destinationName,
                }),
            })
            if (!searchRes.ok) {
                const err = await searchRes.json()
                throw new Error(err.error ?? "Failed to add search entry.")
            }

            toast.success("Destination added successfully.")
            router.push("/admin/dashboard")
        } catch (err) {
            console.error(err)
            if (err instanceof Error) toast.error(err.message)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="mt-10">
            <ToastContainer />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={handleNewDestination}>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Add a new Destination</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                This destination will be visible as soon as you publish the changes.
                            </p>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-4">
                                    <label htmlFor="destination-id" className="block text-sm font-medium leading-6 text-gray-900">
                                        Destination ID
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 sm:max-w-md">
                                            <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                                packagefy.com/destination/
                                            </span>
                                            <input
                                                type="text"
                                                name="destination-id"
                                                id="destination-id"
                                                autoComplete="off"
                                                required
                                                value={destinationId}
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                placeholder="destination-id"
                                                onChange={(e) => setDestinationId(e.target.value.toLowerCase().trim())}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="destination-name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Destination Name
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 sm:max-w-md">
                                            <input
                                                type="text"
                                                name="destination-name"
                                                id="destination-name"
                                                required
                                                value={destinationName}
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                placeholder="Destination Name"
                                                onChange={(e) => setDestinationName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-gray-600">
                                        Make sure it is correct. This will appear everywhere.
                                    </p>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="destination-description" className="block text-sm font-medium leading-6 text-gray-900">
                                        Description
                                    </label>
                                    <div className="mt-2">
                                        <textarea
                                            id="destination-description"
                                            name="destination-description"
                                            rows={5}
                                            value={destinationDescription}
                                            onChange={(e) => setDestinationDescription(e.target.value)}
                                            required
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                            placeholder="A Brief Description"
                                        />
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-gray-600">
                                        Recommended size is 6-7 lines max.
                                    </p>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="cover-image-file" className="block text-sm font-medium leading-6 text-gray-900">
                                        Cover Image
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="file"
                                            id="cover-image-file"
                                            name="cover-image-file"
                                            accept="image/*"
                                            required
                                            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] ?? null
                                                setCoverImageFile(file)
                                                setCoverImagePreview(file ? URL.createObjectURL(file) : "")
                                            }}
                                        />
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-gray-600">
                                        Select an image file to upload as the cover photo.
                                    </p>
                                    {coverImagePreview && (
                                        <img
                                            src={coverImagePreview}
                                            alt="Preview"
                                            className="mt-3 h-40 w-full object-cover rounded-md"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                            type="button"
                            onClick={() => router.push("/admin/dashboard")}
                            className="text-sm font-semibold leading-6 text-gray-900"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isProcessing}
                            type="submit"
                            className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:bg-opacity-30"
                        >
                            {isProcessing ? "Uploading..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    )
}
