// Run with: node --env-file=.env.local scripts/migrate-firestore-to-neon.mjs
import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore"
import { neonConfig, Pool } from "@neondatabase/serverless"
import ws from "ws"

neonConfig.webSocketConstructor = ws

const firebaseConfig = {
    apiKey: "AIzaSyB5tvflk2WFoI4PGncZWrEOmyakaFQBTYE",
    authDomain: "packagefy.firebaseapp.com",
    projectId: "packagefy",
    storageBucket: "packagefy.appspot.com",
    messagingSenderId: "292607266314",
    appId: "1:292607266314:web:3a79993585ad75d8a12573",
}

const DB_URL =
    process.env.DATABASE_URL ??
    "postgresql://neondb_owner:npg_a4Ncr5gzboSs@ep-wispy-moon-b49qx6nu-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)
const pool = new Pool({ connectionString: DB_URL })

async function run() {
    const client = await pool.connect()
    try {
        // ── destinations + packages + reviews ──────────────────────────────
        const destSnap = await getDocs(collection(firestore, "destinations"))
        console.log(`Found ${destSnap.size} destinations`)

        for (const destDoc of destSnap.docs) {
            const d = destDoc.data()
            console.log(`Migrating destination: ${d.name}`)

            await client.query(
                `INSERT INTO destinations (id, name, description, cover_image_url, version)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (id) DO NOTHING`,
                [
                    destDoc.id,
                    d.name ?? "",
                    d.description ?? "",
                    d.coverImageUrl ?? "",
                    d.version ?? 1,
                ]
            )

            const pkgs = Array.isArray(d.packages) ? d.packages : []
            console.log(`  packages: ${pkgs.length}`)

            for (const pkg of pkgs) {
                await client.query(
                    `INSERT INTO packages
                       (id, destination_id, name, cover_image_url, original_price, discounted_price,
                        description, duration, pickup_drop_location, itinerary, inclusions, exclusions)
                     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
                     ON CONFLICT (id) DO NOTHING`,
                    [
                        pkg.id,
                        destDoc.id,
                        pkg.name ?? "",
                        pkg.coverImageUrl ?? "",
                        pkg.originalPrice ?? 0,
                        pkg.discountedPrice ?? 0,
                        pkg.description ?? "",
                        pkg.duration ?? "",
                        pkg.pickupAndDropLocation ?? "",
                        JSON.stringify(pkg.itinerary ?? []),
                        JSON.stringify(pkg.inclusions ?? []),
                        JSON.stringify(pkg.exclusions ?? []),
                    ]
                )

                const reviews = Array.isArray(pkg.reviews) ? pkg.reviews : []
                for (const r of reviews) {
                    await client.query(
                        `INSERT INTO package_reviews (id, package_id, reviewer_name, title, content, stars, post_date)
                         VALUES ($1,$2,$3,$4,$5,$6,$7)
                         ON CONFLICT (id) DO NOTHING`,
                        [
                            r.id,
                            pkg.id,
                            r.name ?? "",
                            r.title ?? "",
                            r.content ?? "",
                            r.stars ?? 5,
                            r.postDate ?? "",
                        ]
                    )
                }
                if (reviews.length) console.log(`    reviews: ${reviews.length} for package ${pkg.name}`)
            }
        }

        // ── search/list ────────────────────────────────────────────────────
        const searchSnap = await getDoc(doc(firestore, "search", "list"))
        if (searchSnap.exists()) {
            const entries = searchSnap.data().entries ?? []
            console.log(`Migrating search entries: ${entries.length}`)
            for (const e of entries) {
                await client.query(
                    `INSERT INTO search_entries (id, destination_id, destination_name)
                     VALUES ($1,$2,$3)
                     ON CONFLICT (id) DO NOTHING`,
                    [e.id, e.destinationId, e.destinationName]
                )
            }
        } else {
            console.log("No search/list doc found, skipping")
        }

        // ── homepage/testimonials ──────────────────────────────────────────
        const testimonialsSnap = await getDoc(doc(firestore, "homepage", "testimonials"))
        if (testimonialsSnap.exists()) {
            const entries = testimonialsSnap.data().entries ?? []
            console.log(`Migrating testimonials: ${entries.length}`)
            for (const t of entries) {
                await client.query(
                    `INSERT INTO testimonials (image_src, name, content, author_position)
                     SELECT $1,$2,$3,$4
                     WHERE NOT EXISTS (
                       SELECT 1 FROM testimonials WHERE name=$2 AND content=$3
                     )`,
                    [t.imageSrc ?? "", t.name ?? "", t.content ?? "", t.authorPosition ?? ""]
                )
            }
        } else {
            console.log("No homepage/testimonials doc found, skipping")
        }

        // ── homepage/trendingPackages ──────────────────────────────────────
        const trendingSnap = await getDoc(doc(firestore, "homepage", "trendingPackages"))
        if (trendingSnap.exists()) {
            const entries = trendingSnap.data().entries ?? []
            console.log(`Migrating trending packages: ${entries.length}`)
            for (const t of entries) {
                const addedAt = t.addTimestamp
                    ? new Date(t.addTimestamp?.toMillis?.() ?? t.addTimestamp)
                    : null
                await client.query(
                    `INSERT INTO trending_packages (destination_id, package_id, added_at)
                     SELECT $1,$2,$3
                     WHERE NOT EXISTS (
                       SELECT 1 FROM trending_packages WHERE destination_id=$1 AND package_id=$2
                     )`,
                    [t.destinationId, t.packageId, addedAt]
                )
            }
        } else {
            console.log("No homepage/trendingPackages doc found, skipping")
        }

        console.log("Migration complete.")
    } finally {
        client.release()
        await pool.end()
    }
}

run().then(() => process.exit(0)).catch((err) => {
    console.error("Migration failed:", err)
    process.exit(1)
})
