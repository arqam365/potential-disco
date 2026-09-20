'use client'

// import { usePathname } from 'next/navigation'

import logo from '../newlogo.svg'
import Image from "next/image";

// const activeCss:string = 'py-3 ps-px sm:px-3 font-medium text-blue-600'
// const inactiveCss:string = 'py-3 ps-px sm:px-3 font-medium text-white hover:text-gray-400'

// type navLinks = {
//     name: string,
//     href: string
// }

// const navLinks: navLinks[] = [
//     {name: "Locations", href: "/locations" },
//     {name: "Trips", href: "/trips" },
// ]

export default function Navbar() {
    // const pathname = usePathname()

    return (
        <header
            className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-transparent text-sm py-3 sm:py-0">
            <nav
                className="relative max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8"
                aria-label="Global">
                <div className="flex items-center justify-between">
                    <a className="flex-none text-xl font-semibold" href="/" aria-label="Brand">
                        <Image src={logo} alt={'logo'} height={40} width={120}/>
                    </a>
                    <div className="sm:hidden">

                    </div>
                </div>
                <div id="navbar-collapse-with-animation"
                     className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end sm:ps-7">
                        <a className="flex items-center gap-x-2 font-medium text-white hover:text-[#19A7CE]/70  py-2 sm:py-0 sm:ms-4 sm:my-6 sm:ps-6 bg-[rgba(255, 255, 255, 0.18)] backdrop-blur-sm lg:rounded-none lg:shadow-none lg:backdrop-blur-none"
                           href="tel:+91933672-4747">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0 6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z"/>
                            </svg>
                            +91 (933) 672-4747
                        </a>
                    </div>
                </div>
            </nav>
        </header>
    )
}

// todo: implement request a callback