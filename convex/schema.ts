import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    role: v.union(
      v.literal("admin"),
      v.literal("patient"),
      v.literal("doctor"),
      v.literal("superadmin"),
      v.literal("editor")
    )
  })
  .index("by_clerkId", ["clerkId"]),
  news: defineTable({
    title: v.string(),             // Headline of the news article
    content: v.string(),           // Main body/content
    summary: v.string(),           // Short summary or excerpt
    author: v.string(),            // Who posted it (can be name or ID)
    images: v.array(v.string()),   // List of image URLs
    videos: v.optional(v.array(v.string())), // Video URLs (optional array)
    category: v.union(
      v.literal("Announcements"),
      v.literal("Health Tips"),
      v.literal("Community Programs"),
      v.literal("Medical Updates"),
      v.literal("Staff Highlights"),
      v.literal("Success Stories"),
      v.literal("Event Recaps"),
      v.literal("Policy Changes"),
      v.literal("Emergency Alerts"),
      v.literal("Research & Innovation")
    ), // Required category
    startDate: v.number(),         // When the news happened (timestamp)
    endDate: v.optional(v.number()), // Optional end time/date
    publishedAt: v.number(),       // Timestamp (Date.now())
    updatedAt: v.optional(v.number()), // For tracking updates
    isPublished: v.boolean(),      // Toggle visibility on frontend
    emailedAt: v.optional(v.number()), // When subscribers were notified about this item
    tags: v.optional(v.array(v.string())), // Optional tags like ["covid", "staff", "tips"]
    institution: v.optional(
      v.union(
        v.literal("Boost Health Initiative"),
        v.literal("Suubi Medical Centre"),
        v.string() // For future institutions
      )
    ),
  })
  .index("by_publishedAt", ["publishedAt"])
  .index("by_category", ["category"])
  .index("by_author", ["author"])
  .index("by_isPublished", ["isPublished"])
  .index("by_institution", ["institution"])
  .index("by_category_publishedAt", ["category", "publishedAt"])
  .index("by_category_isPublished", ["category", "isPublished"])
  .index("by_institution_isPublished", ["institution", "isPublished"]),
  programs: defineTable({
    name: v.string(),                     // Program title
    description: v.string(),              // Full description of the program
    goal: v.optional(v.string()),         // Optional: specific aim or objective
    startDate: v.number(),                // Timestamp for when it begins
    endDate: v.optional(v.number()),      // Optional: when it ends
    location: v.optional(v.string()),     // Where the program is held (optional)
    images: v.array(v.string()),          // Banner or feature images (array)
    videos: v.optional(v.array(v.string())), // Video URLs (optional array)
    createdAt: v.number(),                // Timestamp for record creation
    updatedAt: v.optional(v.number()),    // Optional update tracker
    status: v.string(),                   // "upcoming", "ongoing", "completed"
    contactPerson: v.optional(v.string()),// Coordinator/Lead for the program
    contactPhone: v.optional(v.string()), // Optional phone number
    contactEmail: v.optional(v.string()), // Optional email
    tags: v.optional(v.array(v.string())),// E.g. ["nutrition", "education"]
    relatedNewsIds: v.optional(v.array(v.id("news"))), // Links to news
    isFeatured: v.boolean(),              // Should it be highlighted?
    approved: v.boolean(),                // Whether the program is approved
    emailedAt: v.optional(v.number()),    // When subscribers were notified about this program
  })
  .index("by_startDate", ["startDate"])
  .index("by_status", ["status"])
  .index("by_isFeatured", ["isFeatured"])
  .index("by_approved", ["approved"])
  .index("by_status_approved", ["status", "approved"])
  .index("by_isFeatured_approved", ["isFeatured", "approved"]),
  
  // Subscribers table for email subscriptions
  subscribers: defineTable({
    email: v.string(), // Subscriber email address (stored lower-cased)
    createdAt: v.number(), // Timestamp for when the subscription was added
    unsubscribeToken: v.optional(v.string()), // Secret used in one-click unsubscribe links
  })
  .index("by_email", ["email"])
  .index("by_unsubscribeToken", ["unsubscribeToken"])
  .index("by_createdAt", ["createdAt"]),

  // Gallery table for media items (photos and videos)
  gallery: defineTable({
    title: v.optional(v.string()),                    // Title of the media item
    description: v.optional(v.string()),              // Description of the media item
    type: v.optional(v.union(v.literal("image"), v.literal("video"))), // Media type
    url: v.optional(v.string()),                      // URL of the media file
    thumbnail: v.optional(v.string()),                // Optional thumbnail URL for videos
    category: v.optional(v.union(
      v.literal("Maternal Health"),
      v.literal("Education"),
      v.literal("Mental Health"),
      v.literal("Clinical Services"),
      v.literal("Laboratory"),
      v.literal("Facilities"),
      v.literal("Community Outreach"),
      v.literal("Youth Services"),
      v.literal("Nursing"),
      v.literal("Environmental Health"),
      v.literal("Training")
    )),                                               // Fixed missing closing parenthesis
    date: v.optional(v.number()),                     // Date when the media was created/taken (timestamp)
    location: v.optional(v.string()),                 // Location where the media was taken
    tags: v.optional(v.array(v.string())),           // Tags for categorization and search
    createdAt: v.number(),                           // When the record was created
    updatedAt: v.optional(v.number()),               // When the record was last updated
    isPublished: v.boolean(),                        // Whether the media is published/visible
    uploadedBy: v.optional(v.string()),              // User ID who uploaded the media
  })
  .index("by_type", ["type"])
  .index("by_category", ["category"])
  .index("by_date", ["date"])
  .index("by_isPublished", ["isPublished"])
  .index("by_createdAt", ["createdAt"])
  .index("by_category_isPublished", ["category", "isPublished"])
  .index("by_type_isPublished", ["type", "isPublished"]),

  // Cron state table for persistent cron job state
  services: defineTable({
    title: v.string(),
    slug: v.optional(v.string()),
    shortTitle: v.optional(v.string()),
    description: v.string(),
    overview: v.optional(v.string()),
    category: v.optional(v.string()),
    heroImage: v.optional(v.string()),
    images: v.array(v.string()),
    videos: v.optional(v.array(v.string())),
    features: v.optional(v.array(v.object({
      title: v.string(),
      description: v.string(),
    }))),
    benefits: v.optional(v.array(v.string())),
    process: v.optional(v.array(v.string())),
    stats: v.optional(v.array(v.object({
      label: v.string(),
      value: v.string(),
    }))),
    tags: v.optional(v.array(v.string())),
    isPublished: v.boolean(),
    isFeatured: v.optional(v.boolean()),
    /** When true, service is highlighted on Home + About as a spotlight / pillar card (if published). */
    showOnHome: v.optional(v.boolean()),
    order: v.optional(v.number()),
    contactPerson: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
  .index("by_isPublished", ["isPublished"])
  .index("by_category", ["category"])
  .index("by_isFeatured", ["isFeatured"])
  .index("by_createdAt", ["createdAt"])
  .index("by_isPublished_showOnHome", ["isPublished", "showOnHome"]),
  cron_state: defineTable({
    key: v.string(), // e.g., "lastCounts"
    value: v.any(),
  })
  .index("by_key", ["key"]),

  /** Single home-page hero configuration (singleton row with singletonKey "home"). */
  heroSettings: defineTable({
    singletonKey: v.literal("home"),
    headline: v.string(),
    subheadline: v.string(),
    primaryCtaLabel: v.string(),
    secondaryCtaLabel: v.string(),
    primaryCtaHref: v.string(),
    secondaryCtaHref: v.string(),
    slides: v.array(
      v.object({
        url: v.string(),
        alt: v.string(),
      })
    ),
    updatedAt: v.number(),
  }).index("by_singletonKey", ["singletonKey"]),
}); 