import { S3Client } from "@aws-sdk/client-s3"

let _s3: S3Client | undefined

export function getS3() {
    if (!_s3) {
        _s3 = new S3Client({
            region: process.env.AWS_REGION ?? "us-east-2",
            endpoint: process.env.AWS_ENDPOINT_URL_S3,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
            forcePathStyle: true,
        })
    }
    return _s3
}

export const BUCKET = process.env.NEON_STORAGE_BUCKET ?? "uploads"
