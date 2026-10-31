import Link from "next/link";
import SmartImage from "@/components/ui/smart-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Droplets, Fish, MapPin, Sprout, Users, Waves } from "lucide-react";

const geography = [
  { icon: Waves, title: "River Nile to the east", text: "A defining boundary that shapes movement and access to services." },
  { icon: Droplets, title: "Lake Kyoga to the north", text: "Alongside wetlands and other freshwater systems across the district." },
  { icon: Fish, title: "Water-dependent livelihoods", text: "Fishing, farming and cattle keeping bring frequent contact with water and wetlands." },
  { icon: Users, title: "A large youthful population", text: "Young people make up a significant share of the communities we serve." },
];

export default function IntroSection() {
  return (
    <section className="bg-secondary" aria-labelledby="intro-heading">
      <div className="container mx-auto px-4 py-10 sm:py-16 lg:py-20 space-y-16 lg:space-y-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="flex flex-col gap-5">
            <Badge variant="outline" className="self-start">Introduction</Badge>
            <h2 id="intro-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Who We Are
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Boost Health Initiative (BHI) is a not-for-profit organisation based in Kayunga District, Uganda,
              responding to persistent gaps in access to quality health services among underserved communities.
              We serve more than 12,000 community members each year within Kayunga and surrounding districts.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              BHI&apos;s work is guided by <span className="font-semibold text-foreground">community empowerment</span>:
              enabling people to understand health risks, seek timely services and participate actively in
              decisions affecting their health by strengthening the capacity of individuals, families and
              community structures to prevent disease, seek care early and maintain continuity of treatment.
            </p>
            <blockquote className="border-l-4 border-primary pl-4 text-base sm:text-lg font-medium text-foreground italic">
              We believe that access to quality healthcare should not be determined by where someone lives or
              their ability to afford medical services.
            </blockquote>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button asChild>
                <Link href="/services">
                  Explore what we do <ArrowRight className="w-4 h-4 ml-2" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/about">About BHI</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <SmartImage
                src="/img/dr8.jpg"
                alt="Boost Health Initiative team working with community members in Kayunga."
                wrapperClassName="absolute inset-0"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 left-4 sm:left-6 rounded-xl bg-background border shadow-lg px-5 py-4">
              <p className="text-2xl sm:text-3xl font-bold text-primary leading-none">12,000+</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">community members reached each year</p>
            </div>
          </div>
        </div>

        <section aria-labelledby="kayunga-heading">
          <div className="max-w-3xl mb-10">
            <Badge variant="outline" className="mb-4">
              <MapPin className="w-3.5 h-3.5 mr-1" aria-hidden />
              Geographical Coverage and Context
            </Badge>
            <h2 id="kayunga-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Kayunga District
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Kayunga District is the core implementation area for BHI. It is a unique but highly underserved
              rural district in central-eastern Uganda. The district is geographically distinctive: the River
              Nile lies to the east and Lake Kyoga to the north, alongside wetlands and other freshwater
              systems. These water bodies sustain livelihoods, but also shape patterns of mobility,
              sanitation, disease exposure and access to health services.
            </p>
          </div>

          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {geography.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-2xl bg-background border p-5 h-full">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" aria-hidden />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border-l-4 border-primary bg-background p-6 sm:p-8 flex gap-4">
            <Sprout className="w-6 h-6 text-primary flex-shrink-0 mt-1" aria-hidden />
            <p className="text-base text-foreground leading-relaxed">
              A large proportion of residents depend on fishing, farming and cattle keeping, with livelihoods
              often requiring frequent interaction with water, wetlands and remote rural environments. The
              district also has a large youthful population. This combination of youth, rural livelihoods and
              water-dependent communities creates a unique health environment in which infectious diseases,
              neglected tropical diseases, reproductive-health challenges and social vulnerabilities can
              overlap.
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}
