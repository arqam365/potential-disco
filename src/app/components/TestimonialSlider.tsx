"use client"
import React, {useEffect, useState} from "react";
import Slider from "react-slick";
import dynamic from "next/dynamic";
import ParagraphSkeleton from "@/app/components/ParagraphSkeleton";

const Testimonial = dynamic(() => import("./Testimonial"));



type Testimonial = { id: string; imageSrc: string; name: string; content: string; authorPosition: string };

const SimpleSlider: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isErr, setIsErr] = useState(false);

    useEffect(() => {
        fetch("/api/testimonials")
            .then((res) => res.json())
            .then((data: Testimonial[]) => {
                if (!data || data.length === 0) setIsErr(true);
                setTestimonials(data);
                setIsLoading(false);
            })
            .catch(() => {
                setIsErr(true);
                setIsLoading(false);
            });
    }, []);


    const settings = {
        infinite: true,
        fade: true,
        adaptiveHeight: true,
        speed: 1000,
        autoplaySpeed: 7000,
        autoplay: true,
        pauseOnHover: false,
        swipeToSlide: false,
        focusOnSelect: false,
        arrows: false,
        dots: true,
        slidesToScroll: 1,
        slidesToShow: 1,
        useCSS: true,
    };

    if (isLoading) return (<ParagraphSkeleton />)
    if (isErr) return (<> Warning! Testimonials Not detected.</>)
    if (testimonials.length > 0) return (
        <section id={'testimonials'} className={'w-full '}>
            <Slider {...settings}>
                {testimonials.map((entry, i) => (
                    <Testimonial name={entry.name} content={entry.content} authorPosition={entry.authorPosition}
                                 imageSrc={entry.imageSrc} key={i}/>
                ))}
            </Slider>
        </section>
    );

    return (
        <>This is unexpected, Unable to Fetch Data.</>
    )



}


export default SimpleSlider;