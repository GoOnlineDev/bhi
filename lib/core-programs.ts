import { FOCUS_AREAS, findServiceForArea, type ServiceLike } from "@/lib/site-content";

export type ServiceContent = {
  title: string;
  shortTitle?: string;
  category?: string;
  description: string;
  overview?: string;
  heroImage?: string;
  images?: string[];
  videos?: string[];
  features?: { title: string; description: string }[];
  benefits?: string[];
  process?: string[];
  stats?: { label: string; value: string }[];
  tags?: string[];
  contactPhone?: string;
  contactEmail?: string;
  contactPerson?: string;
  isFeatured?: boolean;
};

/** Built-in page for a core programme; shown only until admins publish a matching Convex service. */
export type CoreProgram = ServiceContent & { slug: string; focus: string };

export type ServiceLink = { key: string; href: string; title: string; category?: string; image?: string };

export const CORE_PROGRAMS: CoreProgram[] = [
  {
    slug: "maternal-newborn-child-health",
    focus: "MCH",
    title: "Maternal, Newborn and Child Health (MCH)",
    shortTitle: "MCH",
    category: "MCH",
    description:
      "Helping mothers, newborns and young children in Kayunga District get the information, check-ups and referrals they need for a healthy start.",
    overview:
      "Many mothers in rural Kayunga face long distances, costs and limited information when seeking care during pregnancy, childbirth and early childhood. BHI works with communities and Suubi Medical Centre to bring maternal and child health support closer to home.",
    features: [
      { title: "Health education for families", description: "Community sessions on pregnancy care, birth preparedness, breastfeeding, nutrition and danger signs." },
      { title: "Antenatal and postnatal care", description: "Encouraging mothers to start antenatal visits early and to attend postnatal check-ups." },
      { title: "Child health and immunisation", description: "Promoting routine immunisation, growth monitoring and early care for childhood illness." },
      { title: "Referrals to clinical care", description: "Linking mothers and children who need further care to Suubi Medical Centre and other health facilities." },
    ],
    benefits: ["Earlier antenatal care", "Better-informed families", "Timely referral when danger signs appear", "Support for young and first-time mothers"],
    process: [
      "Reach mothers and families through community outreaches and local leaders.",
      "Share practical health information and look out for risk signs.",
      "Refer those who need care to Suubi Medical Centre or other facilities.",
      "Follow up to support continued care.",
    ],
    tags: ["Maternal health", "Newborn care", "Child health", "Immunisation"],
  },
  {
    slug: "mental-health",
    focus: "Mental Health",
    title: "Mental Health",
    shortTitle: "Mental Health",
    category: "Mental Health",
    description:
      "Raising awareness of mental health, reducing stigma and connecting people in our communities to support and care.",
    overview:
      "Mental health conditions are often misunderstood or hidden in rural communities, and support can be hard to find. BHI includes mental health in its health education and outreach so that people recognise the signs, feel able to seek help and can be referred to care.",
    features: [
      { title: "Awareness and stigma reduction", description: "Community conversations that explain common mental health conditions and challenge stigma." },
      { title: "Psychosocial support", description: "Listening and basic support for individuals and families, including young people and survivors of violence." },
      { title: "Screening and referral", description: "Identifying people who may need further help and referring them to appropriate health services." },
      { title: "Part of all our programmes", description: "Bringing mental health into our SRHR, GBV, maternal and NCD work, where it often goes unnoticed." },
    ],
    benefits: ["Less stigma around seeking help", "Earlier identification of people in distress", "Clear routes to care", "Support for families and carers"],
    process: [
      "Raise awareness through outreaches, schools and community groups.",
      "Offer psychosocial support and identify people who need more help.",
      "Refer to Suubi Medical Centre or specialist services.",
      "Follow up with individuals and families.",
    ],
    tags: ["Mental health", "Psychosocial support", "Stigma reduction"],
  },
  {
    slug: "community-health-systems-strengthening",
    focus: "Health Systems",
    title: "Community Health Systems Strengthening",
    shortTitle: "Health Systems",
    category: "Community Health Systems",
    description:
      "Working with communities, local leaders and health facilities so that health services are closer, better connected and more responsive.",
    overview:
      "Lasting improvements in health depend on strong local systems. BHI works with community members, local leaders and health facilities in Kayunga District to strengthen the link between communities and healthcare, so that information, screening and referrals reach the people who need them.",
    features: [
      { title: "Community outreaches", description: "Taking health education, screening and referral services to villages far from health facilities." },
      { title: "Referral pathways", description: "Connecting community outreach to clinical care at Suubi Medical Centre and other facilities." },
      { title: "Local capacity", description: "Supporting community members and volunteers with health knowledge and practical skills." },
      { title: "Working with local structures", description: "Coordinating with local leaders and health facilities so our work complements existing services." },
    ],
    benefits: ["Care brought closer to communities", "Smoother referrals between community and facility", "Stronger local health knowledge", "Services that respond to local needs"],
    process: [
      "Listen to communities and local leaders to understand priorities.",
      "Plan outreaches and referral routes with local health facilities.",
      "Deliver education, screening and referrals in the community.",
      "Review what worked and adjust together.",
    ],
    tags: ["Outreach", "Referrals", "Community health"],
  },
  {
    slug: "research",
    focus: "Research",
    title: "Research",
    shortTitle: "Research",
    category: "Research",
    description:
      "Learning from our work and our communities to understand local health needs and improve how services are delivered.",
    overview:
      "Good programmes start with understanding the people they serve. BHI uses what we learn from outreaches, screening and community feedback to understand health needs in Kayunga District and to improve our programmes over time.",
    features: [
      { title: "Understanding community needs", description: "Listening to communities and gathering information on their health needs and barriers to care." },
      { title: "Learning from programme data", description: "Reviewing outreach, screening and referral records to see what is working and what needs to change." },
      { title: "Evidence for decisions", description: "Using what we learn to plan services, set priorities and inform partners." },
      { title: "Ethical practice", description: "Respecting consent and confidentiality whenever information is collected from community members." },
    ],
    benefits: ["Programmes shaped by local evidence", "Better use of limited resources", "Clearer reporting to partners", "Community voices in decision-making"],
    process: [
      "Agree what we need to learn and why.",
      "Collect information with consent and protect confidentiality.",
      "Analyse findings with the programme team.",
      "Share results and use them to improve services.",
    ],
    tags: ["Research", "Learning", "Evidence"],
  },
];

export function getCoreProgram(slug: string): CoreProgram | undefined {
  return CORE_PROGRAMS.find((p) => p.slug === slug);
}

function areaFor(program: CoreProgram) {
  return FOCUS_AREAS.find((a) => a.short === program.focus);
}

/** The published admin service that replaces this built-in page, if any. */
export function convexOverride<T extends ServiceLike>(program: CoreProgram, services: T[] | undefined): T | undefined {
  const area = areaFor(program);
  return area ? findServiceForArea(area, services) : undefined;
}

/** Built-in programmes that admins have not yet replaced with a Convex service. */
export function unclaimedCorePrograms(services: ServiceLike[] | undefined): CoreProgram[] {
  return CORE_PROGRAMS.filter((p) => !convexOverride(p, services));
}

/** Links to every live area of work (Convex services first, then unclaimed built-in programmes). */
export function allServiceLinks(
  services: (ServiceLike & { heroImage?: string; images?: string[] })[] | undefined,
): ServiceLink[] {
  const fromConvex = (services ?? []).map((s) => ({
    key: s._id,
    href: `/services/${s._id}`,
    title: s.title,
    category: s.category,
    image: s.heroImage || s.images?.[0],
  }));
  const fromStatic = unclaimedCorePrograms(services).map((p) => ({
    key: p.slug,
    href: `/services/${p.slug}`,
    title: p.title,
    category: p.category,
  }));
  return [...fromConvex, ...fromStatic];
}
