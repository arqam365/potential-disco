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
    {src: 'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/SlidingGrids%2Fdubai.jpg?alt=media&token=7949700e-3c5f-476c-ad9e-bcf5addd5c54',
        alt: 'Dubai', title: 'Dubai', link: '/destination/dubai'},


    {src: 'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/SlidingGrids%2Fthiland.jpg?alt=media&token=a8e66ef7-7009-41bf-9354-4cd8abb04954',
        alt: 'Thailand',
        title: 'Thailand',
        link: '/destination/thailand'},


    {src: 'https://images.unsplash.com/photo-1528127269322-539801943592',
        alt: 'Vietnam',
        title: 'Vietnam',
        link: '/destination/vietnam'},

    {src: 'https://images.pexels.com/photos/11807186/pexels-photo-11807186.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Maldives', title: 'Maldives', link: '/destination/maldives'},

    {src: 'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/SlidingGrids%2Fbali.jpg?alt=media&token=a13b58e7-f5f8-4296-a58c-d8af727a48df',
        alt: 'Bali', title: 'Bali', link: '/destination/bali'},



    {src: 'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/SlidingGrids%2Fbhutan.jpg?alt=media&token=eb6083b5-f591-4c19-a01c-a6b88edeed0a',
        alt: 'Bhutan', title: 'Bhutan', link: '/destination/bhutan'},

    {src: 'https://images.pexels.com/photos/22804/pexels-photo.jpg?cs=srgb&dl=pexels-umaraffan499-22804.jpg&fm=jpg&w=1920&h=1280&_gl=1*1dmdfp1*_ga*NDk5ODIxODA4LjE3MjMyNjY0OTc.*_ga_8JE65Q40S6*MTcyMzI3MjI1MS4yLjEuMTcyMzI3MjgyMC4wLjAuMA..',
        alt: 'Malaysia', title: 'Malaysia', link: '/destination/malaysia'},

    {src: 'https://images.pexels.com/photos/1029188/pexels-photo-1029188.jpeg?cs=srgb&dl=pexels-alaric-sim-380461-1029188.jpg&fm=jpg&w=1920&h=1260&_gl=1*802eay*_ga*NDk5ODIxODA4LjE3MjMyNjY0OTc.*_ga_8JE65Q40S6*MTcyMzI3MjI1MS4yLjEuMTcyMzI3MjUxMi4wLjAuMA..',
        alt: 'Singapore', title: 'Singapore', link: '/destination/singapore'},

    {src: 'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/SlidingGrids%2Fazerbijan.jpg?alt=media&token=5712f5ed-27f4-41e6-9568-3ea4e4cde6a2',
        alt: 'Azerbaizan', title: 'Azerbaizan', link: '/destination/azerbaizan'},



    // DOMESTIC
    // BIG IMAGE 2 (index 9)
    {src: 'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/SlidingGrids%2Fkerala.jpg?alt=media&token=1f93f0a6-9d91-41b1-94a7-bd8600abe200',
        alt: 'Kerala', title: 'Kerala', link: '/destination/kerala'},


    {src: 'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/SlidingGrids%2FHimachal.jpg?alt=media&token=c33a63a7-95c1-4ae4-936d-df67b5111d3c',
        alt: 'Himachal Pradesh ', title: 'Himachal Pradesh ', link: '/destination/himachalpradesh'},

    {src: 'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/SlidingGrids%2Fgoa.jpg?alt=media&token=8b3b1bd8-5b4c-4762-82c8-15b8e3280df6',
        alt: 'Goa', title: 'Goa', link: '/destination/goa'},


    {src: 'https://images.pexels.com/photos/25527013/pexels-photo-25527013.jpeg?cs=srgb&dl=pexels-pth686817-25527013.jpg&fm=jpg&w=1280&h=960&_gl=1*g8euip*_ga*NDk5ODIxODA4LjE3MjMyNjY0OTc.*_ga_8JE65Q40S6*MTcyMzI2NjQ5Ni4xLjEuMTcyMzI2NjU4NS4wLjAuMA..',
        alt: 'Meghalaya ', title: 'Meghalaya', link: '/destination/meghalaya'},

    {src: 'https://images.pexels.com/photos/7084186/pexels-photo-7084186.jpeg?cs=srgb&dl=pexels-lachlan-ross-7084186.jpg&fm=jpg&w=1920&h=1280&_gl=1*15c66so*_ga*NDk5ODIxODA4LjE3MjMyNjY0OTc.*_ga_8JE65Q40S6*MTcyMzI2NjQ5Ni4xLjEuMTcyMzI2Njc1Mi4wLjAuMA..',
        alt: 'Andaman', title: 'Andaman', link: '/destination/andaman'},

    {src: 'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/SlidingGrids%2FJammu%20%26%20Kashmir.jpg?alt=media&token=c05c5f29-0016-4667-9034-31fff8bf43bc',
        alt: 'Jammu & Kashmir ', title: 'Kashmir ', link: '/destination/kashmir'},

    {src: 'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/SlidingGrids%2Futtarakhand.jpg?alt=media&token=3a99a9b8-42ed-4de3-a876-d84d1c6562a1',
        alt: 'Uttrakhand', title: 'Uttrakhand', link: '/destination/uttrakhand'},
    {
        src: 'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/SlidingGrids%2Frajasthan.jpg?alt=media&token=117aa3f6-7262-4ced-8f8f-94e97c846104',
        alt: 'Rajasthan',
        title: 'Rajasthan',
        link: '/destination/rajasthan'
    },
    {src: 'https://images.pexels.com/photos/1107717/pexels-photo-1107717.jpeg?cs=srgb&dl=pexels-fotios-photos-1107717.jpg&fm=jpg&w=1920&h=1280&_gl=1*1pnhway*_ga*NDk5ODIxODA4LjE3MjMyNjY0OTc.*_ga_8JE65Q40S6*MTcyMzI2NjQ5Ni4xLjEuMTcyMzI2NzA5NS4wLjAuMA..',
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
