"use client"
import React, {useEffect} from "react";

import dynamic from "next/dynamic";
// import SpinnerFullScreen from "@/app/components/FullScreenSpinner";
// import ParagraphSkeleton from "@/app/components/ParagraphSkeleton";
import {doc, getDoc} from "firebase/firestore";
import firebase from "../../../../firebase.ts";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {Package, DestinationData} from "@/app/_utility/types";
// import Err404 from "@/app/404/page";
// import LoadingSpinner from "@/app/components/LoadingSpinner";


const LoadingSpinner = dynamic(() => import('@/app/components/LoadingSpinner'), {ssr: true})
const SpinnerFullScreen = dynamic(() => import('@/app/components/FullScreenSpinner'), {ssr: true})
const ParagraphSkeleton = dynamic(() => import("@/app/components/ParagraphSkeleton"), {ssr: true})
const Err404 = dynamic(() => import('@/app/404/page'), {ssr: true})


const HeroImage = dynamic(() => import('@/app/components/infoView/HeroImage'), {ssr: true})
const Description = dynamic(() => import('@/app/components/infoView/Description'), {
    loading: () => {
        return <ParagraphSkeleton/>
    }, ssr:true
})
const PackageCard = dynamic(() => import('@/app/components/infoView/PackageCard'), {
    loading: () => (<ParagraphSkeleton/>)

})
const ContactFormSidebar = dynamic(() => import('@/app/components/infoView/ContactFormSidebar'), {
    loading: () => (<LoadingSpinner/>)
})


const Contact = dynamic(() => import('@/app/components/infoView/Contact'), {loading: () => (<LoadingSpinner/>)})
const Footer = dynamic(() => import('@/app/components/Footer'), {ssr:true})

export default function Page({params}: { params: { destinationId: string } }) {

    const [destinationData, setDestinationData] = React.useState<DestinationData>()
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchDestinationData = async () => {
            const docRef = doc(firebase.db, "destinations", params.destinationId);
            try {
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    console.log('document does not exist')
                    setError(true);
                    return;
                }

                setDestinationData(docSnap.data() as DestinationData);
                console.log(destinationData)
            } catch (err) {
                toast.error('Server Error. CODE 500');
            } finally {
                setLoading(false);
            }
        };

        fetchDestinationData().then(_ => {
        });
    }, [destinationData, params.destinationId, router]);

    if (loading) {
        return <SpinnerFullScreen/>;
    }

    if (error) return <Err404/>

    if (destinationData !== undefined) return (<div id={'displayContainer'} className={'w-full h-full'}>
            <HeroImage base64={destinationData.coverImageBase64} name={destinationData.name}
                       coverImageUrl={destinationData.coverImageUrl}/>

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Description name={destinationData.name as string} data={destinationData.description}/>

            {destinationData?.packages?.length ? <div className="py-6">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-8">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="container mx-auto sm:px-6 lg:px-8">
                                <PackageShowcase destinationId={params.destinationId}
                                                 data={destinationData.packages}/>
                            </div>
                        </div>
                    </div>


                    <div className="hidden lg:block lg:col-span-4">
                        <nav aria-label="Sidebar" className="sticky top-6 divide-y divide-gray-300">
                            <ContactFormSidebar/>
                        </nav>
                    </div>
                </div>
            </div> : <><ContactFormSidebar destinationId={destinationData.id}/></>}

            <div className={'lg:hidden'}>
                {destinationData?.packages?.length ?  <ContactFormSidebar destinationId={destinationData.id}/> : <></>}

            </div>

        </div>
        <Contact/>
        {/*<NewsLetter/>*/}
        <Footer/>
    </div>)

    return (<>Fatal Error. Make a Report</>)


}


type packageShowcaseProps = {
    data: Package[]
    destinationId: string,
}

const PackageShowcase: React.FC<packageShowcaseProps> = ({data, destinationId}) => {

    if (data.length === 0) return (<></>)

    return (<section id={'packages'}>
            {data.map((packageData, index) => {
                return (<div key={index} className={'mt-12'}>
                        <ul role="list" className="space-y-3 mt-10">
                            <PackageCard key={index} packageInfo={packageData} destinationId={destinationId} />
                        </ul>
                    </div>)
            })}
        </section>)
}




