import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export async function middleware(request: NextRequest) {
    const session = getSessionCookie(request)

    if (!session) {
        const url = request.nextUrl.clone()
        const src = request.nextUrl.pathname
        url.pathname = "/admin"
        url.searchParams.set("message", "Please Login")
        url.searchParams.set("src", src)
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/dashboard/:path*"],
}
