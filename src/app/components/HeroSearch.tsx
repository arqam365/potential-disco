"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import firebase from "../../../firebase.ts";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { DestinationData } from "@/app/_utility/types";
import { ComboboxInput } from "@headlessui/react";
import SpinnerFullScreen from "@/app/components/FullScreenSpinner.tsx";

const Combobox = dynamic(() => import('@headlessui/react').then((mod) => mod.Combobox), { ssr: true });
const ComboboxOption = dynamic(() => import('@headlessui/react').then((mod) => mod.ComboboxOption), { ssr: true });
const CiSearch = dynamic(() => import('react-icons/ci').then((mod) => mod.CiSearch), { ssr: true });
const ParagraphSkeleton = dynamic(() => import('@/app/components/ParagraphSkeleton'), { ssr: true });

function classNames(...classes: (string | boolean)[]) {
    return classes.filter(Boolean).join(' ');
}

export default function HeroSearch() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [destinations, setDestinations] = React.useState<DestinationData[]>([]);
    const router = useRouter();
    const [query, setQuery] = React.useState('');

    useEffect(() => {
        const fetchDestinations = async () => {
            const destinationsCollection = collection(firebase.db, "destinations");
            try {
                const querySnapshot = await getDocs(destinationsCollection);
                const allDestinations: DestinationData[] = [];
                querySnapshot.forEach((doc) => {
                    const destination = doc.data() as DestinationData;

                    // Log destination data to verify structure
                    console.log('Destination data:', destination);

                    allDestinations.push(destination);
                });
                setDestinations(allDestinations);
                setIsLoading(false);
            } catch (err) {
                setIsLoading(false);
                toast.error("Search has crashed");
                toast.info("Request rejected by server.");
            }
        };
        fetchDestinations().then(() => {});
    }, []);

    // Filter destinations and packages based on query
    const filteredResults = query === '' ? [] : destinations.flatMap((destination) => {
        const matchingPackages = destination.packages.filter(pkg =>
            pkg.name.toLowerCase().includes(query.toLowerCase())
        );
        const destinationMatches = destination.name?.toLowerCase().includes(query.toLowerCase());

        // Ensure destinationId is explicitly included
        return [
            ...(destinationMatches ? [{ type: 'destination', destinationId: destination.id, ...destination }] : []),
            ...matchingPackages.map(pkg => ({ type: 'package', destinationId: destination.id, ...pkg }))
        ];
    });

    const handleSelection = (item: any) => {
        setIsLoading(true);
        if (item === null) {
            setIsLoading(false);
            return;
        }

        // Ensure correct destinationId is used for routing
        if (item.type === 'destination') {
            router.push('/destination/' + item.destinationId);
        } else if (item.type === 'package') {
            router.push(`/destination/${item.destinationId}/package/${item.id}`);
        }
    };


    if (isLoading) {
        return <SpinnerFullScreen />;
    } else
        return (
            <section id={'hero-search'} className="relative overflow-hidden">
                <div className="relative z-10 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-24 md:mb-[150px] from-[4facfe] to-[#00f2fe]">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-6xl font-bold pb-12 lg:pb-10 text-white">
                            Find your <span className={'bg-clip-text text-transparent bg-gradient-to-bl from-[#FFE6FA] to-[#E3FDF5]'}>Best </span>
                            <span className={'bg-clip-text text-transparent bg-gradient-to-tr from-[#FFE6FA] to-[#E3FDF5]'}>Holiday Package. </span>
                        </h1>
                        <div className="mt-7 sm:mt-12 mx-auto max-w-xl relative">
                            {isLoading && !destinations ? <ParagraphSkeleton singleLine={true} />
                                :
                                <>
                                    <Combobox
                                        as="div"
                                        className={"z-10 bg-white rounded-2xl mx-auto max-w-xl relative"}
                                        onChange={(item) => handleSelection(item)}
                                    >
                                        <div className="relative">
                                            <CiSearch
                                                className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                            <ComboboxInput
                                                disabled={isLoading}
                                                className="h-12 rounded-lg w-full focus-visible:outline-0 border-0 bg-transparent pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:ring-0"
                                                placeholder="Search..."
                                                onChange={(event) => setQuery(event.target.value ? event.target.value.toLowerCase() : '')}
                                            />
                                        </div>

                                        {/* Display filtered results */}
                                        {filteredResults.length > 0 && (
                                            <div className="rounded-lg absolute w-full max-h-72 overflow-y-auto bg-white rounded-b-xl shadow-lg border border-gray-200 mt-1">
                                                <div className="py-3 text-sm text-gray-800">
                                                    {filteredResults.map((result, index) => (
                                                        <ComboboxOption
                                                            key={index}
                                                            value={result}
                                                            className={({ focus }: {focus: boolean}) =>
                                                                classNames(
                                                                    'flex justify-start cursor-default select-none px-4 py-2',
                                                                    focus && 'bg-stone-600 text-white'
                                                                )
                                                            }
                                                        >
                                                            {result.type === 'destination'
                                                                ? result.name
                                                                : `${result.name} (Package)`}
                                                        </ComboboxOption>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {query !== '' && filteredResults.length === 0 && (
                                            <p className="absolute inset-x-0 top-full p-4 text-sm text-white">No Results Found.</p>
                                        )}
                                    </Combobox>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </section>
        );
}


