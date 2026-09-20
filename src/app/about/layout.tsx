import type {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "About us",
    description:
        "solution for all your travel needs. We make travel better and easier for people of India. Packagefy ideally caters " +
        "to a diverse range of customers to maximize its market reach and appeal." +
        "This includes:  Leisure Travelers, Business Travelers, Adventure Seekers, Budget-conscious Travelers Offering affordable options, Honeymooners, Educational Student tours.",
    icons: {
        icon: '/favicon.ico',
    },
    applicationName : 'Packagefy.com Website',
    openGraph : {
        title: 'About us',
        description:
            "solution for all your travel needs. We make travel better and easier for people of India. Packagefy ideally caters " +
            "to a diverse range of customers to maximize its market reach and appeal." +
            "This includes:  Leisure Travelers, Business Travelers, Adventure Seekers, Budget-conscious Travelers Offering affordable options, Honeymooners, Educational Student tours.",
        images: '/og-image.jpg',
        type: 'website',
        siteName: 'Packagefy'
    },
    twitter : {
        title: 'About us - Packagefy',
        card: 'summary_large_image',
        description:
            "solution for all your travel needs. We make travel better and easier for people of India. Packagefy ideally caters " +
            "to a diverse range of customers to maximize its market reach and appeal." +
            "This includes:  Leisure Travelers, Business Travelers, Adventure Seekers, Budget-conscious Travelers Offering affordable options, Honeymooners, Educational Student tours.",
        images: '/og-image.jpg',
        creator: 'packagefy',
        creatorId: 'packagefy',
    },
    authors : [{name: 'Raj Dwivedi', url: 'https://rajdwivedi.space'}],
    robots: {follow: true, index: true},

};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section id={'about-page'}>{children}</section>

    );
}
