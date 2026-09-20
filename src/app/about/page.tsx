"use client"
import Footer from "@/app/components/Footer";
import React from "react";
import Spinner from "@/app/components/FullScreenSpinner";
import {useRouter} from "next/navigation";
import { LiaBikingSolid } from "react-icons/lia";
import { LuPlane } from "react-icons/lu";
import {IoBriefcaseOutline, IoHeartOutline} from "react-icons/io5";
import Image from "next/image";

const About1 = () => {

    const router = useRouter();

    return (
        <React.Suspense fallback={<Spinner />}>
            <>
                <main>
                    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                        {/*HERO*/}
                        <section>

                            <div
                                className="relative overflow-hidden before:absolute before:top-0 before:start-1/2 before:bg-[url('https://preline.co/assets/svg/examples/squared-bg-element.svg')] before:bg-no-repeat before:bg-top before:size-full before:-z-[1] before:transform before:-translate-x-1/2">
                                <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">


                                    <div onClick={() => router.push('/')}  className="mt-5 max-w-xl text-center mx-auto">
                                        <h1 className="block font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl ">
                                            Packagefy.com
                                        </h1>
                                    </div>


                                    <div className="mt-5 max-w-3xl text-center mx-auto">
                                        <p className="text-lg text-gray-600"> Find your best Holiday Package.</p>
                                    </div>

                                </div>
                            </div>

                        </section>

                        {/*INTRO*/}
                        <section className="overflow-hidden pt-20 pb-12 lg:pt-[120px] lg:pb-[90px] bg-white">
                            <div className="container mx-auto">
                                <div className="flex flex-wrap items-center justify-between -mx-4">
                                    <div className="w-full px-4 lg:w-6/12">
                                        <div className="flex items-center -mx-3 sm:-mx-4">
                                            <div className="w-full px-3 sm:px-4 xl:w-1/2">
                                                <div className="py-3 sm:py-4">
                                                    {/* You can add an image of your suspension product here */}
                                                    <Image
                                                        src={"https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/about%20us%20content%2FGroup%20image%20vertical%202.jpg?alt=media&token=2d4a7604-137d-444d-ad86-b573d6923524"}
                                                        objectFit={'cover'}
                                                        width={1000}
                                                        height={1000}
                                                        alt="Trip Image"
                                                        className="w-full rounded-2xl"
                                                    />
                                                </div>
                                                <div className="py-3 sm:py-4">
                                                    {/* You can add a video showcasing your product here */}
                                                    <Image
                                                        src="https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/about%20us%20content%2Fimage%203.jpg?alt=media&token=7e3f38bf-d048-4612-b5d0-bb340492e90d"
                                                        className="w-full rounded-2xl"
                                                        alt={"Trip image"}
                                                        objectFit={'cover'}
                                                        width={1000}
                                                        height={1000}
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-full px-3 sm:px-4 xl:w-1/2">
                                                <div className="relative z-10 my-4">
                                                    {/* You can add another image or illustration here */}
                                                    <Image
                                                        src="https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/about%20us%20content%2FGroup%20Image%20vertical%201.jpg?alt=media&token=0b1f3278-bda6-4c98-b1da-cd73d8d6042d"
                                                        className="w-full rounded-2xl"
                                                        alt={"Trip image"}
                                                        objectFit={'cover'}
                                                        width={1000}
                                                        height={1000}
                                                    />
                                                    {/* Decorative circles */}
                                                    <span className="absolute -right-7 -bottom-7 z-[-1]">
                                            {/* SVG decorative circles */}
                                        </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full px-10  lg:w-1/2 xl:w-5/12">
                                        <div className="mt-10 lg:mt-0">
                                <span className="block mb-4 text-lg font-semibold text-primary">
                                    Welcome to Packagefy
                                </span>
                                            <h2 className="mb-5 text-3xl font-bold text-dark sm:text-[40px]/[48px]">
                                                Explore with us!
                                            </h2>
                                            <p className="mb-5 text-base text-body-color ">
                                                Your gateway to unforgettable travel experiences.
                                                At Packagefy, we take pride in being your one-stop solution for all your travel needs. We make travel better and easier for people of India.
                                                Packagefy ideally caters to a diverse range of customers to maximize its market reach and appeal.
                                                This includes:  Leisure Travelers, Business Travelers, Adventure Seekers, Budget-conscious Travelers Offering affordable options, Honeymooners, Educational Student tours.
                                            </p>
                                            {/* Add your content section below */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>


                        {/*Features*/}
                        <section>

                            <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                                <div className="aspect-w-16 aspect-h-7">
                                    <Image className="w-full object-cover rounded-xl"
                                         src="https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/about%20us%20content%2FSlideshow%2FBig%20Group%20image.jpg?alt=media&token=8c8d1321-013c-40de-bbbc-acfe2ab1c8c4"
                                         alt={"Trip image"}
                                         objectFit={'cover'}
                                         width={1000}
                                         height={1000}
                                    />
                                </div>


                                <div className="mt-5 lg:mt-16 grid lg:grid-cols-3 gap-8 lg:gap-12">
                                    <div className="lg:col-span-1">
                                        <h2 className="font-bold text-2xl md:text-3xl text-gray-800">
                                            More than Just Travel
                                        </h2>
                                        <p className="mt-2 md:mt-4 text-gray-500">
                                            Our services go beyond traditional travel. We offer tailored experiences
                                            that blend luxury with practicality, ensuring every journey is exceptional.
                                            From personalized itineraries to exclusive accommodations, we craft
                                            memorable travel experiences that cater to your every need.
                                        </p>
                                    </div>


                                    <div className="lg:col-span-2">
                                        <div className="grid sm:grid-cols-2 gap-8 md:gap-12">

                                            <div className="flex gap-x-5">
                                                <IoHeartOutline size={90}/>
                                                <div className="grow">
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        Honeymoon Trip
                                                    </h3>
                                                    <p className="mt-1 text-gray-600">
                                                        Celebrate your love with our specially curated honeymoon
                                                        packages. Experience luxurious stays and romantic getaways
                                                        designed to make your first trip as a married couple
                                                        unforgettable.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-x-5">
                                                <LuPlane size={100}/>
                                                <div className="grow">
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        Group Departure
                                                    </h3>
                                                    <p className="mt-1 text-gray-600">
                                                        Enjoy seamless travel with our group departure services. Ideal
                                                        for families, friends, or corporate teams, our packages ensure a
                                                        smooth and enjoyable journey for everyone involved.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-x-5">
                                                <LiaBikingSolid size={100} height={60} width={60}/>
                                                <div className="grow">
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        Bike Trips
                                                    </h3>
                                                    <p className="mt-1 text-gray-600">
                                                        Explore scenic routes and adventurous terrains with our bike
                                                        trip packages. Perfect for cycling enthusiasts and those looking
                                                        for a thrilling outdoor experience.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-x-5">
                                                <IoBriefcaseOutline size={100} height={60} width={60}/>
                                                <div className="grow">
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        Corporate Trips
                                                    </h3>
                                                    <p className="mt-1 text-gray-600">
                                                        Optimize your corporate travel with our tailored business trip
                                                        solutions. We handle all logistics to ensure your meetings and
                                                        events are efficient and productive.
                                                    </p>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </section>

                        {/*TEAM */}
                        <Team />

                        {/*    CTA*/}
                        <section>

                            <div className="bg-white ">
                                <div
                                    className="lg:flex lg:items-center lg:justify-between w-full mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 z-20">
                                    <h2 className="text-3xl font-extrabold text-black sm:text-4xl">
            <span className="block">
                Don&apos;t believe us yet ?
            </span>
                                        <span className="block text-stone-400">
                See the Packages yourself.
            </span>
                                    </h2>
                                    <div className="lg:mt-0 lg:flex-shrink-0">
                                        <div className=" inline-flex rounded-md shadow">
                                            <button type="button"
                                                    onClick={() => router.push('/')}
                                                    className="py-4 px-6  bg-neutral-600 hover:bg-neutral-700 focus:ring-neutral-500 focus:ring-offset-neutral-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                                Explore!
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </section>


                    </div>
                </main>
                <Footer/>

            </>
        </React.Suspense>
    );
};

export default About1;


const people = [
    {
        name: 'Sajid Khan',
        role: 'Founder',
        imageUrl:
            'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/about%20us%20content%2Fteam%20images%2Fsajid%20founder.jpg?alt=media&token=3fb5f23f-22c5-4416-94f9-fb67bc33d7b4',
        // twitterUrl: '#',
        linkedinUrl: 'https://www.linkedin.com/in/mohd-sajid-691540167/',
    },
    {
        name: 'Abdul Shadab',
        role: 'Co Founder',
        imageUrl:
            'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/about%20us%20content%2Fteam%20images%2Fabdul%20Shadab%20co%20founder.jpg?alt=media&token=44ee4e8e-91b4-48a1-944f-154a4fcd018c',
        // twitterUrl: '#',
        // linkedinUrl: '#',
    },
    {
        name: 'Vivek Pandey',
        role: 'Human Resources Head',
        imageUrl:
            'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/about%20us%20content%2Fteam%20images%2FVivek%20HR%20Head.JPG?alt=media&token=035c5beb-a6f5-44f6-b447-4462b9e5127a',
        // twitterUrl: '#',
        // linkedinUrl: '#',
    },
    {
        name: 'Mohd. Irfan',
        role: 'Chief customer officer',
        imageUrl:
            'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/about%20us%20content%2Fteam%20images%2Fmohd.%20irfan%2C%20chief%20customer%20officer.jpg?alt=media&token=c441fb74-8e33-47ae-bd9d-0e4fcd1465dc',
        // twitterUrl: '#',
        // linkedinUrl: '#',
    },

    {
        name: 'Mayank Prasad',
        role: 'Head of Content',
        imageUrl:
            'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/about%20us%20content%2Fteam%20images%2Fmayank%20head%20of%20content.jpg?alt=media&token=3f1de345-1677-49bd-b2fb-2e0b344f389d',
        // twitterUrl: '#',
        // linkedinUrl: '#',
    },

    {
        name: 'Irfan khan',
        role: 'Head of Operations',
        imageUrl:
            'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/about%20us%20content%2Fteam%20images%2Firfan%20khan%20Head%20of%20operations.JPG?alt=media&token=82705dd5-796f-406f-b9ed-f5e5aade3e9a',
        // twitterUrl: '#',
        // linkedinUrl: '#',
    },
    {
        name: 'Raj Dwivedi',
        role: 'Lead Developer',
        imageUrl:
            'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/about%20us%20content%2Fteam%20images%2F20231230_103904.jpg?alt=media&token=d9042298-7c38-4ce4-8ca8-b20f9660c990',
        // twitterUrl: '#',
        linkedinUrl: 'https://www.linkedin.com/in/badenforcer/',
    },

    {
        name: 'Arqam Ahmad Siddiqui',
        role: 'QA Head',
        imageUrl:
            'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/about%20us%20content%2Fteam%20images%2Farqam%20QA.png?alt=media&token=75da6ce2-663b-49ff-a96a-feb6435e0e2d',
        // twitterUrl: '#',
        linkedinUrl: 'https://www.linkedin.com/in/arqam365/',
    },



    // More people...
]

function Team() {
    return (
        <div id={'team-info'} className="bg-white">
            <div className="max-w-7xl mx-auto py-12 px-4 text-center sm:px-6 lg:px-8 lg:py-24">
                <div className="space-y-12">
                    <div className="space-y-5 sm:mx-auto sm:max-w-xl sm:space-y-4 lg:max-w-5xl">
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Meet our team</h2>
                        {/*<p className="text-xl text-gray-500">*/}
                        {/*    Ornare sagittis, suspendisse in hendrerit quis. Sed dui aliquet lectus sit pretium egestas vel mattis*/}
                        {/*    neque.*/}
                        {/*</p>*/}
                    </div>
                    <ul
                        role="list"
                        className="mx-auto space-y-16 sm:grid sm:grid-cols-2 sm:gap-16 sm:space-y-0 lg:grid-cols-4 lg:max-w-7xl"
                    >
                        {people.map((person) => (
                            <li key={person.name}>
                                <div className="space-y-6">
                                    <div className="relative mx-auto w-40 h-40 xl:w-56 xl:h-56">
                                        <Image
                                            className="rounded-full object-cover"
                                            src={person.imageUrl}
                                            layout="fill"
                                            alt={person.name}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-lg leading-6 font-medium space-y-1">
                                            <h3>{person.name}</h3>
                                            <p className="text-indigo-600">{person.role}</p>
                                        </div>
                                        <ul role="list" className="flex justify-center space-x-5">

                                            {/*DISABLED DUE TO ERROR. also Only enable if at least 1 url is in the object.
                                             else build will fail*/}

                                            {/*{person?.twitterUrl ? (*/}
                                            {/*    <li>*/}
                                            {/*        <a*/}
                                            {/*            href={person?.twitterUrl}*/}
                                            {/*            className="text-gray-400 hover:text-gray-500"*/}
                                            {/*        >*/}
                                            {/*            <span className="sr-only">Twitter</span>*/}
                                            {/*            <svg*/}
                                            {/*                className="w-5 h-5"*/}
                                            {/*                aria-hidden="true"*/}
                                            {/*                fill="currentColor"*/}
                                            {/*                viewBox="0 0 20 20"*/}
                                            {/*            >*/}
                                            {/*                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />*/}
                                            {/*            </svg>*/}
                                            {/*        </a>*/}
                                            {/*    </li>*/}
                                            {/*) : null}*/}

                                            {person?.linkedinUrl ? (
                                                <li>
                                                    <a
                                                        href={person.linkedinUrl}
                                                        className="text-gray-400 hover:text-gray-500"
                                                    >
                                                        <span className="sr-only">LinkedIn</span>
                                                        <svg
                                                            className="w-5 h-5"
                                                            aria-hidden="true"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </a>
                                                </li>
                                            ) : null}
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
