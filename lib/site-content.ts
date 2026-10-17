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
};

export const FOCUS_AREAS: FocusArea[] = [
  { name: "Maternal, newborn and child health", short: "MCH", match: ["mch", "maternal", "newborn", "child health"], icon: Baby, styleKey: "MCH" },
  { name: "Sexual and reproductive health and rights", short: "SRHR", match: ["srhr", "sexual & reproductive", "sexual and reproductive"], icon: Heart, styleKey: "SRHR" },
  { name: "Gender-based violence", short: "GBV", match: ["gbv", "gender-based violence", "gender based violence"], icon: ShieldAlert, styleKey: "GBV" },
  { name: "Communicable and Non-communicable diseases", short: "NCDs", match: ["ncd", "communicable"], icon: Activity, styleKey: "NCDs" },
  { name: "Mental health", short: "Mental Health", match: ["mental health"], icon: Brain, styleKey: "Mental Health" },
  { name: "Community health systems strengthening", short: "Health Systems", match: ["community health system", "health systems"], icon: Network, styleKey: "Community Health Systems" },
  { name: "Research", short: "Research", match: ["research"], icon: FlaskConical, styleKey: "Research" },
];

type ServiceLike = { _id: string; title: string; category?: string; shortTitle?: string };

/** Link for a focus area: the first published service that matches it, otherwise the services index. */
export function focusAreaHref(area: FocusArea, services: ServiceLike[] | undefined): string {
  const hit = services?.find((s) => {
    const hay = [s.category, s.shortTitle, s.title].filter(Boolean).join(" ").toLowerCase();
    return area.match.some((m) => hay.includes(m));
  });
  return hit ? `/services/${hit._id}` : "/services";
}
