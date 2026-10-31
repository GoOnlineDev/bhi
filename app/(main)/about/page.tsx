import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  Users,
  Globe,
  Award,
  AlertTriangle,
  Lightbulb,
  HandHeart,
  MapPin,
  Baby,
  ShieldAlert,
  Activity,
  Briefcase,
  Wrench,
  FlaskConical,
  GraduationCap,
  Coins,
  Handshake,
  Network,
  Stethoscope,
  CheckCircle,
  ExternalLink,
  Compass,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from "next";
import { AboutFocusAreasSection } from "./_components/about-focus-areas";
import { AboutHeroFocusAreas } from "./_components/about-dynamic-blurbs";
import { AboutStorySection } from "./_components/about-story";
import { APPROACH, CORE_VALUES, IMPACT_STATS, MISSION, POSITIONING, SUUBI_URL, VISION } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "About Us",
  description: "Boost Health Initiative is a community-focused health organisation in Kayunga District, Uganda, bringing healthcare closer to underserved communities and strengthening the systems, partnerships and community capacities needed for lasting health improvements.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

const missionVision = [
  { icon: Target, title: "Our Mission", description: MISSION },
  { icon: Lightbulb, title: "Our Vision", description: VISION },
];

const communityChallenges = [
  { icon: MapPin, title: "Distance and cost", text: "Many families in rural Kayunga live far from health facilities, and the cost of travel and care delays treatment." },
  { icon: Baby, title: "Mothers, children and adolescents", text: "Teenage pregnancy remains common, and many mothers miss antenatal and postnatal care, putting them and their babies at risk." },
  { icon: ShieldAlert, title: "Violence and silence", text: "Survivors of gender-based violence in rural communities often struggle to reach care, protection and justice." },
  { icon: Activity, title: "Illness found too late", text: "Limited screening and delayed healthcare-seeking mean that many conditions are identified only when they become severe." },
];

const testimonials = [
  {
    name: "Dr Simon Mpoya",
    role: "Founder & Director, Boost Health Initiative",
    content: "At Boost Health Initiative, we are dedicated to bringing quality healthcare closer to underserved communities. From community outreaches and screening to health education and referrals, our work is designed to create lasting impact and healthier futures for the families we serve.",
    image: '/img/dr1.jpg'
  },
  {
    name: "Dr. John",
    role: "Doctor at Suubi Medical Centre, a BHI partner",
    content: "Through our partnership with Boost Health Initiative, I have seen firsthand how community outreach and timely referral improve health outcomes in rural areas. Their dedication to community health is truly remarkable.",
    image: '/img/dr2.jpg'
  }
];

const partnershipTypes = [
  { icon: Briefcase, title: "Programmatic partnerships", text: "Joint implementation of community health programs and medical outreaches." },
  { icon: Wrench, title: "Technical partnerships", text: "Sharing expertise, technical assistance and professional support." },
  { icon: FlaskConical, title: "Research collaboration", text: "Community-based research, health assessments and implementation research." },
  { icon: GraduationCap, title: "Capacity building", text: "Training, mentorship and strengthening the capacity of community health structures." },
  { icon: Coins, title: "Resource mobilisation", text: "Financial support, medical supplies, equipment and logistical support." },
  { icon: Lightbulb, title: "Innovation", text: "Development and testing of sustainable community healthcare delivery models." },
];

const whyPartner = [
  "Established community engagement and outreach experience in Kayunga.",
  "Existing connections with local healthcare structures.",
  "Experience reaching underserved rural populations.",
  "A community-centred approach to healthcare delivery.",
  "An opportunity to implement and evaluate interventions in real-world rural settings.",
];

const waysToGetInvolved = [
  { icon: Handshake, title: "Partner with us", text: "Collaborate in implementing impactful community health interventions.", href: "/contact?type=partner" },
  { icon: HandHeart, title: "Support our programs", text: "Provide financial or in-kind support for community health initiatives.", href: "/contact?type=partner" },
  { icon: Users, title: "Volunteer", text: "Contribute your professional skills, time and expertise.", href: "/contact?type=volunteer" },
  { icon: FlaskConical, title: "Research with us", text: "Collaborate on community health research and learning.", href: "/contact?type=partner" },
  { icon: Network, title: "Join our network", text: "Connect with BHI and explore opportunities to make a difference.", href: "/contact" },
];

const sdgTargets = [
  { target: "SDG 3", title: "Good Health & Well-being", description: "Universal health coverage, NCD reduction, and mental health promotion" },
  { target: "SDG 4", title: "Quality Education", description: "Keeping adolescents in school through health & pregnancy prevention" },
  { target: "SDG 5", title: "Gender Equality", description: "Eliminating GBV and harmful practices against women and girls" },
  { target: "SDG 16", title: "Peace & Justice", description: "Strengthening GBV reporting, legal access, and community safety" },
  { target: "SDG 17", title: "Partnerships for Goals", description: "Building collaborative networks for sustainable community health" },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section id="about-hero" aria-labelledby="about-hero-heading" className="bg-background">
        <div className="container mx-auto px-4 py-10 sm:py-16 lg:py-24 text-center">
          <h1 id="about-hero-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Bringing Healthcare Closer to Underserved Communities
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-6">{POSITIONING}</p>
          <AboutHeroFocusAreas />
        </div>
      </section>

      <AboutStorySection />

      {/* The Crisis — Why This Work Matters Now */}
      <section id="the-crisis" aria-labelledby="crisis-heading" className="bg-primary text-white">
        <div className="container mx-auto px-4 py-10 sm:py-16 lg:py-20">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <AlertTriangle className="w-4 h-4 mr-2" />
              The Challenges We Address
            </Badge>
            <h2 id="crisis-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Why This Work Matters
            </h2>
            <p className="text-base sm:text-xl text-white/80 max-w-3xl mx-auto">
              Healthcare challenges in underserved communities extend beyond the availability of medical
              facilities. They include limited health information, financial barriers, delayed
              healthcare-seeking, inadequate screening services and difficulties accessing timely diagnosis
              and treatment.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityChallenges.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/20">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-white" aria-hidden />
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">{title}</h3>
                <p className="text-sm text-white/85 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section id="mission-vision" aria-labelledby="mission-vision-heading" className="bg-secondary">
        <div className="container mx-auto px-4 py-10 sm:py-16 lg:py-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-6">
              <Target className="w-4 h-4 mr-2" />
              Who We Are
            </Badge>
            <h2 id="mission-vision-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 break-words">
              Vision, Mission &amp; Values
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12">
            {missionVision.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="h-full text-center bg-background shadow-lg border-0 md:text-left">
                <CardHeader className="items-center md:items-start pt-6 pb-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-4 flex items-center justify-center mx-auto md:mx-0 shrink-0">
                    <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" aria-hidden />
                  </div>
                  <CardTitle className="text-2xl text-foreground w-full">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-6">Our Core Values</h3>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {CORE_VALUES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4 bg-background rounded-2xl p-5 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" aria-hidden />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Approach + Geographical focus */}
      <section id="our-approach" aria-labelledby="our-approach-heading" className="bg-background">
        <div className="container mx-auto px-4 py-10 sm:py-16 lg:py-24">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
            <div className="lg:col-span-3">
              <Badge variant="outline" className="mb-6">
                <Compass className="w-4 h-4 mr-2" />
                Our Approach
              </Badge>
              <h2 id="our-approach-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8">
                How We Work
              </h2>
              <ol className="space-y-5">
                {APPROACH.map(({ title, text }, i) => (
                  <li key={title} className="flex gap-4">
                    <span className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <aside className="lg:col-span-2 rounded-2xl bg-secondary p-6 sm:p-8 self-start" aria-labelledby="geo-focus-heading">
              <MapPin className="w-8 h-8 text-primary mb-4" aria-hidden />
              <h2 id="geo-focus-heading" className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                Our Geographical Focus
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                BHI is based in Kayunga District in central Uganda, with a focus on underserved rural
                communities in Kayunga and neighbouring districts. Rural geography, dispersed settlements,
                and fishing, farming and livestock-keeping communities present distinct healthcare needs.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We intend to progressively expand our reach through partnerships, coordinated community
                health interventions and scalable service delivery approaches.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <AboutFocusAreasSection />

      {/* Achievements / Impact Section */}
      <section id="impact" aria-labelledby="achievements-heading" className="bg-secondary">
        <div className="container mx-auto px-4 py-10 sm:py-16 lg:py-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-6">
              <Award className="w-4 h-4 mr-2" />
              Our Impact
            </Badge>
            <h2 id="achievements-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 break-words">
              Making a Difference in Communities
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
              Every individual deserves access to essential healthcare services and reliable health
              information. Through our previous community health interventions, BHI has reported the
              following achievements.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {IMPACT_STATS.map(({ value, label }) => (
              <Card key={label} className="text-center bg-background border-0 shadow-lg">
                <CardContent className="p-6">
                  <p className="text-4xl font-bold text-primary mb-2">{value}</p>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mt-10">
            Beyond these numbers, our work reflects the importance of reaching underserved populations,
            improving health awareness and connecting individuals to appropriate healthcare services.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" aria-labelledby="testimonials-heading" className="bg-background">
        <div className="container mx-auto px-4 py-10 sm:py-16 lg:py-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-6">
              <Users className="w-4 h-4 mr-2" />
              Voices from Our Community
            </Badge>
            <h2 id="testimonials-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 break-words">
              The People Behind BHI
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
              Hear from the people and partners who make our mission possible every day.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map(({ name, role, content, image }) => (
              <Card key={name} className="bg-secondary shadow-lg border-0">
                <CardContent className="p-5 sm:p-8">
                  <div className="flex items-center mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                      <Image
                        src={image}
                        alt={`Portrait of ${name}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">{name}</h4>
                      <p className="text-primary font-medium">{role}</p>
                    </div>
                  </div>
                  <blockquote className="text-muted-foreground leading-relaxed italic text-lg border-l-4 border-primary/30 pl-4">
                    &ldquo;{content}&rdquo;
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section id="partnerships" aria-labelledby="partnerships-heading" className="bg-background">
        <div className="container mx-auto px-4 py-10 sm:py-16 lg:py-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-6">
              <Handshake className="w-4 h-4 mr-2" />
              Partnerships &amp; Collaborations
            </Badge>
            <h2 id="partnerships-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 break-words">
              Working Together for Better Health Outcomes
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
              No single organisation can address the complex health challenges affecting underserved
              communities alone. BHI welcomes partnerships with local and international organisations,
              government institutions, healthcare providers, academic institutions, researchers,
              foundations and corporate partners.
            </p>
          </div>

          <div className="rounded-3xl border-2 border-primary/20 bg-primary/5 p-6 sm:p-10 mb-12 grid md:grid-cols-[auto_1fr] gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center">
              <Stethoscope className="w-7 h-7" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-1">Clinical partner</p>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">Suubi Medical Centre</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Suubi Medical Centre is a 24-hour healthcare facility in Kayunga and a partner of Boost Health
                Initiative. It provides clinical consultations, diagnostics, preventive care and continuity of
                care for people identified and referred through BHI&apos;s community outreaches.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Together, we link community-based health interventions with facility-based clinical care, so that
                people reached in their communities can access timely diagnosis and treatment.
              </p>
              <Link
                href={SUUBI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
              >
                Visit Suubi Medical Centre <ExternalLink className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          </div>

          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
            {partnershipTypes.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-2xl bg-secondary p-5">
                <Icon className="w-6 h-6 text-primary mb-3" aria-hidden />
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </li>
            ))}
          </ul>

          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-5 text-center">Why Partner With BHI?</h3>
            <ul className="space-y-3">
              {whyPartner.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <div className="text-center mt-8">
              <Link
                href="/contact?type=partner"
                className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Let&apos;s explore opportunities for collaboration
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* UN SDG Alignment */}
      <section id="sdg-goals" aria-labelledby="sdg-goals-heading" className="bg-secondary">
        <div className="container mx-auto px-4 py-10 sm:py-16 lg:py-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-6">
              <Globe className="w-4 h-4 mr-2" />
              UN SDG Alignment
            </Badge>
            <h2 id="sdg-goals-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 break-words">
              Contributing to Global Goals
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
              BHI&apos;s work directly advances five of the United Nations Sustainable Development Goals,
              making every investment a contribution to the global development agenda.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sdgTargets.map(({ target, title, description }) => (
              <div key={target} className="flex items-start gap-4 bg-background p-6 rounded-2xl shadow-sm">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                  {target}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                  <p className="text-muted-foreground text-sm">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section id="get-involved" aria-labelledby="fund-cta-heading" className="bg-background">
        <div className="container mx-auto px-4 py-10 sm:py-16 lg:py-24">
          <div className="bg-primary rounded-3xl p-6 sm:p-10 md:p-16 text-white max-w-6xl mx-auto">
            <div className="text-center">
              <HandHeart className="w-14 h-14 mx-auto mb-6 opacity-90" />
              <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                <Award className="w-4 h-4 mr-2" />
                Get Involved
              </Badge>
              <h2 id="fund-cta-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
                Be Part of the Change
              </h2>
              <p className="text-base sm:text-xl text-white/85 max-w-3xl mx-auto mb-10 leading-relaxed">
                Improving healthcare access requires collective commitment. There are several ways to
                contribute to our work.
              </p>
            </div>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {waysToGetInvolved.map(({ icon: Icon, title, text, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="block h-full rounded-2xl bg-white/10 border border-white/20 p-5 hover:bg-white/20 transition-colors"
                  >
                    <Icon className="w-6 h-6 mb-3" aria-hidden />
                    <h3 className="font-semibold mb-1">{title}</h3>
                    <p className="text-sm text-white/80 leading-relaxed">{text}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap mt-10">
              <Link
                href="/contact?type=partner"
                className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-semibold bg-white text-primary hover:bg-gray-100 transition-colors"
              >
                Become a Partner
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-semibold border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary transition-colors"
              >
                See Our Programs
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-semibold border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary transition-colors"
              >
                Explore What We Do
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
