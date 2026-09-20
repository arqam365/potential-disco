import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import type { NeonHttpDatabase } from "drizzle-orm/neon-http"
import * as schema from "./schema"

let _db: NeonHttpDatabase<typeof schema> | undefined

export function getDb(): NeonHttpDatabase<typeof schema> {
    if (!_db) {
        _db = drizzle(neon(process.env.DATABASE_URL!), { schema })
    }
    return _db
}
