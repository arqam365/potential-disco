import { pgTable, text, boolean, timestamp, integer, numeric, jsonb, serial } from "drizzle-orm/pg-core"

// ── better-auth tables ──────────────────────────────────────────────────────

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("emailVerified").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
})

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
})

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt"),
    updatedAt: timestamp("updatedAt"),
})

// ── app tables ───────────────────────────────────────────────────────────────

export const destinations = pgTable("destinations", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    coverImageUrl: text("cover_image_url").notNull().default(""),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    version: integer("version").notNull().default(1),
})

export const packages = pgTable("packages", {
    id: text("id").primaryKey(),
    destinationId: text("destination_id").notNull().references(() => destinations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    coverImageUrl: text("cover_image_url").notNull().default(""),
    originalPrice: numeric("original_price").notNull().default("0"),
    discountedPrice: numeric("discounted_price").notNull().default("0"),
    description: text("description").notNull().default(""),
    duration: text("duration").notNull().default(""),
    pickupDropLocation: text("pickup_drop_location").notNull().default(""),
    itinerary: jsonb("itinerary").notNull().default([]),
    inclusions: jsonb("inclusions").notNull().default([]),
    exclusions: jsonb("exclusions").notNull().default([]),
    createdAt: timestamp("created_at").defaultNow(),
})

export const packageReviews = pgTable("package_reviews", {
    id: text("id").primaryKey(),
    packageId: text("package_id").notNull().references(() => packages.id, { onDelete: "cascade" }),
    reviewerName: text("reviewer_name").notNull().default(""),
    title: text("title").notNull().default(""),
    content: text("content").notNull().default(""),
    stars: integer("stars").notNull().default(5),
    postDate: text("post_date").notNull().default(""),
})

export const trendingPackages = pgTable("trending_packages", {
    id: serial("id").primaryKey(),
    destinationId: text("destination_id").notNull(),
    packageId: text("package_id").notNull(),
    addedAt: timestamp("added_at").defaultNow(),
})

export const testimonials = pgTable("testimonials", {
    id: serial("id").primaryKey(),
    imageSrc: text("image_src").notNull().default(""),
    name: text("name").notNull(),
    content: text("content").notNull(),
    authorPosition: text("author_position").notNull().default(""),
})

export const searchEntries = pgTable("search_entries", {
    id: text("id").primaryKey(),
    destinationId: text("destination_id").notNull(),
    destinationName: text("destination_name").notNull(),
})
