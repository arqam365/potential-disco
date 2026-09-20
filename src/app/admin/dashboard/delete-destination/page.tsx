"use client"
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {doc, getDoc, runTransaction} from "firebase/firestore";
import firebase from "../../../../../firebase.ts";
import {useRouter} from "next/navigation";

import dynamic from 'next/dynamic';
import {PackageShowcaseDataFile, searchListDocument} from '@/app/_utility/types';
import {useSession} from "@/lib/auth-client";
const Footer = dynamic(() => import('@/app/components/Footer'));
const ToastContainer = dynamic(() => import("react-toastify").then(mod => mod.ToastContainer));

import {DestinationData} from "@/app/_utility/types";


export default function ModifyDestinationPage() {
    const [searchId, setSearchId] = useState<string>('')
    const [destinationId, setDestinationId] = useState<string>('');
    const [destinationName, setDestinationName] = useState<string>('');
    const [destinationDescription, setDestinationDescription] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [fetchedData, setFetchedData] = useState<DestinationData>();
    const [coverImageUrl, setCoverImageUrl] = useState<string>();

    const router = useRouter();
    const { data: session, isPending } = useSession()

    useEffect(() => {
        if (!isPending && !session) {
            router.push(`/admin?message=Please Login&src=/admin/dashboard/delete-destination`)
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

            // check if data exists
            const docRef = doc(firebase.db, "destinations", searchId.toLowerCase());
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                toast.error('Invalid ID or Entry does not exist in Database.');
                setIsProcessing(false);
                return
            }

            // if data exists
            const destinationDataSnapshot: DestinationData = docSnap.data() as DestinationData;
            setFetchedData(destinationDataSnapshot)
            console.log(destinationDataSnapshot)

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
        setIsProcessing(true); // disable button

        if (!fetchedData) {
            toast.error("The delete function was launched before initial data fetched. This isn't ideal, Please make a report for this Bug.");
            setIsProcessing(false);
            return;
        }

        try {
            const destinationDocRef = doc(firebase.db, "destinations", destinationId);
            const destinationDocSnapshot = await getDoc(destinationDocRef);
            const fetchedDestinationData = destinationDocSnapshot.data() as DestinationData;

            const trendingPackagesRef = doc(firebase.db, "homepage", "trendingPackages");
            const trendingPackagesSnapshot = await getDoc(trendingPackagesRef);
            const trendingPackagesData = trendingPackagesSnapshot.data() as PackageShowcaseDataFile;

            const searchListRef = doc(firebase.db, "search", "list");
            const searchListSnapshot = await getDoc(searchListRef);
            const searchListData = searchListSnapshot.data() as searchListDocument;

            await runTransaction(firebase.db, async (transaction) => {
                // Update trending packages
                if (trendingPackagesData && trendingPackagesData.entries) {
                    trendingPackagesData.entries = trendingPackagesData.entries.filter(
                        (data) => data.destinationId !== destinationId
                    );
                    transaction.set(trendingPackagesRef, trendingPackagesData);
                }

                // Update search list
                if (searchListData && searchListData.entries) {
                    searchListData.entries = searchListData.entries.filter(
                        (entry) => entry.destinationId !== destinationId
                    );
                    transaction.update(searchListRef, {...searchListData});
                }

                // Delete destination document
                transaction.delete(destinationDocRef);
            });

            toast.success('Data deleted successfully.');

            setTimeout(() => {
                router.push('/admin/dashboard');
            }, 3000);

        } catch (err) {
            console.error(err);
            if (err instanceof Error) toast.error(err.message);
            setIsProcessing(false); // enable button
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
                                        className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-600 sm:max-w-md">
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
                                            placeholder="New-York"
                                            onChange={(e) => setSearchId(e.target.value.toLowerCase() ? e.target.value : '')}
                                        />
                                    </div>
                                </div>
                                <button
                                    disabled={isProcessing}
                                    type="submit"
                                    className="mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:bg-opacity-30"
                                >
                                    Search
                                </button>
                                <button type="button"
                                        onClick={() => router.push('/admin/dashboard')}
                                        className="ml-6 text-sm font-semibold leading-6 text-gray-900">
                                    Cancel
                                </button>

                                <p className="mt-3 text-sm leading-6 text-gray-600">NO SPACES ARE ALLOWED IN ID.</p>
                            </div>
                            {/*ID FORM END*/}
                        </div>
                    </div>
                </form>
            </div>

            {fetchedData && <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={async (e) => await handleDestinationUpdate(e)}>
                    <div className="space-y-12">
                        <div className="pb-12">
                            <h2 className="mt-10 text-base font-semibold leading-7 text-gray-900">Details</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Please cancel if you do not wish to change.
                                Changes will be visible in about 15 seconds after confirmation.
                            </p>

                            <h2 className="mt-10 text-base font-semibold leading-7 text-gray-900">Stats</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                This Destination has <span
                                className={'font-bold'}>{fetchedData.packages.length}</span> Packages.
                                <span className={'text-red-600'}> They will also be deleted.</span>
                            </p>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">


                                {/*Destination ID*/}
                                <div className="sm:col-span-4">
                                    <label htmlFor="destination-id"
                                           className="block text-sm font-medium leading-6 text-gray-900  ">
                                        Destination ID (readonly)
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
                                                value={destinationId}
                                                readOnly={true}
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-red-600 placeholder:text-red-600 focus:ring-0 sm:text-sm sm:leading-6"
                                                onChange={(e) => {
                                                    const trimmedValue = e.target.value.trim(); // Trim leading and trailing whitespace
                                                    if (!trimmedValue.includes(' ')) { // Check if the trimmed value contains spaces
                                                        setDestinationId(trimmedValue.toLowerCase()); // Update state with lowercase value
                                                    }
                                                }}
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
                                            className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-600 sm:max-w-md">
                                        <span
                                            className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                                            <input
                                                type="text"
                                                name="destination-id"
                                                id="destination-id"
                                                readOnly={true}
                                                value={destinationName}
                                                autoComplete="off"
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                onChange={(e) => setDestinationName(e.target.value ? e.target.value : '')}
                                            />
                                        </div>
                                    </div>
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
                    readOnly={true}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                />
                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <div className="mt-2">
                                        <div
                                            className="flex rounded-md  sm:max-w-md">
                                            <a href={coverImageUrl}
                                               className="flex items-center gap-x-1 text-sm font-medium leading-6 text-gray-900">
                                                Cover image
                                                <span className={'flex items-center gap-x-1 text-sky-400'}>
                                            Link
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/>
                                        </svg>
                                        </span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                            disabled={isProcessing}
                            type="submit"
                            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:bg-opacity-30"
                        >
                            Delete
                        </button>
                    </div>
                </form>

            </div>}

            {/*length 0 is false*/}
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
