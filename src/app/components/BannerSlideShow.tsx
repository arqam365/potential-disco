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
    {image: '/banners/dubai.jpg', href: '/destination/dubai'},
    {image: '/banners/maldives.jpg', href: '/destination/maldives'},
    {image: '/banners/thailand.jpg', href: '/destination/thailand'},
    {image: '/banners/vietnam.jpg', href: '/destination/vietnam'},
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
                                <Image
                                    src={data.image}
                                    alt="Banner"
                                    fill
                                    className="object-cover pointer-events-none"
                                    priority={i === 0}
                                    sizes="100vw"
                                />
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}
