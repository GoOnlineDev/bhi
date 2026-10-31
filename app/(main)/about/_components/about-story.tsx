import Link from "next/link";
import { BELIEF, SUUBI_URL } from "@/lib/site-content";

const paragraphs = [
  "Healthcare inequalities remain a significant challenge for many rural communities in Uganda. In Kayunga District and neighbouring communities, many people live far from healthcare facilities and face challenges accessing timely medical attention, preventive services and reliable health information.",
  "For some, healthcare is sought only when illness becomes severe. Others live with undiagnosed conditions or lack the information necessary to make informed health decisions.",
  "These realities inspired Dr Simon Mpoya to establish Boost Health Initiative (BHI) in 2020. He envisioned an organisation that would go beyond conventional healthcare delivery by actively engaging communities, taking essential services closer to people and working with healthcare providers and other stakeholders to address barriers to healthcare access.",
  "The name reflects that vision: to do more than respond to illness, and to actively boost the health, knowledge and wellbeing of communities.",
];

const afterSuubi = [
  "Today we work at the intersection of community health, clinical service delivery, health education and health systems strengthening, bridging the gap between communities and the healthcare system.",
];

const pClass = "text-base sm:text-lg text-muted-foreground leading-relaxed";

export function AboutStorySection() {
  return (
    <section id="our-story" aria-labelledby="our-story-heading" className="bg-secondary">
      <div className="container mx-auto px-4 py-10 sm:py-16 lg:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h2 id="our-story-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              Our Story
            </h2>
            <p className="text-lg sm:text-xl font-semibold text-primary">
              Born in Kayunga. Driven by Community. Built to Boost Health.
            </p>
          </div>
          <div className="space-y-5">
            {paragraphs.map((text) => (
              <p key={text.slice(0, 24)} className={pClass}>{text}</p>
            ))}
            <p className={pClass}>
              Over time, BHI has undertaken community health outreaches, health education activities, screening
              initiatives, referrals and other interventions addressing priority health challenges, working
              alongside partners including{" "}
              <Link href={SUUBI_URL} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold underline-offset-4 hover:underline">
                Suubi Medical Centre
              </Link>
              , which provides clinical care for many of the people we reach.
            </p>
            {afterSuubi.map((text) => (
              <p key={text.slice(0, 24)} className={pClass}>{text}</p>
            ))}
          </div>
          <figure className="mt-8 sm:mt-10 border-l-4 border-primary pl-4">
            <figcaption className="text-sm font-semibold uppercase tracking-wider text-primary mb-1">Our Belief</figcaption>
            <blockquote className="text-lg sm:text-2xl font-bold text-foreground italic">{BELIEF}</blockquote>
          </figure>
        </div>
      </div>
    </section>
  );
}
