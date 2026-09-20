import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import { getDb } from "@/lib/db"
import { testimonials } from "@/lib/db/schema"

export async function GET() {
    try {
        const db = getDb()
        const rows = await db.select().from(testimonials)
        return NextResponse.json(rows)
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const session = getSessionCookie(request)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { imageSrc, name, content, authorPosition } = await request.json()
        const db = getDb()
        const [row] = await db.insert(testimonials).values({ imageSrc, name, content, authorPosition }).returning()
        return NextResponse.json(row, { status: 201 })
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
