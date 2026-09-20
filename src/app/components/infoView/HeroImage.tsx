
import {Transition, TransitionChild} from "@headlessui/react";
import React, {Fragment} from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import localFont from "next/font/local";

const rogthem = localFont({src: 'fonts/Rogthem.ttf'})

const Navbar = dynamic(() => import ('../Navbar'))



type SectionProps = {
    name: string,
    coverImageUrl: string,
    base64: string,
}



export default function HeroSection({name, coverImageUrl, base64}: SectionProps) {

    return (
        <section id={'hero'} className={'overflow-hidden'}>
            <Transition as={Fragment} show appear>
                <div className={'relative h-[50vh] lg:h-[80vh] w-screen'}>

                    <TransitionChild as={Fragment} enter={'transition-all duration-500'}
                                     enterFrom={'opacity-100 scale-150'}
                                     enterTo={'opacity-100 scale-100'}>
                        <Image
                            src={coverImageUrl}
                            alt="Background"
                            fill
                            objectFit="cover"
                            objectPosition="center"
                            priority // Optional: prioritize loading the image
                            placeholder={'blur'}
                            blurDataURL={base64}

                        />
                    </TransitionChild>
                    <TransitionChild as={Fragment} enter={'transition-all delay-500 duration-100'}
                                     enterFrom={'opacity-0'} enterTo={'opacity-100'}>
                        <div className="absolute inset-0 bg-black opacity-25 z-20"></div>
                    </TransitionChild>
                    <div className="relative z-30"><Navbar/></div>
                    {/* Heading */}

                    <div className="flex items-center  justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                        <div className={'lg:px-40 absolute inset-0 flex items-center justify-center z-30 bottom-[30%] lg:bottom-[40%] pointer-events-none'}>
                            <TransitionChild as={Fragment} enter={'transition-all duration-1000'}
                                             enterFrom={'opacity-0 scale-120 text-white'}
                                             enterTo={'opacity-100 scale-100'}
                                             leave={'transition-all duration-300'} leaveFrom={'opacity-100 scale-100'}
                                             leaveTo={'opacity-100 scale-75'}>
                                <h1 className={`${rogthem.className} text-center break-words flex w-full items-center justify-center text-[13vw] sm:text-[12vw] lg:text-[8vw] bg-clip-text text-transparent bg-gradient-to-tr from-[#FFE6FA] to-[#E3FDF5] `}>
                                    {name}
                                </h1>
                            </TransitionChild>
                        </div>
                    </div>

                </div>
            </Transition>
        </section>
    )
}