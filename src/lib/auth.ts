import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { getDb } from "./db"
import * as schema from "./db/schema"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _auth: any

export function getAuth() {
    if (!_auth) {
        _auth = betterAuth({
            database: drizzleAdapter(getDb(), {
                provider: "pg",
                schema,
            }),
            emailAndPassword: {
                enabled: true,
            },
            secret: process.env.BETTER_AUTH_SECRET ?? "demo-secret-change-in-production",
            baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
        })
    }
    return _auth
}
