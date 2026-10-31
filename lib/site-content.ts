import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Award,
  Baby,
  Brain,
  FlaskConical,
  Handshake,
  Heart,
  Lightbulb,
  Network,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";

export const POSITIONING =
  "An organisation that brings healthcare closer to underserved communities while working to strengthen the systems, partnerships and community capacities necessary for sustainable health improvements.";

export const MISSION =
  "To reduce healthcare disparities by empowering communities with essential health knowledge, improving access to medical services and strengthening community-based healthcare delivery through sustainable partnerships and innovative interventions.";

export const VISION =
  "A healthier society where everyone has equitable access to quality healthcare services and the knowledge to make informed health decisions.";

export const BELIEF = "Healthcare systems must reach communities, not simply wait for communities to reach them.";

export const SUUBI_URL = "https://www.suubimedicalcentre.com/";

export const CORE_VALUES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Scale, title: "Equity", text: "Promoting fair access to healthcare regardless of location or socioeconomic status." },
  { icon: Users, title: "Community empowerment", text: "Enabling people to make informed decisions about their health." },
  { icon: ShieldCheck, title: "Integrity", text: "Upholding honesty, accountability and ethical conduct." },
  { icon: Handshake, title: "Collaboration", text: "Working with communities, governments and partners to achieve shared health goals." },
  { icon: Lightbulb, title: "Innovation", text: "Exploring better and sustainable approaches to healthcare delivery." },
  { icon: Award, title: "Excellence", text: "Striving for quality, measurable impact and continuous improvement." },
];

export const APPROACH: { title: string; text: string }[] = [
  { title: "Community engagement", text: "Understanding local health needs and involving communities in identifying solutions." },
  { title: "Preventive healthcare", text: "Promoting health education, disease prevention and early identification of health conditions." },
  { title: "Clinical service delivery", text: "Improving access to essential medical services through facility-based and outreach interventions, working with partner facilities." },
  { title: "Health systems collaboration", text: "Strengthening connections between communities, healthcare workers, health facilities and local government structures." },
  { title: "Partnerships and innovation", text: "Mobilising technical expertise, resources and innovative approaches to address healthcare challenges." },
];

// TODO(owner): confirm the reporting period and records behind each figure before publication.
export const IMPACT_STATS: { value: string; label: string }[] = [
  { value: "32,000+", label: "Community members reached" },
  { value: "18,000+", label: "Health service contacts" },
  { value: "180+", label: "Community outreaches conducted" },
  { value: "6,400+", label: "HIV tests conducted" },
  { value: "276+", label: "People identified as living with HIV and linked to care" },
];

export const WHY_BHI = [
  "Community engagement and health education.",
  "Clinical services and community-based healthcare delivery.",
  "Early identification, referral and follow-up.",
  "Collaboration with public and private healthcare providers.",
  "Partnerships that strengthen local capacity and expand healthcare access.",
];

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
