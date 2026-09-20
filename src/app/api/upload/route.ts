import { NextRequest, NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getS3, BUCKET } from "@/lib/storage"
import { getSessionCookie } from "better-auth/cookies"

export async function POST(request: NextRequest) {
    const session = getSessionCookie(request)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const ext = file.name.split(".").pop()
    const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    await getS3().send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
    }))

    return NextResponse.json({ url: `/api/image?key=${encodeURIComponent(key)}` })
}
