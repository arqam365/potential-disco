"use client"

import React, {useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import SpinnerFullScreen from "@/app/components/FullScreenSpinner.tsx";

interface ImageGridProps {
    src: string;
    alt: string;
    title: string;
    link: string;
}

// 18 items
const content: ImageGridProps[] = [

    // INTERNATIONAL
    // BIG IMAGE 1 (index 0)
    {src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
        alt: 'Dubai', title: 'Dubai', link: '/destination/dubai'},

    {src: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80',
        alt: 'Thailand', title: 'Thailand', link: '/destination/thailand'},

    {src: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80',
        alt: 'Vietnam', title: 'Vietnam', link: '/destination/vietnam'},

    {src: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&q=80',
        alt: 'Maldives', title: 'Maldives', link: '/destination/maldives'},

    {src: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
        alt: 'Bali', title: 'Bali', link: '/destination/bali'},

    {src: 'https://images.unsplash.com/photo-1553856622-d1b352e9a211?w=1200&q=80',
        alt: 'Bhutan', title: 'Bhutan', link: '/destination/bhutan'},

    {src: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&q=80',
        alt: 'Malaysia', title: 'Malaysia', link: '/destination/malaysia'},

    {src: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80',
        alt: 'Singapore', title: 'Singapore', link: '/destination/singapore'},

    {src: 'https://images.unsplash.com/photo-1580274455191-1c62238fa1c2?w=1200&q=80',
        alt: 'Azerbaijan', title: 'Azerbaijan', link: '/destination/azerbaizan'},

    // DOMESTIC
    // BIG IMAGE 2 (index 9)
    {src: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80',
        alt: 'Kerala', title: 'Kerala', link: '/destination/kerala'},

    {src: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&q=80',
        alt: 'Himachal Pradesh', title: 'Himachal Pradesh', link: '/destination/himachalpradesh'},

    {src: 'https://images.unsplash.com/photo-1587922546307-776227941871?w=1200&q=80',
        alt: 'Goa', title: 'Goa', link: '/destination/goa'},

    {src: 'https://images.unsplash.com/photo-1506461883276-594a12b5bca3?w=1200&q=80',
        alt: 'Meghalaya', title: 'Meghalaya', link: '/destination/meghalaya'},

    {src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
        alt: 'Andaman', title: 'Andaman', link: '/destination/andaman'},

    {src: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80',
        alt: 'Jammu & Kashmir', title: 'Kashmir', link: '/destination/kashmir'},

    {src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
        alt: 'Uttrakhand', title: 'Uttrakhand', link: '/destination/uttrakhand'},

    {src: 'https://images.unsplash.com/photo-1477587458883-47145ed31fd0?w=1200&q=80',
        alt: 'Rajasthan', title: 'Rajasthan', link: '/destination/rajasthan'},

    {src: 'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=1200&q=80',
        alt: 'North East', title: 'North East', link: '/destination/northeast'},
]


function getRandomItems<T>(array: T[], count: number): T[] {
    // Create a copy of the array to avoid mutating the original array
    const shuffled = array.slice().sort(() => 0.5 - Math.random());
    // Return the first `count` items from the shuffled array
    return shuffled.slice(0, count);
}

const ImageGrid: React.FC = () => {
    const router = useRouter();
    const [mobileItems, setMobileItems] = useState<ImageGridProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true)
        setMobileItems(getRandomItems(content, 10))
        setLoading(false)
    }, []);

    if (loading) return <SpinnerFullScreen />;

    else
    return (
        <section id={'showcase-grid'} className={'max-w-[90rem] lg:pb-14 mx-auto'}>
            <div className={'flex w-full items-center justify-center mt-8 lg:mt-14 lg:mb-10'}>
                <h1 className={'font-bold text-2xl lg:text-4xl'}>Best Trips Across <span className={'text-[#008DDA]'}>The Globe</span>
                </h1>
            </div>


            {/*  md and below ONLY RENDERS 14 ITEMS  */}
            <div className="lg:hidden mx-6 mt-10">
                <div className="grid gap-6">
                    {mobileItems.map((item, index) => (
                        <a key={index} className="relative row-span-1" href={item.link}>
                            <Image src={item.src} alt={item.alt} width={2000} height={2000}
                                   layout="responsive" className="rounded-2xl object-cover"/>
                            <p className="absolute left-8 bottom-6 text-white font-bold text-2xl">{item.title}</p>
                        </a>
                    ))}
                </div>
            </div>

            {/*DESKTOP AND ABOVE*/}
            <div className="hidden lg:block px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                    {
                        content.slice(0, 18).map((item, index) => {
                            let isDoubleSize = index === 0 || index === 9; // First and seventh items are double-sized.
                            let additionalClasses = "";
                            let wrapperStyle = {};
                            if (index === 0) {
                                additionalClasses = "col-span-3 sm:col-span-2 row-span-2";
                                wrapperStyle = {maxWidth: '100%', aspectRatio: '16 / 10'}; // Adjust for big image
                            } else if (index === 9) {
                                additionalClasses = "col-span-3 sm:col-span-2 row-span-2 sm:col-start-5 sm:row-start-3";
                                wrapperStyle = {maxWidth: '100%', aspectRatio: '16 / 10'}; // Adjust for big image
                            } else {
                                wrapperStyle = {maxWidth: '100%', aspectRatio: '16 / 9'}; // Adjust for small image
                            }
                            return (
                                <div
                                    key={index}
                                    className={`group flex items-center justify-center text-white relative ${additionalClasses}`}
                                    onClick={() => router.push(item.link)}
                                >
                                    <div style={wrapperStyle} className="w-full h-full relative cursor-pointer">
                                        <Image
                                            src={item.src}
                                            alt={item.alt}
                                            fill={true}
                                            style={{
                                                filter: 'blur(0.3px)' ,
                                                imageRendering: '-webkit-optimize-contrast'}} // Subtle blur to reduce artifacts
                                            objectFit="cover"
                                            className="rounded-lg group-hover:scale-[100%]"
                                        />
                                    </div>
                                    <span
                                        className={`absolute bottom-2 left-4 ${isDoubleSize ? "text-3xl mb-2 font-medium font-sans" : "font-medium font-sans text-lg"}`}
                                    >
          {item.title}
        </span>
                                </div>
                            );
                        })
                    }
                </div>
            </div>


        </section>
    )
}

export default ImageGrid;
