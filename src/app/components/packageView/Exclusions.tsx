type ExclusionProps = {
    exclusions: string[]
}

export default function Exclusions({exclusions}: ExclusionProps) {
    return (
        <section id={'exclusions'}>
            <div className="pb-5 border-b border-gray-200 mb-8">
                <h3 className="font-bold text-2xl leading-6 text-gray-900">Exclusions</h3>
            </div>
            <div className="flow-root">
                <ul role="list" className="-mb-8">
                    {exclusions.map((exclusion, index) => (
                        <li key={index}>
                            <div className="relative pb-8">
                                {index !== exclusions.length - 1 ? (
                                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                          aria-hidden="true"/>
                                ) : null}
                                <div className="relative flex space-x-3">
                                    <div>
                  <span
                      className={'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-red-600'}
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                           stroke="currentColor" className="h-5 w-5 text-white">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
</svg>

                  </span>
                                    </div>
                                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                        <div>
                                            <p className="text-sm text-black">
                                                {exclusion}{' '}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>

    )
}
