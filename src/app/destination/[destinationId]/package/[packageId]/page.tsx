"use client"
import dynamic from "next/dynamic";
import React, {useEffect} from "react";
// import SpinnerFullScreen from "@/app/components/FullScreenSpinner";
// import ParagraphSkeleton from "@/app/components/ParagraphSkeleton";
import {doc, getDoc} from "firebase/firestore";
import firebase from "../../../../../../firebase.ts";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
// import Err404 from "@/app/404/page";
import HeroImage from '@/app/components/infoView/HeroImage'

// import Exclusions from "@/app/components/packageView/Exclusions";
// import Inclusions from "@/app/components/packageView/Inclusions";
// import Itinerary from "@/app/components/packageView/Itinerary";

import {Package, DestinationData} from "@/app/_utility/types";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import PricingComponent from "@/app/destination/[destinationId]/package/[packageId]/PricingComponents";


const Err404 = dynamic(() => import("@/app/404/page"), {ssr:true})
const ParagraphSkeleton = dynamic(() => import("@/app/components/FullScreenSpinner"), {ssr:true})
const SpinnerFullScreen = dynamic(() => import("@/app/components/ParagraphSkeleton"), {ssr:true})


const Itinerary = dynamic(() => import("@/app/components/packageView/Itinerary"), {ssr:true})
const Inclusions = dynamic(() => import("@/app/components/packageView/Inclusions"), {ssr:true})
const Exclusions = dynamic(() => import("@/app/components/packageView/Exclusions"), {ssr:false})


const ReviewSlider = dynamic(() => import('@/app/components/packageView/ReviewsSlider'),
    {
        ssr: false,
    }
    )


const Description = dynamic(() => import('@/app/components/infoView/Description'),
    {
        loading: () => {
            return <ParagraphSkeleton/>
        }, ssr:true
    })


const ContactFormSidebar = dynamic(() => import('@/app/components/infoView/ContactFormSidebar'))
const Contact = dynamic(() => import('@/app/components/infoView/Contact'), {loading: () => (<LoadingSpinner/>)})
const Footer = dynamic(() => import('@/app/components/Footer'), {ssr:true})


export default function Page({params}: { params: { destinationId: string, packageId: string } }) {
    const [destinationData, setDestinationData] = React.useState<DestinationData>();
    const [packageData, setPackageData] = React.useState<Package>();
    const [error, setError] = React.useState<boolean>(false); // true on error 404
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();

    useEffect(() => {

        const fetchDestinationData = async () => {

            const docRef = doc(firebase.db, "destinations", params.destinationId); // firebase doc ref

            try {
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) { // check existence
                    console.log('document does not exist')
                    setError(true);
                    return;
                }

                setDestinationData(docSnap.data() as DestinationData);

                // filter
                const fetchedPackage = (docSnap.data() as DestinationData).packages.filter((pkg) => pkg.id === params.packageId)
                if (fetchedPackage.length === 0) {
                    setLoading(false)
                    setError(true);
                }

                setPackageData(fetchedPackage[0]);

                setLoading(false); // remove loading screen

            } catch (err) {
                toast.error('Server Error. CODE 500'); // handle unexpected errors
            } finally {
                setLoading(false);
            }
        };

        fetchDestinationData().then(_ => {}); // use async function in callback
    }, [params.destinationId, params.packageId, router]);


    // show loading screen
    if (loading) return <SpinnerFullScreen/>;


    if (error) return <Err404 />


    if (destinationData && packageData) {
        return (
            <div id={'displayContainer'} className={'w-full h-full'}>
                <HeroImage base64={packageData.coverImageBase64} name={packageData.name} coverImageUrl={packageData.coverImageUrl}/>

                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="lg:col-span-8">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="container mx-auto sm:px-6 lg:px-8">
                                <div className={'grid gap-y-20'}>
                                    <Description isPackage={true} name={packageData.name} data={packageData.description}/>
                                </div>

                            </div>
                        </div>
                    </div>




                    {destinationData?.packages?.length
                        ?
                        <div className="py-6">
                            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                                <div className="lg:col-span-8">
                                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                                        <div className="container mx-auto sm:px-6 lg:px-8">
                                            <div className={'grid gap-y-20'}>
                                                <Itinerary itinerary={packageData.itinerary}/>
                                                <Inclusions inclusions={packageData.inclusions}/>
                                                <Exclusions exclusions={packageData.exclusions}/>
                                            </div>

                                        </div>
                                    </div>
                                </div>


                                <div className="hidden lg:block lg:col-span-4">
                                    <PricingComponent packageData={packageData}/>
                                    <nav aria-label="Sidebar" className="sticky top-6 divide-y divide-gray-300">
                                        <ContactFormSidebar sidebar={true} heading={'Book Now!'}
                                                            destinationId={destinationData.id}
                                                            packageId={packageData.id}/>


                                    </nav>
                                </div>
                            </div>
                        </div>
                        :
                        <><ContactFormSidebar/></>
                    }
                    <div className={'lg:hidden mt-20 mb-8'}>
                        <ContactFormSidebar destinationId={destinationData.id}/>
                    </div>


                </div>
                {packageData.reviews.length !== 0 ?
                    <ReviewSlider reviews={packageData.reviews}/>
                    :
                    <></>}

                {/*<Review />*/}
                <Contact/>
                {/*<NewsLetter/>*/}
                <Footer/>
            </div>
        )
    }

    // This line should not run in any case.
    return (
        <>Fatal Error. Please report to developer. Loading state was skipped when viewing package..</>
    )

}
