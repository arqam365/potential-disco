"use client"

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { v4 as uuidv4 } from "uuid";
import {
    Package,
    DestinationData,
    PackageReview,
} from "@/app/_utility/types";
import {Field, Label, Switch} from "@headlessui/react";
import {useSession} from "@/lib/auth-client";

const Footer = dynamic(() => import('@/app/components/Footer'), { ssr: false });
const ToastContainer = dynamic(() => import("react-toastify").then(mod => mod.ToastContainer), { ssr: false });
const CkEditorInitialized = dynamic(() => import('@/app/components/CkEditorInitialized'), { ssr: false });

type ItineraryData = {
    id: string;
    heading: string,
    description: string,
}


export default function ModifyDestinationPage() {
    const [packageId, setPackageId] = useState<string>('')
    const [destinationId, setDestinationId] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const router = useRouter();
    const [fetchedPackageData, setFetchedPackageData] = useState<Package>()
    const [fetchedDestinationData, setFetchedDestinationData] = useState<DestinationData>()

    const [packageName, setPackageName] = useState<string>('');
    const [packageDescription, setPackageDescription] = useState<string>('');
    const [coverImageUrl, setCoverImageUrl] = useState<string>('');
    const [newCoverImageFile, setNewCoverImageFile] = useState<File | null>(null);
    const [newCoverImagePreview, setNewCoverImagePreview] = useState<string>('');
    const [originalPrice, setOriginalPrice] = useState<number>(0);
    const [discountedPrice, setDiscountedPrice] = useState<number>(0);
    const [exclusions, setExclusions] = useState<string[]>([]);
    const [inclusions, setInclusions] = useState<string[]>([]);
    const [itineraryData, setItineraryData] = useState<ItineraryData[]>([]);
    const [packageDuration, setPackageDuration] = useState<string>('');
    const [pickUpAndDropSpot, setPickUpAndDropSpot] = useState<string>('');
    const [reviewsData, setReviewsData] = useState<PackageReview[]>([]);
    const [isTrending, setIsTrending] = useState(false);

    const { data: session, isPending } = useSession();

    useEffect(() => {
        if (!isPending && !session) {
            router.push(`/admin?message=Please Login&src=/admin/dashboard/edit-package`);
        }
    }, [session, isPending, router]);

    function handleCkeditorChange(id: string, data: string) {
        const updatedData = itineraryData.map((item) =>
            item.id === id ? { ...item, description: data } : item
        );
        setItineraryData(updatedData);
    }

    function handleReviewCkEditorChange(id: string, data: string) {
        const updatedData = reviewsData.map((item) =>
            item.id === id ? {...item, content: data} : item
        );
        setReviewsData(updatedData);
    }

    async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!destinationId || !packageId) {
            toast.info('Please fill all required details.');
            return;
        }

        setIsProcessing(true)

        try {
            const res = await fetch(`/api/destinations/${destinationId}`)
            if (!res.ok) {
                setIsProcessing(false);
                throw new Error("No Destination Found using the given ID");
            }

            const destinationData: DestinationData = await res.json()
            const availablePackages = destinationData.packages

            if (availablePackages.length === 0) {
                toast.info("This destinations has no packages.");
                setIsProcessing(false);
                return;
            }

            const searchedPackage = availablePackages.filter((pkg) => pkg.id === packageId)

            if (searchedPackage.length === 0) {
                throw new Error("No Package found with specified package id.")
            }

            setFetchedPackageData(searchedPackage[0]);
            setFetchedDestinationData(destinationData);

            setPackageName(searchedPackage[0].name)
            setPackageDescription(searchedPackage[0].description)
            setOriginalPrice(searchedPackage[0].originalPrice)
            setDiscountedPrice(searchedPackage[0].discountedPrice)
            setItineraryData(searchedPackage[0].itinerary)
            setInclusions(searchedPackage[0].inclusions)
            setExclusions(searchedPackage[0].exclusions)
            setPackageDuration(searchedPackage[0].duration)
            setPickUpAndDropSpot(searchedPackage[0].pickupAndDropLocation)
            setReviewsData(searchedPackage[0].reviews)
            setCoverImageUrl(searchedPackage[0].coverImageUrl)
            setIsProcessing(false)
        } catch (err) {
            console.log(err);
            if (err instanceof Error) toast.error(err.message);
            setIsProcessing(false)
        }
    }

    async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!packageName || !packageDescription || !packageDescription.trim().length || !pickUpAndDropSpot || !packageDuration) {
            toast.info('Please fill the details or refresh to restart.');
            return;
        }
        if (originalPrice === 0 || discountedPrice === 0) {
            toast.info('Prices cannot be Zero.');
            return;
        }
        if (originalPrice < discountedPrice) {
            toast.info('Original Price cannot be lower than Discounted price.')
            return
        }

        if (!fetchedPackageData) {
            toast.error("Update function executed before fetching details. aborting...");
            return;
        }

        setIsProcessing(true)
        try {
            let finalCoverImageUrl = coverImageUrl
            if (newCoverImageFile) {
                toast.info("Uploading image...")
                const formData = new FormData()
                formData.append("file", newCoverImageFile)
                const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
                if (!uploadRes.ok) throw new Error("Image upload failed.")
                const { url } = await uploadRes.json()
                finalCoverImageUrl = url
            }

            const res = await fetch(`/api/destinations/${destinationId}/packages/${packageId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: packageName,
                    description: packageDescription,
                    duration: packageDuration,
                    pickupDropLocation: pickUpAndDropSpot,
                    coverImageUrl: finalCoverImageUrl,
                    originalPrice: originalPrice,
                    discountedPrice: discountedPrice,
                    itinerary: itineraryData,
                    inclusions: inclusions,
                    exclusions: exclusions,
                    reviews: reviewsData || [],
                }),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error ?? "Failed to update package.")
            }

            toast.success('Updated Successfully.');

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
                <form onSubmit={async (e) => await handleSearch(e)}>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">

                            <h2 className="mt-10 text-base font-semibold leading-7 text-gray-900">Please input all
                                fields correctly.</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Press the search button to get details.
                            </p>


                            {/*Destination ID*/}
                            <div className="sm:col-span-4 my-10">
                                <label htmlFor="destination-id"
                                       className="block text-sm font-medium leading-6 text-gray-900  ">
                                    Destination ID
                                </label>
                                <div className="mt-2">
                                    <div
                                        className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
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
                                        className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
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
                                        className={'text-indigo-400'}>{packageId || 'package-id'}</span></span>
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
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-opacity-30"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {/*  DATA SHOWCASE FORM  */}
                {fetchedPackageData && <form onSubmit={async (e) => await handleUpdate(e)}>

                    {/*TRENDING SWITCH*/}
                    {/*IsTrending*/}
                    <div className="sm:col-span-4">
                        <Field as="div" className="flex items-center justify-between my-10">
                                    <span className="flex-grow flex flex-col">
                                        <Label as="span" className="text-sm font-medium text-gray-900" passive>
                                            Add The package to Trending Packages List?
                                        </Label>
                                    </span>
                            <Switch
                                checked={isTrending}
                                onChange={setIsTrending}
                                className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
                            >
                                <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                            </Switch>
                        </Field>
                    </div>

                    {/*1St section*/}
                    <section className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Edit Package</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                This Package will be visible as soon as you publish the it.
                            </p>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                {/*Destination ID*/}
                                <div className="sm:col-span-4">
                                    <label htmlFor="destination-id"
                                           className="block text-sm font-medium leading-6 text-gray-900  ">
                                        Destination ID
                                    </label>
                                    <div className="mt-2">
                                        <div
                                            className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  sm:max-w-md">
                                        <span
                                            className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">packagefy.com/destination/</span>
                                            <input
                                                type="text"
                                                name="destination-id"
                                                id="destination-id"
                                                autoComplete="off"
                                                readOnly
                                                value={fetchedDestinationData?.id}
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-indigo-600  focus:ring-0 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/*Package ID*/}
                                <div className="sm:col-span-4">
                                    <label htmlFor="package-id"
                                           className="block text-sm font-medium leading-6 text-gray-900 ">
                                        Package ID
                                    </label>
                                    <div className="mt-2">
                                        <div
                                            className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md">
                                        <span
                                            className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">package/</span>
                                            <input
                                                type="text"
                                                name="package-id"
                                                id="package-id"
                                                autoComplete="off"
                                                readOnly={true}
                                                value={fetchedPackageData?.id}
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-indigo-600 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                            />

                                        </div>
                                    </div>
                                </div>


                                {/*Package Name*/}
                                <div className="sm:col-span-4">
                                    <label htmlFor="package-name"
                                           className="block text-sm font-medium leading-6 text-gray-900">
                                        Package Name
                                    </label>
                                    <div className="mt-2">
                                        <div
                                            className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                        <span
                                            className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                                            <input
                                                type="text"
                                                name="package-name"
                                                id="package-name"
                                                required
                                                value={packageName}
                                                autoComplete="off"
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                placeholder="Swiss New Year Bash"
                                                onChange={(e) => setPackageName(e.target.value ? e.target.value : '')}
                                            />
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-gray-600">Appears on main banner and
                                        elsewhere on page. Make sure this is correctly spelled.</p>
                                </div>

                                {/*Package Description*/}
                                <div className="col-span-full">
                                    <label htmlFor="destination-description"
                                           className="block text-sm font-medium leading-6 text-gray-900">
                                        Package Description
                                    </label>
                                    <div className="mt-2">
                <textarea
                    id="destination-description"
                    name="destination-description"
                    rows={5}
                    value={packageDescription}
                    onChange={(e) => setPackageDescription(e.target.value ? e.target.value : '')}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder={'A Brief Description'}
                />
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-gray-600">Make sure it is not too long.
                                        Recommend size is 6-7 lines max.</p>
                                </div>

                                {/*Package Duration*/}
                                <div className="sm:col-span-4">
                                    <label htmlFor="package-duration"
                                           className="block text-sm font-medium leading-6 text-gray-900">
                                        Package Duration
                                    </label>
                                    <div className="mt-2">
                                        <div
                                            className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                        <span
                                            className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                                            <input
                                                type="text"
                                                name="package-duration"
                                                id="package-duration"
                                                required
                                                value={packageDuration}
                                                autoComplete="off"
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                placeholder="5 Days 4 Nights OR 5D 4N"
                                                onChange={(e) => setPackageDuration(e.target.value ? e.target.value : '')}
                                            />
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-gray-600">Make sure it fits a format and
                                        is not too long.</p>
                                </div>

                                {/*Package Pickup and Drop Spot*/}
                                <div className="sm:col-span-4">
                                    <label htmlFor="package-pickup-and-drop-spot"
                                           className="block text-sm font-medium leading-6 text-gray-900">
                                        Pickup & Drop Spot
                                    </label>
                                    <div className="mt-2">
                                        <div
                                            className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                        <span
                                            className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                                            <input
                                                type="text"
                                                name="package-pickup-and-drop-spot"
                                                id="package-pickup-and-drop-spot"
                                                required
                                                value={pickUpAndDropSpot}
                                                autoComplete="off"
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                placeholder="Delhi, Manali"
                                                onChange={(e) => setPickUpAndDropSpot(e.target.value ? e.target.value : '')}
                                            />
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-gray-600"><b>Format :</b> &quot;Pickup
                                        Spot&quot; , &quot;Drop Spot&quot;. <br/>
                                        <span className={'text-red-600 font-bold'}>Please use comma to separate the locations else the Page will CRASH</span>
                                        <br/>
                                        If Spot are same, Write them twice and use comma.


                                    </p>
                                </div>

                                {/*Cover Image*/}
                                <div className="col-span-full">
                                    <label htmlFor="new-cover-image-file" className="block text-sm font-medium leading-6 text-gray-900">
                                        Cover Image (optional to update)
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

                                {/*ORIGINAL PRICE*/}
                                <div className="sm:col-span-4">
                                    <label htmlFor="original-price"
                                           className="block text-sm font-medium leading-6 text-gray-900  ">
                                    Original Price
                                    </label>
                                    <div className="mt-2">
                                        <div
                                            className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                        <span
                                            className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">INR ₹</span>
                                            <input
                                                type="number"
                                                name="original-price"
                                                id="original-price"
                                                autoComplete="off"
                                                required
                                                value={originalPrice}
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                placeholder="original-price"
                                                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/*Discounted PRICE*/}
                                <div className="sm:col-span-4">
                                    <label htmlFor="discounted-price"
                                           className="block text-sm font-medium leading-6 text-gray-900  ">
                                        Discounted Price
                                    </label>
                                    <div className="mt-2">
                                        <div
                                            className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                        <span
                                            className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">INR ₹</span>
                                            <input
                                                type="number"
                                                name="discounted-price"
                                                id="discounted-price"
                                                autoComplete="off"
                                                required
                                                value={discountedPrice}
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                placeholder="discounted-price"
                                                onChange={(e) => setDiscountedPrice(Number(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>

                    </section>

                    {/*Itinerary*/}
                    <section className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="mt-10 text-2xl font-semibold leading-7 text-gray-900">Itinerary</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                This items will appear in Itinerary section.
                            </p>
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-4">
                                    {itineraryData.length > 0 && itineraryData.map((itinerary, i) => (
                                        <div key={i} className="flex flex-col items-start my-2">
                                            <div className="sm:col-span-4 w-full mb-4">
                                                <label htmlFor={`itinerary-${itinerary.id}`}
                                                       className="block text-sm font-medium leading-6 text-gray-900">
                                                    Heading
                                                </label>
                                                <div className="mt-2">
                                                    <div
                                                        className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md w-full">
                                                        <input
                                                            type="text"
                                                            name={`itinerary-${itinerary.id}`}
                                                            id={`itinerary-${itinerary.id}`}
                                                            required
                                                            value={itinerary.heading}
                                                            autoComplete="off"
                                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                            placeholder="Swiss New Year Bash"
                                                            onChange={(e) => {
                                                                const updatedData = itineraryData.map((item, index) =>
                                                                    index === i ? {
                                                                        ...item,
                                                                        heading: e.target.value
                                                                    } : item
                                                                );
                                                                setItineraryData(updatedData);
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const newItinerary = itineraryData.filter(item => item.id !== itinerary.id);
                                                                console.log(itineraryData)
                                                                console.log(newItinerary)
                                                                setItineraryData(newItinerary);
                                                            }}
                                                            type="button"
                                                            className="translate-x-20 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                 viewBox="0 0 24 24" strokeWidth={1.5}
                                                                 stroke="currentColor" className="size-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="sm:col-span-4 w-full">
                                                <label htmlFor={`description-${i}`}
                                                       className="block text-sm font-medium leading-6 text-gray-900">
                                                    Description
                                                </label>
                                                <div className="mt-2">
                                                    <div
                                                        className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md w-full">
                                                        <div id={`description-${i}`}
                                                             className="block w-full border-0 bg-transparent">
                                                            <CkEditorInitialized
                                                                key={itinerary.id} // Use the unique id as key
                                                                initialValue={itinerary.description}
                                                                onChangeFunction={(id, data) => handleCkeditorChange(id, data)}
                                                                id={itinerary.id} // Pass the unique id instead of dataIndex
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}


                                    <button
                                        disabled={isProcessing}
                                        onClick={() => setItineraryData((prev) => [...prev, {
                                            heading: '',
                                            description: '',
                                            id: uuidv4()
                                        }])}
                                        type="button"
                                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-opacity-30"
                                    >
                                        Add
                                    </button>
                                </div>

                            </div>
                        </div>
                    </section>

                    {/*Inclusion*/}
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="mt-10 text-2xl font-semibold leading-7 text-gray-900">Inclusion</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                This items will appear in inclusion section.
                            </p>
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-4">
                                    {inclusions.map((inclusion, i) => (
                                        <div key={i} className="flex items-center my-2">
                                            <textarea
                                                id={`inclusion-${i}`}
                                                name={`inclusion-${i}`}
                                                rows={1}
                                                value={inclusion}
                                                onChange={(e) => {
                                                    const newInclusions = [...inclusions];
                                                    newInclusions[i] = e.target.value;
                                                    setInclusions(newInclusions);
                                                }}
                                                required
                                                className="flex-1 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                placeholder={'Bring Beer 🍺'}
                                            />
                                            <button
                                                disabled={isProcessing}
                                                onClick={() => {
                                                    const newInclusions = inclusions.filter((_, index) => index !== i);
                                                    setInclusions(newInclusions);
                                                }}
                                                type="button"
                                                className="translate-x-20 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:bg-opacity-30"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                                </svg>

                                            </button>
                                        </div>


                                    ))}
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => setInclusions((prev) => [...prev, ''])}
                                        type="button"
                                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-opacity-30"
                                    >
                                        Add
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/*Exclusion*/}
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="mt-10 text-2xl font-semibold leading-7 text-gray-900">Exclusions</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                This items will appear in exclusion section.
                            </p>
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-4">
                                    {exclusions.map((exclusion, i) => (
                                        <div key={i} className="flex items-center my-2">
                                            <textarea
                                                id={`exclusion-${i}`}
                                                name={`exclusion-${i}`}
                                                rows={1}
                                                value={exclusion}
                                                onChange={(e) => {
                                                    const newExclusions = [...exclusions];
                                                    newExclusions[i] = e.target.value;
                                                    setExclusions(newExclusions);
                                                }}
                                                required
                                                className="flex-1 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                placeholder={'No Guns.'}
                                            />
                                            <button
                                                disabled={isProcessing}
                                                onClick={() => {
                                                    const newExclusions = exclusions.filter((_, index) => index !== i);
                                                    setExclusions(newExclusions);
                                                }}
                                                type="button"
                                                className="translate-x-20 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:bg-opacity-30"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                                </svg>

                                            </button>
                                        </div>


                                    ))}
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => setExclusions((prev) => [...prev, ''])}
                                        type="button"
                                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-opacity-30"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*REVIEWS*/}
                    <section className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="mt-10 text-2xl font-semibold leading-7 text-gray-900">Reviews</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                This items will appear in Reviews section.
                            </p>
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-4">
                                    {reviewsData?.length > 0 && reviewsData.map((review, i) => (
                                        <div key={i} className="flex flex-col items-start my-2">

                                            {/*Review Title*/}
                                            <div className="sm:col-span-4 w-full mb-4">
                                                <label htmlFor={`review-${review.id}-title`}
                                                       className="block text-sm font-medium leading-6 text-gray-900">
                                                    Review Title
                                                </label>
                                                <div className="mt-2">
                                                    <div
                                                        className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 sm:max-w-md w-full">
                                                        <input
                                                            type="text"
                                                            name={`review-${review.id}-title`}
                                                            id={`review-${review.id}-title`}
                                                            required
                                                            value={review.title}
                                                            autoComplete="off"
                                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                            placeholder="Great Work by the Team."
                                                            onChange={(e) => {
                                                                const updatedData = reviewsData.map((item, index) =>
                                                                    index === i ? {
                                                                        ...item,
                                                                        title: e.target.value
                                                                    } : item
                                                                );
                                                                setReviewsData(updatedData);
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const filterdReviews = reviewsData.filter(item => item.id !== review.id);
                                                                setReviewsData(filterdReviews);
                                                            }}
                                                            type="button"
                                                            className="translate-x-20 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                 viewBox="0 0 24 24" strokeWidth={1.5}
                                                                 stroke="currentColor" className="size-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/*Author Name*/}
                                            <div className="sm:col-span-4 w-full mb-4">
                                                <label htmlFor={`review-${review.id}-name`}
                                                       className="block text-sm font-medium leading-6 text-gray-900">
                                                    Author Name
                                                </label>
                                                <div className="mt-2">
                                                    <div
                                                        className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 sm:max-w-md w-full">
                                                        <input
                                                            type="text"
                                                            name={`review-${review.id}-name`}
                                                            id={`review-${review.id}-name`}
                                                            required
                                                            value={review.name}
                                                            autoComplete="off"
                                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                            placeholder="Great Work."
                                                            onChange={(e) => {
                                                                const updatedData = reviewsData.map((item, index) =>
                                                                    index === i ? {
                                                                        ...item,
                                                                        name: e.target.value
                                                                    } : item
                                                                );
                                                                setReviewsData(updatedData);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {/*Number of stars*/}
                                            <div className="sm:col-span-4 w-full mb-4">
                                                <label htmlFor={`review-${review.id}-name`}
                                                       className="block text-sm font-medium leading-6 text-gray-900">
                                                    Rating / Stars (out of 5)
                                                </label>
                                                <div className="mt-2">
                                                    <div
                                                        className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 sm:max-w-md w-full">
                                                        <input
                                                            type="number"
                                                            name={`review-${review.id}-stars`}
                                                            id={`review-${review.id}-stars`}
                                                            required
                                                            value={review.stars}
                                                            max={5}
                                                            min={0}
                                                            autoComplete="off"
                                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                            placeholder="Great Work."
                                                            onChange={(e) => {
                                                                const updatedData = reviewsData.map((item, index) =>
                                                                    index === i ? {
                                                                        ...item,
                                                                        stars: Number(e.target.value)
                                                                    } : item
                                                                );
                                                                setReviewsData(updatedData);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/*POST DATE*/}
                                            <div className="sm:col-span-4 w-full mb-4">
                                                <label htmlFor={`review-${review.id}-postDate`}
                                                       className="block text-sm font-medium leading-6 text-gray-900">
                                                    Post Date (When the review was posted)
                                                </label>
                                                <div className="mt-2">
                                                    <div
                                                        className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 sm:max-w-md w-full">
                                                        <input
                                                            type={'date'}
                                                            name={`review-${review.id}-postDate`}
                                                            id={`review-${review.id}-postDate`}
                                                            required
                                                            value={review.postDate}
                                                            max={5}
                                                            min={0}
                                                            autoComplete="off"
                                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                            placeholder="Great Work."
                                                            onChange={(e) => {
                                                                const updatedData = reviewsData.map((item, index) =>
                                                                    index === i ? {
                                                                        ...item,
                                                                        postDate: e.target.value
                                                                    } : item
                                                                );
                                                                setReviewsData(updatedData);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/*CONTENT*/}
                                            <div className="sm:col-span-4 w-full">
                                                <label htmlFor={`review-content-${i}`}
                                                       className="block text-sm font-medium leading-6 text-gray-900">
                                                    Description
                                                </label>
                                                <div className="mt-2">
                                                    <div
                                                        className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 sm:max-w-md w-full">
                                                        <div id={`review-content-${i}`}
                                                             className="block w-full border-0 bg-transparent">
                                                            <CkEditorInitialized
                                                                key={review.id} // Use the unique id as key
                                                                initialValue={review.content}
                                                                onChangeFunction={(id, data) => handleReviewCkEditorChange(id, data)}
                                                                id={review.id} // Pass the unique id instead of dataIndex
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr className={'mt-6'} />
                                            </div>
                                        </div>

                                    ))}



                                    <button
                                        disabled={isProcessing}
                                        onClick={() => setReviewsData((prev) => [...prev, {
                                            id: uuidv4(),
                                            name: '',
                                            title: '',
                                            content: '',
                                            stars: 0,
                                            postDate: '',
                                            description: '',
                                        }])}
                                        type="button"
                                        className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:bg-opacity-30"
                                    >
                                        Add
                                    </button>
                                </div>

                            </div>
                        </div>
                    </section>

                    {/*Submission*/}
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
                </form>}

            </div>
            <Footer/>

        </>

    )
}
