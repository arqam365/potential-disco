import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import { getDb } from "@/lib/db"
import { searchEntries } from "@/lib/db/schema"
import { ilike } from "drizzle-orm"

export async function GET(request: NextRequest) {
    try {
        const q = request.nextUrl.searchParams.get("q")
        const db = getDb()
        const rows = q
            ? await db.select().from(searchEntries).where(ilike(searchEntries.destinationName, `%${q}%`))
            : await db.select().from(searchEntries)
        return NextResponse.json(rows)
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const session = getSessionCookie(request)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { id, destinationId, destinationName } = await request.json()
        const db = getDb()
        const [row] = await db.insert(searchEntries).values({ id, destinationId, destinationName }).returning()
        return NextResponse.json(row, { status: 201 })
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
