import type { LucideIcon } from "lucide-react";
import { Activity, Baby, Brain, FlaskConical, Heart, Network, ShieldAlert } from "lucide-react";

export const MISSION =
  "To close healthcare disparities by empowering communities with essential health knowledge, supporting informed health decisions, and improving access to medical services for underserved and vulnerable populations.";

export const VISION =
  "A healthy and empowered society where every individual, regardless of location, social or economic status, has equitable access to quality healthcare, reliable health information, and the opportunity to live a healthy and dignified life.";

export const SUUBI_URL = "https://www.suubimedicalcentre.com/";

export type FocusArea = {
  name: string;
  short: string;
  /** Lower-case fragments used to match an admin-managed service (category, short title or title). */
  match: string[];
  icon: LucideIcon;
  /** Key into SERVICE_CATEGORY_STYLES for colours. */
  styleKey: string;
  /** One-line summary used when no admin service describes this area. */
  summary: string;
  /** Built-in page under /services/<slug>, for areas without a Convex service yet. */
  slug?: string;
};

export const FOCUS_AREAS: FocusArea[] = [
  { name: "Maternal, newborn and child health", short: "MCH", match: ["mch", "maternal", "newborn", "child health"], icon: Baby, styleKey: "MCH", slug: "maternal-newborn-child-health", summary: "Information, check-ups and referrals that give mothers, newborns and young children a healthy start." },
  { name: "Sexual and reproductive health and rights", short: "SRHR", match: ["srhr", "sexual & reproductive", "sexual and reproductive"], icon: Heart, styleKey: "SRHR", summary: "Information, services and referrals that help people make informed choices about their sexual and reproductive health." },
  { name: "Gender-based violence", short: "GBV", match: ["gbv", "gender-based violence", "gender based violence"], icon: ShieldAlert, styleKey: "GBV", summary: "Awareness, prevention and support for survivors, including referral to care and protection services." },
  { name: "Communicable and Non-communicable diseases", short: "NCDs", match: ["ncd", "communicable"], icon: Activity, styleKey: "NCDs", summary: "Health education, screening and referral so that diseases are found early and managed well." },
  { name: "Mental health", short: "Mental Health", match: ["mental health"], icon: Brain, styleKey: "Mental Health", slug: "mental-health", summary: "Raising awareness, reducing stigma and connecting people to psychosocial support and care." },
  { name: "Community health systems strengthening", short: "Health Systems", match: ["community health system", "health systems"], icon: Network, styleKey: "Community Health Systems", slug: "community-health-systems-strengthening", summary: "Working with communities, local leaders and facilities so services are closer and better connected." },
  { name: "Research", short: "Research", match: ["research"], icon: FlaskConical, styleKey: "Research", slug: "research", summary: "Learning from our work and communities to understand local needs and improve services." },
];

export type ServiceLike = { _id: string; title: string; category?: string; shortTitle?: string; slug?: string };

/** First published admin service that covers this focus area (by slug, category, short title or title). */
export function findServiceForArea<T extends ServiceLike>(area: FocusArea, services: T[] | undefined): T | undefined {
  return services?.find((s) => {
    if (area.slug && s.slug === area.slug) return true;
    const hay = [s.category, s.shortTitle, s.title].filter(Boolean).join(" ").toLowerCase();
    return area.match.some((m) => hay.includes(m));
  });
}

/** Link for a focus area: admin service, then built-in page, then the services index. */
export function focusAreaHref(area: FocusArea, services: ServiceLike[] | undefined): string {
  const hit = findServiceForArea(area, services);
  if (hit) return `/services/${hit._id}`;
  return area.slug ? `/services/${area.slug}` : "/services";
}
