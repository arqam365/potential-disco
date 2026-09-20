import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import { getDb } from "@/lib/db"
import { trendingPackages, packages, destinations } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function GET() {
    try {
        const db = getDb()
        const rows = await db
            .select({
                trending: trendingPackages,
                package: packages,
                destination: destinations,
            })
            .from(trendingPackages)
            .innerJoin(packages, eq(trendingPackages.packageId, packages.id))
            .innerJoin(destinations, eq(trendingPackages.destinationId, destinations.id))
        return NextResponse.json(rows)
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const session = getSessionCookie(request)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { destinationId, packageId } = await request.json()
        const db = getDb()
        const [row] = await db.insert(trendingPackages).values({ destinationId, packageId }).returning()
        return NextResponse.json(row, { status: 201 })
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    const session = getSessionCookie(request)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { destinationId, packageId } = await request.json()
        const db = getDb()
        await db.delete(trendingPackages).where(
            and(eq(trendingPackages.destinationId, destinationId), eq(trendingPackages.packageId, packageId))
        )
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
