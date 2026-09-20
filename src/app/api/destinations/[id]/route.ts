import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import { getDb } from "@/lib/db"
import { destinations, packages, packageReviews } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const db = getDb()
        const [dest] = await db.select().from(destinations).where(eq(destinations.id, id))
        if (!dest) return NextResponse.json({ error: "Not found" }, { status: 404 })

        const pkgs = await db.select().from(packages).where(eq(packages.destinationId, id))
        const reviews = pkgs.length
            ? await db.query.packageReviews.findMany({
                where: (r, { inArray }) => inArray(r.packageId, pkgs.map(p => p.id)),
              })
            : []

        const pkgsWithReviews = pkgs.map(p => ({
            ...p,
            reviews: reviews.filter(r => r.packageId === p.id),
        }))

        return NextResponse.json({ ...dest, packages: pkgsWithReviews })
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = getSessionCookie(request)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { id } = await params
        const body = await request.json()
        const db = getDb()
        const [row] = await db.update(destinations)
            .set({
                ...(body.name !== undefined && { name: body.name }),
                ...(body.description !== undefined && { description: body.description }),
                ...(body.coverImageUrl !== undefined && { coverImageUrl: body.coverImageUrl }),
                updatedAt: new Date(),
            })
            .where(eq(destinations.id, id))
            .returning()
        if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
        return NextResponse.json(row)
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = getSessionCookie(request)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { id } = await params
        const db = getDb()
        await db.delete(destinations).where(eq(destinations.id, id))
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
