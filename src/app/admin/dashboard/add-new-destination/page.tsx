"use client"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { doc, getDoc, runTransaction } from "firebase/firestore"
import firebase from "../../../../../firebase.ts"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { v4 as uuidv4 } from "uuid"
import { useSession } from "@/lib/auth-client"
import axios from "axios"

const Footer = dynamic(() => import("@/app/components/Footer"))
const ToastContainer = dynamic(() => import("react-toastify").then((mod) => mod.ToastContainer))

type SearchListDocument = {
    entries: {
        id: string
        destinationName: string
        destinationId: string
    }[]
}

export default function AddNewDestinationPage() {
    const [destinationId, setDestinationId] = useState<string>("")
    const [destinationName, setDestinationName] = useState<string>("")
    const [destinationDescription, setDestinationDescription] = useState<string>("")
    const [coverImageUrl, setCoverImageUrl] = useState<string>("")
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

        if (!destinationId || !destinationName || !destinationDescription.trim() || !coverImageUrl.trim()) {
            toast.info("Please fill all required fields correctly.")
            return
        }

        setIsProcessing(true)

        try {
            const docRef = doc(firebase.db, "destinations", destinationId.toLowerCase())
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                toast.error("A Destination with the same ID already exists.")
                return
            }

            toast.info("Generating image preview...")
            const res = await axios.post(
                "/api/getBase64",
                JSON.stringify({ imageUrl: coverImageUrl }),
                { headers: { "Content-Type": "application/json" } }
            )
            const base64 = res.data.base64

            const searchListRef = doc(firebase.db, "search", "list")
            await runTransaction(firebase.db, async (transaction) => {
                const searchListDoc = await transaction.get(searchListRef)

                let updatedEntries: { id: string; destinationName: string; destinationId: string }[] = []
                if (searchListDoc.exists()) {
                    const searchListData = searchListDoc.data() as SearchListDocument
                    updatedEntries = [...searchListData.entries]
                }

                updatedEntries.push({
                    id: uuidv4(),
                    destinationName: destinationName,
                    destinationId: destinationId.toLowerCase(),
                })

                transaction.set(searchListRef, { entries: updatedEntries })

                transaction.set(doc(firebase.db, "destinations", destinationId), {
                    id: destinationId.toLowerCase(),
                    name: destinationName,
                    description: destinationDescription,
                    coverImageUrl: coverImageUrl,
                    coverImageBase64: base64,
                    coverImageFilename: destinationId.toLowerCase(),
                    packages: [],
                    created: new Date(),
                    modified: new Date(),
                    version: 0,
                    modificationInfo: {
                        createdBy: session?.user?.email ?? "admin",
                        lastModifiedBy: session?.user?.email ?? "admin",
                    },
                })
            })

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
                                    <label htmlFor="cover-image-url" className="block text-sm font-medium leading-6 text-gray-900">
                                        Cover Image URL
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="url"
                                            id="cover-image-url"
                                            name="cover-image-url"
                                            required
                                            value={coverImageUrl}
                                            onChange={(e) => setCoverImageUrl(e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                            placeholder="https://images.unsplash.com/photo-..."
                                        />
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-gray-600">
                                        Paste an image URL from Unsplash, Pexels, or any public image host.
                                    </p>
                                    {coverImageUrl && (
                                        <img
                                            src={coverImageUrl}
                                            alt="Preview"
                                            className="mt-3 h-40 w-full object-cover rounded-md"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none"
                                            }}
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
                            Submit
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    )
}
