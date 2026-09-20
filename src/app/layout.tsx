import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import {SpeedInsights} from "@vercel/speed-insights/next"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./customSlickTheme.css"
import dynamic from "next/dynamic";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import { Analytics } from "@vercel/analytics/react"
const PrelineScript = dynamic(() => import('./components/PrelineScript'))
import Script from "next/script";

const inter = Inter({subsets: ["latin"]});


export const metadata: Metadata = {
    title: "Packagefy - Find your best holiday package.",
    description: "Solution for all your travel needs. We make travel better and easier for people of India. Follow us on Facebook, LinkedIn, and Instagram for the latest updates.",
    icons: {
        icon: '/favicon.ico',
    },

    applicationName : 'Packagefy.com Website',
    openGraph : {
        title: 'Packagefy - Find your best holiday package.',
        description: "Solution for all your travel needs. We make travel better and easier for people of India.",
        images: '/og-image.jpg',
        type: 'website',
        siteName: 'Packagefy'
    },
    twitter : {
        title: 'Packagefy - Find your best holiday package.',
        card: 'summary_large_image',
        description: "Solution for all your travel needs. We make travel better and easier for people of India.",
        images: '/og-image.jpg',
        creator: 'packagefy',
        creatorId: 'packagefy',
    },
    robots: {follow: true, index: true},

};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <html lang="en">

        <Script src="https://www.googletagmanager.com/gtag/js?l=dataLayer&amp;id=G-4L0BZGV7V7" async></Script>

        <SpeedInsights/>
        <Analytics />

        <body className={inter.className}>
        <ToastContainer/>

        {children}
        <PrelineScript/>

        </body>
        </html>

    );
}
