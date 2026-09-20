"use client"

import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {doc, runTransaction} from "firebase/firestore";
import firebase from "../../../../../firebase.ts";
import {useRouter} from "next/navigation";

import dynamic from 'next/dynamic';
import {PackageShowcaseDataFile} from "@/app/_utility/types";
import {useSession} from "@/lib/auth-client";

const Footer = dynamic(() => import('@/app/components/Footer'));
const ToastContainer = dynamic(() => import("react-toastify").then(mod => mod.ToastContainer));


type Package = {
    id: string
    name: string
    coverImageUrl: string
    coverImageFilename: string, originalPrice: number
    discountedPrice: number
    description: string
    duration: string, pickupAndDropLocation: string, itinerary: {
        id: string, heading: string, description: string,
    }[] | []
    inclusions: string[] | []
    exclusions: string[] | []
}


interface DestinationData {
    id: string,
    name: string,
    description: string,
    coverImageUrl: string,
    packages: Package[] | [],
    fileName: string,
    created: Date,
    modified: Date,
    version: number,
    modificationInfo: {
        createdBy: string, lastModifiedBy: string
    }
}


export default function ModifyDestinationPage() {
    const [packageId, setPackageId] = useState<string>('')
    const [destinationId, setDestinationId] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const router = useRouter();
    const { data: session, isPending } = useSession()

    useEffect(() => {
        if (!isPending && !session) {
            router.push(`/admin?message=Please Login&src=/admin/dashboard/delete-package`)
        }
    }, [session, isPending, router])


    async function handleDeletion(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!destinationId || !packageId) {
            toast.info('Please fill all required details.');
            return;
        }

        setIsProcessing(true) // disable button

        try {
            // start transaction
            await runTransaction(firebase.db, async (transaction) => {
                // get destination document
                const destinationRef = doc(firebase.db, "destinations", destinationId);
                const destinationSnapshot = await transaction.get(destinationRef);
                const trendingPackagesRef = doc(firebase.db, "homepage", "trendingPackages");
                //fetch data
                const trendingPackagesSnapshot = await transaction.get(trendingPackagesRef);

                if (!destinationSnapshot.exists()) { // if it does not exist
                    setIsProcessing(false);
                    throw new Error("No Destination Found using the given ID");
                }

                let destinationData = destinationSnapshot.data() as DestinationData;
                let availablePackages = destinationData.packages;

                if (availablePackages.length === 0) { // if length is 0
                    toast.info("This destinations has no packages.");
                    return;
                }

                // length is not 0
                let deletionPackage = availablePackages.filter((pkg) => pkg.id === packageId); // get the pkg to be deleted

                if (deletionPackage.length === 0) {
                    throw new Error("No Package found with specified package id.")
                }

                // filter out the packages
                availablePackages = availablePackages.filter((pkg) => pkg.id !== packageId); // filter out docs where id does not match

                destinationData = {...destinationData, packages: availablePackages} // updated the data


                // find the package in trending list
                let trendingPackagesData = trendingPackagesSnapshot.data() as PackageShowcaseDataFile;
                if (!trendingPackagesData || !trendingPackagesData.entries || trendingPackagesData.entries.length === 0) { // no data in cloud
                    toast("Package Not detected in Trending List.")
                }

                trendingPackagesData.entries = trendingPackagesData.entries.filter(
                    (data) => data.packageId !== packageId && data.destinationId !== destinationId
                ); // filter and set it again.


                // update the new list
                transaction.update(trendingPackagesRef, {...trendingPackagesData})


                transaction.update(destinationRef, {...destinationData})
            })

            toast.success("Package successfully removed.")
            setTimeout(() => {
                // note: if  success, button will not be re-enabled.
                router.push('/admin/dashboard');
            }, 3000);


        } catch (err) {
            console.log(err);
            if (err instanceof Error) toast.error(err.message);
            setIsProcessing(false)
        }


    }

    return (<>

            <ToastContainer/>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={async (e) => await handleDeletion(e)}>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">

                            <h2 className="mt-10 text-base font-semibold leading-7 text-gray-900">Please input all
                                fields correctly.</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                As Soon as you press the delete button <span
                                className={'text-red-600'}>The package will be deleted.</span>
                            </p>


                            {/*Destination ID*/}

                            <div className="sm:col-span-4 my-10">
                                <label htmlFor="destination-id"
                                       className="block text-sm font-medium leading-6 text-gray-900  ">
                                    Destination ID
                                </label>
                                <div className="mt-2">
                                    <div
                                        className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-600 sm:max-w-md">
                                        <span
                                            className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">packagefy.com/destination/</span>
                                        <input
                                            type="text"
                                            name="destination-id"
                                            id="destination-id"
                                            autoComplete="off"
                                            required
                                            value={destinationId?.toLowerCase()}
                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                            placeholder="destination-id"
                                            onChange={(e) => {
                                                const trimmedValue = e.target.value.trim(); // Trim leading and trailing whitespace
                                                if (!trimmedValue.includes(' ')) { // Check if the trimmed value contains spaces
                                                    setDestinationId(trimmedValue.toLowerCase()); // Update state with lowercase value
                                                }
                                            }}
                                        />
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-gray-600">
                                        Destination ID is Found in url.<br/>
                                    </p>
                                </div>
                            </div>

                            {/*Package ID*/}
                            <div className="sm:col-span-4">
                                <label htmlFor="package-id"
                                       className="block text-sm font-medium leading-6 text-gray-900  ">
                                    Package ID
                                </label>
                                <div className="mt-2">
                                    <div
                                        className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-600 sm:max-w-md">
                                        <span
                                            className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">package/</span>
                                        <input
                                            type="text"
                                            name="package-id"
                                            id="package-id"
                                            autoComplete="off"
                                            required
                                            value={packageId.toLowerCase()}
                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                            placeholder="package-id"
                                            onChange={(e) => {
                                                const trimmedValue = e.target.value.trim(); // Trim leading and trailing whitespace
                                                if (!trimmedValue.includes(' ')) { // Check if the trimmed value contains spaces
                                                    setPackageId(trimmedValue.toLowerCase()); // Update state with lowercase value
                                                }
                                            }}
                                        />

                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-gray-600">Also found in the url. <span
                                        className='bold text-black'>packagefy.com/destination/{destinationId?.toLowerCase() || 'destination-id'}/package/<span
                                        className={'text-sky-400'}>{packageId || 'package-id'}</span></span>
                                    </p>
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
                            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:bg-opacity-30"
                        >
                            Delete
                        </button>
                    </div>
                </form>
            </div>
            <Footer/>

        </>

    )
}
