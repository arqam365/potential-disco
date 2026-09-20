import { NextRequest, NextResponse } from "next/server"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { getS3, BUCKET } from "@/lib/storage"

export async function GET(request: NextRequest) {
    const key = request.nextUrl.searchParams.get("key")
    if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 })

    const url = await getSignedUrl(
        getS3(),
        new GetObjectCommand({ Bucket: BUCKET, Key: key }),
        { expiresIn: 3600 }
    )

    return NextResponse.redirect(url, { status: 302 })
}
