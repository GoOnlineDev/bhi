import type { LucideIcon } from "lucide-react";
import {
  Heart,
  Brain,
  ShieldAlert,
  Pill,
  Baby,
  Users,
  Stethoscope,
  Leaf,
  BookOpen,
  UserCheck,
  Layers,
} from "lucide-react";

export type ServiceCategoryStyle = {
  color: string;
  lightColor: string;
  textColor: string;
  borderColor: string;
  icon: LucideIcon;
};

const DEFAULT_STYLE: ServiceCategoryStyle = {
  color: "bg-primary",
  lightColor: "bg-primary/10",
  textColor: "text-primary",
  borderColor: "border-primary/30",
  icon: Layers,
};

/** Tailwind + icon mapping for service categories (dashboard + public pages). */
export const SERVICE_CATEGORY_STYLES: Record<string, ServiceCategoryStyle> = {
  SRHR: {
    color: "bg-rose-500",
    lightColor: "bg-rose-50",
    textColor: "text-rose-600",
    borderColor: "border-rose-200",
    icon: Heart,
  },
  NCDs: {
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    borderColor: "border-indigo-200",
    icon: Brain,
  },
  GBV: {
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    icon: ShieldAlert,
  },
  "Substance Abuse": {
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
    icon: Pill,
  },
  "Maternal & Child Health": {
    color: "bg-pink-500",
    lightColor: "bg-pink-50",
    textColor: "text-pink-600",
    borderColor: "border-pink-200",
    icon: Baby,
  },
  "Mental Health": {
    color: "bg-cyan-500",
    lightColor: "bg-cyan-50",
    textColor: "text-cyan-600",
    borderColor: "border-cyan-200",
    icon: Brain,
  },
  "Clinical Services": {
    color: "bg-red-500",
    lightColor: "bg-red-50",
    textColor: "text-red-600",
    borderColor: "border-red-200",
    icon: Stethoscope,
  },
  "Community Outreach": {
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    icon: Users,
  },
  "Environmental Health": {
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    icon: Leaf,
  },
  "Education & Prevention": {
    color: "bg-green-500",
    lightColor: "bg-green-50",
    textColor: "text-green-600",
    borderColor: "border-green-200",
    icon: BookOpen,
  },
  "Youth Services": {
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-600",
    borderColor: "border-orange-200",
    icon: Baby,
  },
  "Nursing Services": {
    color: "bg-teal-500",
    lightColor: "bg-teal-50",
    textColor: "text-teal-600",
    borderColor: "border-teal-200",
    icon: UserCheck,
  },
  Other: DEFAULT_STYLE,
};

export function getCategoryStyle(category?: string | null): ServiceCategoryStyle {
  if (!category) return DEFAULT_STYLE;
  return SERVICE_CATEGORY_STYLES[category] ?? DEFAULT_STYLE;
}
