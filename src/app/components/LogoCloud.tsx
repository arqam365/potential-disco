import React from "react";
import Image from "next/image";


export default function LogoCloud() {
    return (
        <section id={'recognition-and-collaboration'} className="bg-white">
            <div className="pb-8 flex w-full items-center justify-center mt-8 lg:mt-20 lg:mb-10">
                <h1 className="font-bold text-lg md:text-2xl lg:text-4xl tracking-wider">
                    Recognition &  <span
                    className="bg-clip-text text-transparent bg-gradient-to-l from-[#2B32B2] to-[#1488CC]">Collaborations</span>
                </h1>
            </div>
            <div className="max-w-[90rem] mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="place-content-evenly mt-6 grid grid-cols-2 gap-0.5 md:grid-cols-3 md:mt-8 content-center items-center">
                    <div className="relative col-span-1 flex justify-center py-2 px-8">
                        <Image
                            className="max-h-40 scale-125 md:max-h-60 lg:scale-100"
                            width={1000}
                            height={1000}
                            src="/placeholder-logo.png"
                            alt="Rise Jhansi"
                        />
                    </div>
                    {/*<div className="col-span-1 flex justify-center py-2 px-2 content-center items-center">*/}
                    {/*    <Image className="max-h-40 scale-125 md:max-h-60 lg:scale-75"*/}
                    {/*           width={1800}*/}
                    {/*           height={1425}*/}
                    {/*           src="https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/msme_logo.png?alt=media&token=aa2a00dc-5b4f-4f69-bb74-91ae2b8234a6"*/}
                    {/*           alt="MSME logo"/>*/}
                    {/*</div>*/}
                    <div className="col-span-1 flex justify-center py-8 px-8 content-center items-center">
                        <Image className="max-h-40 scale-125 lg:max-h-60 lg:scale-90"
                               width={404}
                               height={316}
                               src="/placeholder-logo.png"
                               alt="Up Tourism"/>
                    </div>
                    <div className="col-span-1 flex justify-center py-8 px-8 content-center items-center">
                        <Image className="max-h-40 scale-125 md:max-h-32 lg:scale-100"
                               width={521}
                               height={150}
                               src="/placeholder-logo.png"
                               alt="Startup India logo"/>
                    </div>


                    <div className="col-span-1 flex justify-center py-8 px-8 content-center items-center">
                        <img className="max-h-40 scale-125 md:max-h-32 lg:scale-100"
                             width={521}
                             height={150}
                             src="/placeholder-logo.png"
                             alt="MP Tourism Logo"/>
                    </div>

                    <div className="col-span-2 flex justify-center py-8 px-2 content-center items-center">
                        <img className="max-h-40 scale-80 md:max-h-60 lg:scale-75"
                             width={1000}
                             height={750}
                            // fill={true} objectFit={'cover'}
                               src="/placeholder-logo.png"
                             alt="Incredible India Logo"/>
                    </div>

                </div>
            </div>
        </section>
    )
}
