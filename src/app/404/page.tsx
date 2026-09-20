export default function Err404() {
    return (
        <>

            <div className="grid w-screen h-screen items-center justify-center  bg-neutral-900">
                <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex-shrink-0 flex justify-center">
                        <a href="/public" className="inline-flex">
                            <span className="sr-only">Packagefy</span>
                            <img
                                className="h-16 w-auto"
                                src={'https://firebasestorage.googleapis.com/v0/b/packagefy.appspot.com/o/resources%2Fnewlogo.svg?alt=media&token=833503db-fc0a-4385-9779-58abdd059d78'}
                                alt="Packagefy"
                            />
                        </a>
                    </div>
                    <div className="py-16">
                        <div className="flex-col justify-center items-center text-center">
                            <p className="text-sm font-semibold text-red-500 uppercase tracking-wide">404 error</p>
                            <h1 className="mt-2 text-4xl font-extrabold text-white tracking-tight sm:text-5xl">Page
                                not found.</h1>
                            <p className="mt-2 text-base text-gray-300">Sorry, we couldn’t find the page you’re looking
                                for.</p>
                            <div className="mt-6">
                                <a href="/" className="text-base font-medium text-red-600 hover:text-red-500">
                                    Go back home<span aria-hidden="true"> &rarr;</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
