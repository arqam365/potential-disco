import React from "react";
import {Package} from "@/app/_utility/types";

type PricingComponents = {
    packageData: Package
}

export default function PricingComponent({packageData}: PricingComponents) {
    return (
        <div>
            <div className="border-b border-gray-200 pb-5">
                <h3 className="leading-6 font-bold text-2xl text-gray-900">Details</h3>
            </div>
            <p>
                <h3 className="text-lg text-gray-800 pt-5 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                         className="size-6 mr-3">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>

                    {packageData.duration}</h3>
                <span
                    className="text-[#008DDA] text-2xl font-bold pr-1 mt-3 ">₹ {packageData.discountedPrice}</span>
                <span
                    className="text-gray-500 font-medium text-lg line-through mt-3">₹ {packageData.originalPrice} </span>
                <span
                    className="ml-1 text-neutral-700 font-sans text-sm mt-3 ">Per person</span>
            </p>
        </div>
    )
}