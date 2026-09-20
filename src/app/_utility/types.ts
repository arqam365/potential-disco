export interface Package {
    id: string
    name: string
    coverImageUrl: string
    coverImageFilename: string,
    coverImageBase64:string,
    originalPrice: number
    discountedPrice: number
    description: string
    duration: string,
    pickupAndDropLocation: string,
    reviews: PackageReview[];
    itinerary:
        {
            id: string,
            heading: string,
            description: string,
        }[] | []
    inclusions: string[] | []
    exclusions: string[] | []
}

export interface DestinationData {
    id: string,
    name: string,
    description: string,
    coverImageUrl: string,
    coverImageBase64:string
    coverImageFilename: string,
    packages: Package[] | [],
    created: Date,
    modified: Date,
    version: number,
    modificationInfo: {
        createdBy: string,
        lastModifiedBy: string
    }
}

export interface PackageReview {
    id: string,
    name: string,
    title: string,
    content: string,
    stars: number,
    postDate: string,
}

export interface TrendingPackageShowcaseData {
    destinationId: string,
    packageId: string,
    addTimestamp: Date,
}

export interface PackageShowcaseDataFile {
    entries : TrendingPackageShowcaseData[]
}

export interface TestimonialData {
    imageSrc: string
    name: string
    content: string
    authorPosition: string
}

export interface TestimonialFile {
    entries: TestimonialData[]
}

export interface searchEntry {
    destinationId: string,
    id: string,
    destinationName: string,
}

export interface searchListDocument {
    entries: searchEntry[];
}
