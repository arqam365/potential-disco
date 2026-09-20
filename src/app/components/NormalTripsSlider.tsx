"use client"
import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";


type ShowcaseEntries = {
    title: string
    imageSrc: string
    duration: string
    href: string
}


interface SimpleSliderProps {
    heading1: string
    heading2: string
    heading3?: string
    entries: ShowcaseEntries[];
    rtl?: boolean

}


const SimpleSlider: React.FC<SimpleSliderProps> = ({heading1, heading2, heading3, entries, rtl}) => {
    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "60px",
        speed: 200,
        autoplaySpeed: 6000,
        autoplay: true,
        pauseOnHover: true,
        swipeToSlide: true,
        focusOnSelect: true,
        rtl: rtl || false,
        // dots: true,
        // useCSS: true,
        responsive: [
            //all
            {
                breakpoint: 0,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    arrows: false
                }
            },

            // sm
            {
                breakpoint: 636,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    arrows: false
                }
            },
            // md
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    arrows: false
                }
            },
            // lg
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                }
            },
            // xl
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                }
            },
            {
                breakpoint: 2400,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                }

            }

        ]
    };


    return (
        <section id={`${heading1.trim()+heading2.trim()}${heading3 || ''}`.trim().replace(' ', '')}>
            <div className="pb-8 flex w-full items-center justify-center mt-8 lg:mt-20 lg:mb-10">
                <h1 className="font-bold text-lg md:text-2xl lg:text-4xl">
                    {heading1} <span
                    className="bg-clip-text text-transparent bg-gradient-to-l from-[#2B32B2] to-[#1488CC]">{heading2}</span>
                    <span>{heading3}</span>
                </h1>
            </div>
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 ">
                <Slider {...settings}>
                    {entries.map((entry, i) => (
                        <div className="mt-1" key={i}>
                            <Link href={entry.href} className="relative ml-2 mr-2 group block rounded-lg bg-gray-100 overflow-hidden">
                                <div className="relative w-full"
                                     onClick={(e) => {}}
                                     style={{paddingBottom: '100%'}}> {/* 1:1 aspect ratio */}
                                    <Image
                                        src={entry.imageSrc}
                                        alt={entry.title}
                                        layout="fill"
                                        objectFit="cover"
                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                    />
                                </div>
                                <div
                                    className="hidden lg:block flex items-center absolute bottom-0 right-0 mb-2 mr-2 bg-black bg-opacity-50 text-white p-1 sm:p-2 rounded-lg z-10 text-xs sm:text-sm md:text-base lg:text-lg">
                                    {entry.title}
                                </div>
                                <button type="button" className="absolute inset-0 focus:outline-none">
                                    <span className="sr-only">View details for {entry.title}</span>
                                </button>
                            </Link>
                            <p className=" lg:hidden mt-2 text-center text-md sm:text-md md:text-lg lg:text-xl font-medium text-gray-900">
                                {entry.title}
                            </p>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>


    );

}


export default SimpleSlider;