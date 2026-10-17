import Link from "next/link";
import { SUUBI_URL } from "@/lib/site-content";

const paragraphs = [
  "In the rural communities of Kayunga District, Uganda, access to healthcare has never been just about the existence of health facilities. For many families, distance, financial hardship, limited health information, and missed opportunities for early diagnosis can stand between them and a healthier life. For young people, mothers, and vulnerable families, these barriers can have lifelong consequences.",
  "It was against this reality that Mr Simon Mpooya envisioned a different approach to community health. In 2020, this vision gave birth to Boost Health Initiative (BHI), founded on a simple but powerful belief: communities should not be left behind because of where they live or what they can afford.",
  "The name Boost Health Initiative reflects this founding vision—to do more than respond to illness, but to actively boost the health, knowledge, and wellbeing of communities. It represents our commitment to bringing healthcare closer to people, strengthening prevention, promoting health awareness, and connecting underserved families to essential services.",
];

const afterSuubi = [
  "Our journey is driven by the understanding that healthier communities begin when people have the knowledge, opportunities, and support to protect their health.",
  "We are Boost Health Initiative—not simply because we provide health services, but because we believe in boosting the potential of every person and every community to live a healthier life.",
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
              A Vision Born in the Community. A Mission to Boost Health.
            </p>
          </div>
          <div className="space-y-5">
            {paragraphs.map((text) => (
              <p key={text.slice(0, 24)} className={pClass}>{text}</p>
            ))}
            <p className={pClass}>
              Rooted in Kayunga, BHI has continued to pursue practical, community-centred solutions that bridge the gap
              between rural communities and healthcare systems. Through community outreaches, health education,
              screening, referrals, partnerships, and our clinical platform,{" "}
              <Link href={SUUBI_URL} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold underline-offset-4 hover:underline">
                Suubi Medical Centre
              </Link>
              , we are working to make healthcare more accessible and responsive to the realities of the people we serve.
            </p>
            {afterSuubi.map((text) => (
              <p key={text.slice(0, 24)} className={pClass}>{text}</p>
            ))}
          </div>
          <p className="mt-8 sm:mt-10 border-l-4 border-primary pl-4 text-lg sm:text-2xl font-bold text-foreground italic">
            Born in Kayunga. Driven by Community. Built to Boost Health.
          </p>
        </div>
      </div>
    </section>
  );
}
