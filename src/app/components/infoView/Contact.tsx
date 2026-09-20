import Image from "next/image";

const contactDetails = [
    {name: 'Collaborate', email: 'Packagefytours@gmail.com', telephone: '+91 (933) 672-4747'},
    {name: 'Press', email: 'Packagefytours@gmail.com', telephone: '+91 (933) 672-4747'},
    // { name: 'Join our team', email: 'support@example.com', telephone: '+1 (555) 123-4567' },
    // { name: 'Say hello', email: 'support@example.com', telephone: '+1 (555) 123-4567' },
]
const locations = [
    {city: 'Jhansi', address: ['Elite Square', 'Jhansi, UP 284001']},
    // { city: 'New York', address: ['886 Walter Streets', 'New York, NY 12345'] },
    // { city: 'Toronto', address: ['7363 Cynthia Pass', 'Toronto, ON N3Y 4H8'] },
    // { city: 'Chicago', address: ['726 Mavis Island', 'Chicago, IL 60601'] },
]

export default function Contact() {
    return (
        <div className="bg-white">
            <header className="relative pb-24 bg-sky-800 sm:pb-32">
                <div className="absolute inset-0 ">
                    <Image
                        className="w-full h-full object-cover"
                        src="https://images.pexels.com/photos/2300582/pexels-photo-2300582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt=""
                        fill={true}
                    />
                    <div
                        className="absolute inset-0 bg-gradient-to-l from-neutral-400 to-neutral-700 mix-blend-multiply"
                        aria-hidden="true"
                    />
                </div>

                <div
                    className=" relative mt-10 pt-10 max-w-md mx-auto px-4 sm:max-w-3xl sm:mt-32 sm:px-6 lg:max-w-7xl lg:px-8 ">
                    <h1 className=" text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Want something curated just for you?</h1>
                    <p className="mt-6 text-xl text-white max-w-3xl">
                        If you want something customized or special according to your unique needs,
                        just get in touch. We offer personalized services tailored to your preferences.

                    </p>
                </div>
            </header>

            <div>
                {/* Side-by-side grid */}
                <div className="bg-white">
                    <div className="max-w-md mx-auto py-24 px-4 sm:max-w-3xl sm:py-32 sm:px-6 lg:max-w-7xl lg:px-8">
                        <div className="divide-y divide-warm-gray-200">
                            <section className="lg:grid lg:grid-cols-3 lg:gap-8" aria-labelledby="contact-heading">
                                <h2 id="contact-heading"
                                    className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-l from-[#E3FDF5] to-[#3F5EFB] sm:text-3xl">
                                    Get in touch
                                </h2>
                                <div
                                    className="mt-8 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:mt-0 lg:col-span-2">
                                    {contactDetails.map((item) => (
                                        <div key={item.name}>
                                            <h3 className="text-lg font-medium text-warm-gray-900">{item.name}</h3>
                                            <dl className="mt-2 text-base text-warm-gray-500">
                                                <div>
                                                    <dt className="sr-only">Email</dt>
                                                    <dd>{item.email}</dd>
                                                </div>
                                                <div className="mt-1">
                                                    <dt className="sr-only">Phone number</dt>
                                                    <dd>{item.telephone}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    ))}
                                </div>
                            </section>
                            <section className="mt-16 pt-16 lg:grid lg:grid-cols-3 lg:gap-8"
                                     aria-labelledby="location-heading">
                                <h2 id="location-heading"
                                    className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-l from-[#E3FDF5] to-[#EF629F] sm:text-3xl">
                                    Locations
                                </h2>
                                <div
                                    className="mt-8 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:mt-0 lg:col-span-2">
                                    {locations.map((location) => (
                                        <div key={location.city}>
                                            <h3 className="text-lg font-medium text-warm-gray-900">{location.city}</h3>
                                            <div className="mt-2 text-base text-warm-gray-500 space-y-1">
                                                {location.address.map((line) => (
                                                    <p key={line}>{line}</p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
