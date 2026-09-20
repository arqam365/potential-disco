import React, {useCallback, useEffect, useState} from "react";
import { doc, getDoc, runTransaction } from "firebase/firestore";
import firebase from "../../../firebase.ts";
import { DestinationData, Package, PackageShowcaseDataFile } from "@/app/_utility/types";
import Image from 'next/image';

import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel'
import { DotButton, useDotButton } from '@/app/components/embla/EmblaCaraouselDotButton'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from '@/app/components/embla/EmblaCaraouselArrowButtons'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import './embla/embla.css'
import Link from "next/link";

interface PackageProps {
    coverImageUrl: string,
    duration: string,
    packageDestination: string,
    blurDataURL: string,
    destinationId: string,
    packageId: string,
}

const OPTIONS: EmblaOptionsType = { loop: true, dragFree:true , slidesToScroll: 1, align:"center" }


const PackageComponent: React.FC<PackageProps> = ({blurDataURL, coverImageUrl, duration, packageDestination, destinationId, packageId }) => {
    return(
        <Link href={`/destination/${destinationId}/package/${packageId}`} className="mt-1">
            <div className="relative ml-2 mr-2 group block rounded-lg bg-gray-100 overflow-hidden">
                <div className="relative w-full pb-[70%] md:pb-[80%] lg:pb-[100%]"> {/* 1:1 aspect ratio */}
                    <Image
                        src={coverImageUrl}
                        alt={packageDestination}
                        placeholder={'blur'}
                        blurDataURL={blurDataURL}
                        layout="fill"
                        objectFit="cover"
                        className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                </div>
                <div className="lg:block flex items-center absolute bottom-0 right-0 mb-2 mr-2 bg-black bg-opacity-70 text-white p-1 sm:p-2 rounded-lg z-10 lg:px-2 lg:py-1 text-xs sm:text-sm md:text-base lg:text-sm">
                    {duration}
                </div>
                <button type="button" className="absolute inset-0 focus:outline-none">
                    <span className="sr-only">View details for {packageDestination}</span>
                </button>
            </div>
            <p className="lg:block mt-2 text-center text-md sm:text-md md:text-lg lg:text-xl font-normal text-gray-900">
                {packageDestination}
            </p>
        </Link>
    );
};

interface UpdatedPackage extends Package {
    destinationName: string,
    parentDestinationId: string,
}

const SimpleSlider: React.FC = () => {
    const [packagesData, setPackagesData] = useState<UpdatedPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS, [Autoplay()])


    const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
        const autoplay = emblaApi?.plugins()?.autoplay
        if (!autoplay) return

        const resetOrStop =
            autoplay.options.stopOnInteraction === false
                ? autoplay.reset
                : autoplay.stop

        resetOrStop()
    }, [])

    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
        emblaApi,
        onNavButtonClick
    )

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi, onNavButtonClick)





    useEffect(() => {
        const fetchData = async () => {
            const trendingPackagesDocRef = doc(firebase.db, "homepage", "trendingPackages");

            try {
                await runTransaction(firebase.db, async (transaction) => {
                    const docSnapshot = await getDoc(trendingPackagesDocRef);

                    if (!docSnapshot.exists()) {
                        setPackagesData([]);
                        setLoading(false);
                        return;
                    }

                    const data = docSnapshot.data() as PackageShowcaseDataFile;

                    if (!data || !data.entries || data.entries.length === 0) {
                        setPackagesData([]);
                        setLoading(false);
                        return;
                    }

                    const pkgDataReferences: UpdatedPackage[] = [];

                    await Promise.all(
                        data.entries.map(async (pkgData) => {
                            const pkgDestinationRef = doc(firebase.db, "destinations", pkgData.destinationId);
                            const pkgDestinationSnapShot = await transaction.get(pkgDestinationRef);
                            const pkgDestinationData = pkgDestinationSnapShot.data() as DestinationData;

                            const filteredPkg = pkgDestinationData.packages.find((pkg) => pkg.id === pkgData.packageId);
                            if (filteredPkg) {
                                pkgDataReferences.push({...filteredPkg, destinationName: pkgDestinationData.name, parentDestinationId: pkgDestinationData.id} as UpdatedPackage);
                            }
                        })
                    );

                    setPackagesData(pkgDataReferences);
                    setLoading(false);
                });
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(true);
                setLoading(false);
            }
        };

        fetchData().then();
    }, []);

    return (
        <>
            <section id={`trending-dest`}>
                <div className="pb-20 flex w-full items-center justify-center mt-8 lg:mt-20 lg:mb-10">
                    <h1 className="font-bold text-lg md:text-2xl lg:text-4xl">
                        Hot & <span className="bg-clip-text text-[#008DDA]">Trending</span> <span>Destinations</span>
                    </h1>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <section className="embla lg:scale-[140%] ">
                        <div className="embla__viewport" ref={emblaRef}>
                            <div className="lg:mt-8 embla__container">
                                {packagesData.map((SlideDataElement, index) => (
                                    <div className="embla__slide" key={index}>
                                        {/*<div className="embla__slide__number">{index + 1}</div>*/}
                                        <PackageComponent destinationId={SlideDataElement.parentDestinationId} packageId={SlideDataElement.id}  blurDataURL={SlideDataElement.coverImageBase64} packageDestination={SlideDataElement.name} duration={SlideDataElement.duration} coverImageUrl={SlideDataElement.coverImageUrl} />

                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="embla__controls">
                            <div className="embla__buttons">
                                <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled}/>
                                <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled}/>
                            </div>

                            <div className="embla__dots">
                                {scrollSnaps.map((_, index) => (
                                    <DotButton
                                        key={index}
                                        onClick={() => onDotButtonClick(index)}
                                        className={'embla__dot'.concat(
                                            index === selectedIndex ? ' embla__dot--selected' : ''
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </section>
        </>
    );
}


export default SimpleSlider;
