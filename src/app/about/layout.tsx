import type {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "About us",
    description:
        "solution for all your travel needs. We make travel better and easier for people of India. Packagefy ideally caters " +
        "to a diverse range of customers to maximize its market reach and appeal." +
        "This includes:  Leisure Travelers, Business Travelers, Adventure Seekers, Budget-conscious Travelers Offering affordable options, Honeymooners, Educational Student tours.",
    icons: {
        icon: 'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/resources%2Fnewlogo.svg?alt=media&token=833503db-fc0a-4385-9779-58abdd059d78',
    },
    applicationName : 'Packagefy.com Website',
    openGraph : {
        title: 'About us',
        description:
            "solution for all your travel needs. We make travel better and easier for people of India. Packagefy ideally caters " +
            "to a diverse range of customers to maximize its market reach and appeal." +
            "This includes:  Leisure Travelers, Business Travelers, Adventure Seekers, Budget-conscious Travelers Offering affordable options, Honeymooners, Educational Student tours.",
        images: 'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/resources%2Fbgblacklogo.png?alt=media&token=ab89b1ba-1e66-48a4-93a6-f2cc7a40beb1',
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
        images: 'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/resources%2Fbgblacklogo.png?alt=media&token=ab89b1ba-1e66-48a4-93a6-f2cc7a40beb1',
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
