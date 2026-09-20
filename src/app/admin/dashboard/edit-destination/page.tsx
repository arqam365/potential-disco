"use client"

import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {DestinationData} from "@/app/_utility/types";
import dynamic from 'next/dynamic';
import {useSession} from "@/lib/auth-client";
const Footer = dynamic(() => import('@/app/components/Footer'));
const ToastContainer = dynamic(() => import("react-toastify").then(mod => mod.ToastContainer));


export default function ModifyDestinationPage() {
    const [searchId, setSearchId] = useState<string>('')
    const [destinationId, setDestinationId] = useState<string>('');
    const [destinationName, setDestinationName] = useState<string>('');
    const [destinationDescription, setDestinationDescription] = useState<string>('');
    const [newCoverImageFile, setNewCoverImageFile] = useState<File | null>(null)
    const [newCoverImagePreview, setNewCoverImagePreview] = useState<string>("")
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [fetchedData, setFetchedData] = useState<DestinationData>();
    const [coverImageUrl, setCoverImageUrl] = useState<string>();

    const router = useRouter();
    const { data: session, isPending } = useSession()

    useEffect(() => {
        if (!isPending && !session) {
            router.push(`/admin?message=Please Login&src=/admin/dashboard/edit-destination`)
        }
    }, [session, isPending, router])


    async function HandleIdSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setIsProcessing(true)

        try {
            if (!searchId) {
                toast.error("Please enter the destination ID");
                setIsProcessing(false);
                return
            }

            const res = await fetch(`/api/destinations/${searchId.toLowerCase()}`)
            if (!res.ok) {
                toast.error('Invalid ID or Entry does not exist in Database.');
                setIsProcessing(false);
                return
            }

            const destinationDataSnapshot: DestinationData = await res.json()
            setFetchedData(destinationDataSnapshot)

            setDestinationId(destinationDataSnapshot.id);
            setDestinationName(destinationDataSnapshot.name);
            setDestinationDescription(destinationDataSnapshot.description);
            setCoverImageUrl(destinationDataSnapshot.coverImageUrl);

            setIsProcessing(false);

        } catch (err) {
            console.log(err);
            setIsProcessing(false);
            if (err instanceof Error) return toast.error(err.message)
            return toast.error("An Unknown Error occurred. Please try again.");
        }
    }


    async function handleDestinationUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!destinationId || !destinationName || !destinationDescription || !destinationDescription.trim().length) {
            toast.info('You cannot make fields null. Make sure they have some value.');
            return;
        }

        setIsProcessing(true)

        let downloadUrl = coverImageUrl

        if (newCoverImageFile) {
            toast.info("Uploading image...")
            const formData = new FormData()
            formData.append("file", newCoverImageFile)
            const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
            if (!uploadRes.ok) throw new Error("Image upload failed.")
            const { url } = await uploadRes.json()
            downloadUrl = url
        }

        if (!fetchedData) {
            toast.error("The submit function was launched before initial data fetched. This isn't ideal, Please make a report for this Bug.");
            setIsProcessing(false);
            return
        }

        try {
            const res = await fetch(`/api/destinations/${destinationId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: destinationName,
                    description: destinationDescription,
                    coverImageUrl: downloadUrl,
                }),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error ?? "Failed to update destination.")
            }

            toast.success('Data Updated successfully.');

            setTimeout(() => {
                router.push('/admin/dashboard');
            }, 3000);

        } catch (err) {
            console.error(err);
            if (err instanceof Error) toast.error(err.message);
            setIsProcessing(false)
        }
    }

    return (
        <>
            <ToastContainer/>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={async (e) => await HandleIdSearch(e)}>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            {/*ID FORM START*/}
                            <h2 className="mt-10 text-base font-semibold leading-7 text-gray-900">Please put the
                                destinationID
                                (located in the URL)</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                example: www.packagefy.com/destination/<span
                                className={'text-red-600'}>&quot;_destinationId_&quot;</span>
                            </p>


                            <div className="sm:col-span-4 mt-5">
                                <label htmlFor="destination-id"
                                       className="block text-sm font-medium leading-6 text-gray-900">
                                    Destination ID
                                </label>
                                <div className="mt-2">
                                    <div
                                        className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                        <span
                                            className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                                        <input
                                            type="text"
                                            name="search-id"
                                            id="search-id"
                                            required
                                            value={searchId.toLowerCase()}
                                            autoComplete="off"
                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                            placeholder="new-york"
                                            onChange={(e) => {
                                                const trimmedValue = e.target.value.trim(); // Trim leading and trailing whitespace
                                                if (!trimmedValue.includes(' ')) { // Check if the trimmed value contains spaces
                                                    setSearchId(trimmedValue.toLowerCase()); // Update state with lowercase value
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <button
                                    disabled={isProcessing}
                                    type="submit"
                                    className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-opacity-30"
                                >
                                    Search
                                </button>
                                <button type="button"
                                        onClick={() => router.push('/admin/dashboard')}
                                        className="ml-6 text-sm font-semibold leading-6 text-gray-900">
                                    Cancel
                                </button>

                                <p className="mt-3 text-sm leading-6 text-gray-600">NO SPACES ALLOWED. ALL LETTERS ARE
                                    IN <b>lower case.</b></p>
                            </div>
                            {/*ID FORM END*/}
                        </div>
                    </div>
                </form>
            </div>

            {fetchedData && <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={async (e) => await handleDestinationUpdate(e)}>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">


                            <h2 className="mt-10 text-base font-semibold leading-7 text-gray-900">Details</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Please cancel if you do not wish to change.
                                Changes will be visible in about 15 seconds after confirmation.
                            </p>

                            <h2 className="mt-10 text-base font-semibold leading-7 text-gray-900">Stats</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                This Destination has <span
                                className={'font-bold'}>{fetchedData.packages.length}</span> Packages.
                                They will not be modified by this operation.
                            </p>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">


                                {/*Destination ID*/}
                                <div className="sm:col-span-4">
                                    <label htmlFor="destination-id"
                                           className="block text-sm font-medium leading-6 text-gray-900  ">
                                        Destination ID (readonly) (cannot be changed once defined)
                                    </label>
                                    <div className="mt-2">
                                        <div
                                            className="flex rounded-md  sm:max-w-md">
                                        <span
                                            className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">packagefy.com/destination/</span>
                                            <input
                                                type="text"
                                                name="destination-id"
                                                id="destination-id"
                                                autoComplete="off"
                                                required={false}
                                                value={destinationId}
                                                readOnly={true}
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-red-600 placeholder:text-red-600 focus:ring-0 sm:text-sm sm:leading-6"
                                                placeholder="destination-id"
                                                onChange={(e) => setDestinationId(e.target.value ? e.target.value : '')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/*Destination Name*/}
                                <div className="sm:col-span-4">
                                    <label htmlFor="destination-id"
                                           className="block text-sm font-medium leading-6 text-gray-900">
                                        Destination Name
                                    </label>
                                    <div className="mt-2">
                                        <div
                                            className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                        <span
                                            className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                                            <input
                                                type="text"
                                                name="destination-id"
                                                id="destination-id"
                                                required={false}
                                                value={destinationName}
                                                autoComplete="off"
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                placeholder="New York"
                                                onChange={(e) => setDestinationName(e.target.value ? e.target.value : '')}
                                            />
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-gray-600">Make sure it is correct. This
                                        will
                                        appear on Banner & all other places.</p>
                                </div>


                                <div className="col-span-full">
                                    <label htmlFor="destination-description"
                                           className="block text-sm font-medium leading-6 text-gray-900">
                                        Description
                                    </label>
                                    <div className="mt-2">
                <textarea
                    id="destination-description"
                    name="destination-description"
                    rows={5}
                    value={destinationDescription}
                    onChange={(e) => setDestinationDescription(e.target.value ? e.target.value : '')}
                    required={false}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder={'A Brief Description'}
                />
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-gray-600">Make sure it is not too long.
                                        Recommend size is 6-7 lines max.</p>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="new-cover-image-file" className="block text-sm font-medium leading-6 text-gray-900">
                                        Cover photo (optional to update)
                                    </label>
                                    {coverImageUrl && !newCoverImagePreview && (
                                        <img src={coverImageUrl} alt="Current cover" className="mt-2 h-40 w-full object-cover rounded-md"
                                             onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                                    )}
                                    <div className="mt-2">
                                        <input
                                            type="file"
                                            id="new-cover-image-file"
                                            name="new-cover-image-file"
                                            accept="image/*"
                                            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] ?? null
                                                setNewCoverImageFile(file)
                                                setNewCoverImagePreview(file ? URL.createObjectURL(file) : "")
                                            }}
                                        />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">Leave blank to keep current image.</p>
                                    {newCoverImagePreview && (
                                        <img src={newCoverImagePreview} alt="New cover preview" className="mt-3 h-40 w-full object-cover rounded-md" />
                                    )}
                                </div>

                            </div>
                        </div>

                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button"
                                onClick={() => router.push('/admin/dashboard')}
                                className="text-sm font-semibold leading-6 text-gray-900">
                            Cancel
                        </button>
                        <button
                            disabled={isProcessing}
                            type="submit"
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-opacity-30"
                        >
                            {isProcessing ? "Uploading..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>}

            {fetchedData?.packages && <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={async (e) => await handleDestinationUpdate(e)}>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="mt-10 text-2xl font-semibold leading-7 text-gray-900">Packages</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                All the packages available inside this destination.
                            </p>
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                {/*Destination Name*/}
                                <div className="sm:col-span-4">
                                    {fetchedData.packages.map((pkg, i) => (
                                        <a href={`/destination/${destinationId}/package/${pkg.id}`} key={i}
                                           className="flex items-center gap-x-1 text-sm font-medium leading-6 text-gray-900">
                                            {pkg.name}
                                            <span className={'flex items-center gap-x-1 text-sky-400'}>
                                            Link
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/>
                                        </svg>
                                        </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </form>

            </div>}

            <Footer/>
        </>

    )
}
