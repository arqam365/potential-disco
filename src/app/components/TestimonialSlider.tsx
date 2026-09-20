"use client"
import React, {useEffect, useState} from "react";
import Slider from "react-slick";
import dynamic from "next/dynamic";
import {doc, getDoc} from "firebase/firestore";
import firebase from "../../../firebase.ts";
import {TestimonialFile} from "@/app/_utility/types";
import ParagraphSkeleton from "@/app/components/ParagraphSkeleton";

const Testimonial = dynamic(() => import("./Testimonial"));





const SimpleSlider: React.FC = () => {
    const [testimonialFileData, setTestimonialFileData] = useState<TestimonialFile>();
    const [isLoading, setIsLoading] = useState(true);
    const [isErr, setIsErr] = useState(false);

    useEffect(() => {
        try {
            const testimonialsFileRef = doc(firebase.db, "homepage", 'testimonials');
            getDoc(testimonialsFileRef).then((snapShot) => {
                const data = snapShot.data() as TestimonialFile;
                if (!data.entries || data.entries.length === 0) {
                    setIsErr(true);
                }
                setTestimonialFileData(data);
                setIsLoading(false);
            })
        } catch (err) {
            setIsErr(true);
        } finally {
            setIsLoading(false);
        }



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
    if (testimonialFileData) return (
        <section id={'testimonials'} className={'w-full '}>
            <Slider {...settings}>
                {testimonialFileData.entries.map((entry, i) => {
                    return (
                        <Testimonial name={entry.name} content={entry.content} authorPosition={entry.authorPosition}
                                     imageSrc={entry.imageSrc} key={i}/>
                    );
                })}
            </Slider>
        </section>
    );

    return (
        <>This is unexpected, Unable to Fetch Data.</>
    )



}


export default SimpleSlider;