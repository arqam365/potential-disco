import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import { getDb } from "@/lib/db"
import { destinations } from "@/lib/db/schema"
import { asc } from "drizzle-orm"

export async function GET() {
    try {
        const db = getDb()
        const rows = await db.select().from(destinations).orderBy(asc(destinations.name))
        return NextResponse.json(rows)
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const session = getSessionCookie(request)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await request.json()
        const db = getDb()
        const [row] = await db.insert(destinations).values({
            id: body.id,
            name: body.name,
            description: body.description,
            coverImageUrl: body.coverImageUrl,
        }).returning()
        return NextResponse.json(row, { status: 201 })
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
