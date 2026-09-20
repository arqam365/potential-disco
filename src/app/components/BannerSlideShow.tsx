"use client"

import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import { useRouter } from 'next/navigation';

type bannerData = {
    image: string,
    href: string,
};

const bannerImages: bannerData[] = [
    {image: 'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/banners%2FDubai.png?alt=media&token=f105e607-ee4e-4a07-b013-30826f3a94ab', href: '/destination/dubai'},
    {image: 'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/banners%2FMaldives.png?alt=media&token=790fa951-4161-433c-8d41-511572e6fc92', href: '/destination/maldives'},
    {image: 'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/banners%2FThiland.png?alt=media&token=0329fb88-1101-4803-a22d-41b1162fc877', href: '/destination/thailand'},
    {image: 'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/banners%2FVietnam.png?alt=media&token=2b769003-cc34-4224-bbac-7148c4f328c7', href: '/destination/vietnam'},
];

export default function BannerSlideShow() {
    const router = useRouter();

    const settings = {
        centerMode: false,
        infinite: true,
        centerPadding: "60px",
        speed: 100,
        autoplaySpeed: 6000,
        autoplay: true,
        pauseOnHover: true,
        swipeToSlide: true,
        dots: true,
        slidesToScroll: 1,
        slidesToShow: 1,
        responsive : [
            {
                breakpoint: 0,
                settings: {
                    arrows: false
                }
            },
            // md
            {
                breakpoint: 768,
                settings: {

                    arrows: false
                }
            },
            // lg
            {
                breakpoint: 1024,
                settings: {
                    arrows: true
                }
            },
        ]
    };

    const handleRedirect = (href: string) => {
        router.push(href)
    };

    return (
        <div className="mb-10 lg:my-16">
            <div className="max-w-[90rem] w-full mx-auto px-4 sm:px-6 lg:px-8">
                <Slider {...settings}>
                    {bannerImages.map((data, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-center h-screen max-h-[25vh] sm:max-h-[26vh] md:max-h-[50vh] lg:max-h-[60vh]"
                            onClick={() => handleRedirect(data.href)}
                        >
                            <div className="relative flex items-center justify-center w-full h-full cursor-pointer">
                                <img
                                    src={data.image}
                                    alt="Banner"
                                    className="object-cover h-full pointer-events-none group-hover:opacity-75"
                                />
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}
