"use client"
import React from "react";
import Slider from "react-slick";
import dynamic from "next/dynamic";
const Review = dynamic(() => import("@/app/components/Review"));
import {PackageReview} from "@/app/_utility/types";

interface SliderProps {
    reviews: PackageReview[]
}

const ReviewSlider: React.FC<SliderProps> = ({reviews}) => {
    const settings = {
        infinite: true,
        fade: true,
        adaptiveHeight: true,
        speed: 1000,
        autoplaySpeed: 7000,
        autoplay: true,
        pauseOnHover: true,
        swipeToSlide: true,
        focusOnSelect: false,
        arrows: false,
        dots: true,
        slidesToScroll: 1,
        slidesToShow: 1,
        useCSS: true,
    };

    if (!reviews) {
        return <></>
    }


    return (
        <section id={'testimonials'} className={'w-full'}>
            <div className="bg-white">
                <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                    <h2 className="text-lg font-medium text-gray-900">Recent reviews</h2>
                    <div className="mt-6 pb-10 border-t border-b border-gray-200 divide-y divide-gray-200 space-y-10">
                        <Slider {...settings}>
                            {reviews.reduce((acc, _, i, arr) => {
                                if (i % 2 === 0) {
                                    acc.push(
                                        <div key={i} className="flex flex-col lg:flex-row gap-4">
                                            <Review
                                                id={arr[i].id}
                                                name={arr[i].name}
                                                content={arr[i].content}
                                                postDate={arr[i].postDate}
                                                stars={arr[i].stars}
                                                title={arr[i].title}
                                            />
                                            {arr[i + 1] && (
                                                <Review
                                                    id={arr[i + 1].id}
                                                    name={arr[i + 1].name}
                                                    content={arr[i + 1].content}
                                                    postDate={arr[i + 1].postDate}
                                                    stars={arr[i + 1].stars}
                                                    title={arr[i + 1].title}
                                                />
                                            )}
                                        </div>
                                    );
                                }
                                return acc;
                            }, [] as JSX.Element[])}
                        </Slider>
                    </div>
                </div>
            </div>
        </section>


);

}


export default ReviewSlider;