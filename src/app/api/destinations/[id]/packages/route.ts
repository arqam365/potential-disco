import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import { getDb } from "@/lib/db"
import { packages, packageReviews } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const db = getDb()
        const pkgs = await db.select().from(packages).where(eq(packages.destinationId, id))
        const reviews = pkgs.length
            ? await db.query.packageReviews.findMany({
                where: (r, { inArray }) => inArray(r.packageId, pkgs.map(p => p.id)),
              })
            : []

        return NextResponse.json(pkgs.map(p => ({
            ...p,
            reviews: reviews.filter(r => r.packageId === p.id),
        })))
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = getSessionCookie(request)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { id } = await params
        const body = await request.json()
        const db = getDb()
        const [row] = await db.insert(packages).values({
            id: body.id,
            destinationId: id,
            name: body.name,
            coverImageUrl: body.coverImageUrl,
            originalPrice: body.originalPrice,
            discountedPrice: body.discountedPrice,
            description: body.description,
            duration: body.duration,
            pickupDropLocation: body.pickupDropLocation,
            itinerary: body.itinerary,
            inclusions: body.inclusions,
            exclusions: body.exclusions,
        }).returning()
        return NextResponse.json(row, { status: 201 })
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
