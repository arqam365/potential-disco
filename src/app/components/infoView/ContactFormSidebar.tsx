"use client"

import React, {useState} from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { usePathname } from 'next/navigation'
import {toast} from "react-toastify";

const ChevronDownIcon = dynamic(() =>
    import('@heroicons/react/20/solid').then((mod) => mod.ChevronDownIcon))

type SidebarProps = {
    heading?: string,
    destinationId?:string,
    packageId?:string
    sidebar?: boolean
}

export default function ContactFormSidebar({destinationId, packageId, heading, sidebar}:SidebarProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [travellers, setTravellers] = useState(1);
    const [message, setMessage] = useState('');
    const [disableButton, setDisableButton] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)


    const pathname = usePathname();

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // since all fields are required, we are skipping check.
        // get current URL
        setIsProcessing(true);

        try {
            await axios.post('/api/create-sidebar-ticket', JSON.stringify({
                name, email, address, phone, travellers, message, pathname, destinationId, packageId
            }), {
                headers : {
                    "Content-Type": "application/json"
                }
            })
            toast.success("Ticket Confirmed. We will get back to ASAP.");
            setDisableButton(true)
        } catch (err) {
            toast.error("Server Error")
        } finally {
            setIsProcessing(false);
        }



    }



    return (
        <div id={'contactForm'} className={`isolate ${isProcessing ? 'opacity-50' : ''}  bg-white px-6  sm:py-32 ${sidebar ? 'lg:py-12' : ''} lg:px-8`}>
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    {heading ? heading : 'Get in Touch with our Travel experts.'}</h2>
            </div>
            <form onSubmit={async (e) => await handleFormSubmit(e)} className="mx-auto mt-8  max-w-xl ">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-2">
                    <div className={'col-span-2'}>
                        <label htmlFor="name" className="block text-sm font-semibold leading-6 text-gray-900">
                            Your name
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="text"
                                name="name"
                                value={name}
                                required
                                id="name"
                                disabled={disableButton}
                                autoComplete="name"
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#008DDA] sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
                            Email
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                disabled={disableButton}
                                value={email}
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#008DDA] sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="address" className="block text-sm font-semibold leading-6 text-gray-900">
                            Address
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="text"
                                name="address"
                                id="address"
                                required
                                disabled={disableButton}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                autoComplete="address-level1"
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#008DDA] sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-900">
                            Phone number
                        </label>
                        <div className="relative mt-2.5">
                            <div className="absolute inset-y-0 left-0 flex items-center">
                                <label htmlFor="country" className="sr-only">
                                    Country
                                </label>
                                <select
                                    id="country"
                                    name="country"
                                    className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#008DDA] sm:text-sm"
                                >
                                    <option>IN</option>
                                    {/*<option>CA</option>*/}
                                    {/*<option>EU</option>*/}
                                </select>
                                <ChevronDownIcon
                                    className="pointer-events-none absolute right-3 top-0 h-full w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </div>
                            <input
                                type="tel"
                                name="phone-number"
                                id="phone-number"
                                autoComplete="tel"
                                required
                                disabled={disableButton}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                minLength={10}
                                className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#008DDA] sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label htmlFor="no-of-travellers"
                               className="block text-sm font-semibold leading-6 text-gray-900">
                            Number of travellers
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="number"
                                required
                                min={1}
                                disabled={disableButton}
                                value={travellers}
                                onChange={(e) => setTravellers(Number(e.target.value))}
                                name="no-of-travellers"
                                id="no-of-travellers"
                                autoComplete="off"
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#008DDA] sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
                            Message
                        </label>
                        <div className="mt-2.5">
              <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={message}
                  disabled={disableButton}
                  onChange={(e) => setMessage(e.target.value)}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#008DDA] sm:text-sm sm:leading-6"
                  defaultValue={message}
              />
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <button
                        type="submit"
                        disabled={disableButton}
                        className="block disabled:bg-opacity-50 w-full rounded-md bg-[#008DDA] px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#40A2E3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#40A2E3]"
                    >
                        {isProcessing ? 'Please wait...' : 'SEND ME DETAILS'}
                    </button>
                </div>
            </form>
        </div>
    )
}
