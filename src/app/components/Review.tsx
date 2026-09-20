function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

type ReviewProps = {
    id: string,
    name: string,
    title: string,
    content: string,
    stars: number,
    postDate: string,
}

export default function Review({id, name, title, content, stars, postDate}:ReviewProps) {
    return (
        <div key={id} className="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8">
                            <div
                                className="lg:col-start-5 lg:col-span-8 xl:col-start-4 xl:col-span-9 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:items-start">
                                <div className="flex items-center xl:col-span-1">
                                    <div className="flex items-center">
                                        {[0, 1, 2, 3, 4].map((rating) => (
                                            <svg key={rating} className={classNames(
                                                stars > rating ? 'text-yellow-400' : 'text-gray-200',
                                                'h-5 w-5 flex-shrink-0'
                                            )} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1.5} stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/>
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="ml-3 text-sm text-gray-700">
                                        {stars}
                                        <span className="sr-only"> out of 5 stars</span>
                                    </p>
                                </div>

                                <div className="mt-4 lg:mt-6 xl:mt-0 xl:col-span-2">
                                    <h3 className="text-sm font-medium text-gray-900">{title}</h3>

                                    <div
                                        className="mt-3 space-y-6 text-sm text-gray-500"
                                        dangerouslySetInnerHTML={{__html: content}}
                                    />
                                </div>
                            </div>

                            <div
                                className="mt-6 flex items-center text-sm lg:mt-0 lg:col-start-1 lg:col-span-4 lg:row-start-1 lg:flex-col lg:items-start xl:col-span-3">
                                <p className="font-medium text-gray-900">{name}</p>
                                <time
                                    dateTime={postDate}
                                    className="ml-4 border-l border-gray-200 pl-4 text-gray-500 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0"
                                >
                                    {postDate}
                                </time>
                            </div>
                        </div>
    )
}
