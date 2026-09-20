import { neonConfig, Pool } from "@neondatabase/serverless"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import ws from "ws"
import https from "https"
import http from "http"

neonConfig.webSocketConstructor = ws

const DESTINATION_IMAGES = {
    dubai:       "photo-1512453979798-5ea266f8880c",
    maldives:    "photo-1573843981267-be1999ff37cd",
    thailand:    "photo-1528360983277-13d401cdc186",
    vietnam:     "photo-1528127269322-539801943592",
    bali:        "photo-1537996194471-e657df975ab4",
    singapore:   "photo-1525625293386-3f8f99389edd",
    paris:       "photo-1499856871958-5b9627545d1a",
    tokyo:       "photo-1503899036084-c55cdd92da26",
    japan:       "photo-1492571350019-22de08371fd3",
    india:       "photo-1524492412937-b28074a5d7da",
    goa:         "photo-1587922546307-776227941871",
    kashmir:     "photo-1548013146-72479768bada",
    himachal:    "photo-1605649487212-47bdab064df7",
    rajasthan:   "photo-1477587458883-47145ed31fd0",
    kerala:      "photo-1602216056096-3b40cc0c9944",
    ladakh:      "photo-1626621341517-bbf3d9990a23",
    manali:      "photo-1605649487212-47bdab064df7",
    andaman:     "photo-1544551763-46a013bb70d5",
    meghalaya:   "photo-1506461883276-594a12b5bca3",
    bhutan:      "photo-1553856622-d1b352e9a211",
    uttrakhand:  "photo-1506905925346-21bda4d32df4",
    srilanka:    "photo-1578474846511-04ba529f0b88",
    northeast:   "photo-1504274066651-8d31a536b11a",
    default:     "photo-1488646953014-85cb44e25828",
}

function getUnsplashId(name) {
    const lower = name.toLowerCase().replace(/\s+/g, "")
    for (const [key, id] of Object.entries(DESTINATION_IMAGES)) {
        if (lower.includes(key)) return id
    }
    return DESTINATION_IMAGES.default
}

function download(url) {
    return new Promise((resolve, reject) => {
        const mod = url.startsWith("https") ? https : http
        mod.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return download(res.headers.location).then(resolve).catch(reject)
            }
            const chunks = []
            res.on("data", (c) => chunks.push(c))
            res.on("end", () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers["content-type"] ?? "image/jpeg" }))
            res.on("error", reject)
        }).on("error", reject)
    })
}

const s3 = new S3Client({
    region: process.env.AWS_REGION ?? "us-east-2",
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
})

const BUCKET = process.env.NEON_STORAGE_BUCKET ?? "uploads"
const APP_URL = "https://potential-disco-tau.vercel.app"

async function uploadToNeon(buffer, contentType, name) {
    const ext = contentType.split("/")[1]?.split(";")[0] ?? "jpg"
    const key = `uploads/${Date.now()}-${name.replace(/\s+/g, "-").toLowerCase()}.${ext}`
    await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: buffer, ContentType: contentType }))
    return `${APP_URL}/api/image?key=${encodeURIComponent(key)}`
}

async function getImageUrl(name) {
    const id = getUnsplashId(name)
    const url = `https://images.unsplash.com/${id}?w=1200&q=80&fm=jpg`
    console.log(`  Downloading image for "${name}"...`)
    const { buffer, contentType } = await download(url)
    return uploadToNeon(buffer, contentType, name)
}

function isBroken(url) {
    if (!url) return true
    if (url.includes("firebasestorage.googleapis.com")) return true
    return false
}

const DB_URL = process.env.DATABASE_URL ??
    "postgresql://neondb_owner:npg_a4Ncr5gzboSs@ep-wispy-moon-b49qx6nu-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

const pool = new Pool({ connectionString: DB_URL })

async function main() {
    const client = await pool.connect()
    try {
        const { rows: dests } = await client.query("SELECT id, name, cover_image_url FROM destinations")
        console.log(`Found ${dests.length} destinations`)

        for (const dest of dests) {
            console.log(`\nDestination: ${dest.name}`)

            if (isBroken(dest.cover_image_url)) {
                const newUrl = await getImageUrl(dest.name)
                await client.query("UPDATE destinations SET cover_image_url=$1 WHERE id=$2", [newUrl, dest.id])
                console.log(`  ✓ ${newUrl}`)
            } else {
                console.log(`  image ok`)
            }

            const { rows: pkgs } = await client.query(
                "SELECT id, name, cover_image_url FROM packages WHERE destination_id=$1",
                [dest.id]
            )

            for (const pkg of pkgs) {
                if (isBroken(pkg.cover_image_url)) {
                    const newUrl = await getImageUrl(pkg.name || dest.name)
                    await client.query("UPDATE packages SET cover_image_url=$1 WHERE id=$2", [newUrl, pkg.id])
                    console.log(`  Package "${pkg.name}" ✓`)
                }
            }
        }

        console.log("\nDone!")
    } finally {
        client.release()
        await pool.end()
    }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
