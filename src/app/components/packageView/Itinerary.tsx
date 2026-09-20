import DOMPurify from 'dompurify';

type ItineraryProps = {
    itinerary: {
        id: string,
        heading: string,
        description: string,
    }[]
}



export default function Itinerary({itinerary}: ItineraryProps) {

    const createMarkup = (htmlContent:string) => {
        return { __html: DOMPurify.sanitize(htmlContent) };
    };

    return (
        <div>
            <div className="pb-5 border-b border-gray-200 mb-8">
                <h3 className="leading-6 font-bold text-2xl text-gray-900">Itinerary</h3>
            </div>
            <ul role="list" className="space-y-6 lg:space-y-12">
                {itinerary.map((section, i) => (
                    <li key={i} className="shadow hover:outline hover:outline-[1px] hover:outline-[#40A2E3] hover:scale-[101%] overflow-hidden rounded-lg">
                        <div className="bg-gradient-to-l to-[#146C94] from-[#19A7CE] px-4 py-5 border-b border-gray-200 flex items-center justify-center rounded-t-lg">
                            <h3 className="text-md leading-6 font-bold lg:text-2xl text-white">{section.heading}</h3>
                        </div>

                        {/* Content */}
                        <div className="list-disc pt-3 text-sm sm:text-md md:text-lg px-6 py-4 bg-[#F6F1F1]/20 rounded-b-2xl" dangerouslySetInnerHTML={createMarkup(section.description)} />
                    </li>
                ))}
            </ul>
        </div>

    )
}
