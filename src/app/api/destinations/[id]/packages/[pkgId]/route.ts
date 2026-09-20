import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import { getDb } from "@/lib/db"
import { packages, packageReviews } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ pkgId: string }> }) {
    try {
        const { pkgId } = await params
        const db = getDb()
        const [pkg] = await db.select().from(packages).where(eq(packages.id, pkgId))
        if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 })

        const reviews = await db.select().from(packageReviews).where(eq(packageReviews.packageId, pkgId))
        return NextResponse.json({ ...pkg, reviews })
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ pkgId: string }> }) {
    const session = getSessionCookie(request)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { pkgId } = await params
        const body = await request.json()
        const db = getDb()
        const allowed = ["name","coverImageUrl","originalPrice","discountedPrice","description","duration","pickupDropLocation","itinerary","inclusions","exclusions"] as const
        const patch = Object.fromEntries(allowed.filter(k => body[k] !== undefined).map(k => [k, body[k]]))
        const [row] = await db.update(packages).set(patch).where(eq(packages.id, pkgId)).returning()
        if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
        return NextResponse.json(row)
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ pkgId: string }> }) {
    const session = getSessionCookie(request)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { pkgId } = await params
        const db = getDb()
        await db.delete(packages).where(eq(packages.id, pkgId))
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
