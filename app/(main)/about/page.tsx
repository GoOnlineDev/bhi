import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Target,
  Users,
  Globe,
  Award,
  CheckCircle,
  AlertTriangle,
  Baby,
  Brain,
  ShieldAlert,
  Pill,
  ArrowRight,
  TrendingUp,
  Lightbulb,
  HandHeart,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
};

const missionData = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To improve youth health outcomes and empower communities through evidence-based interventions in Sexual & Reproductive Health Rights, Non-Communicable Diseases, Gender-Based Violence response, and Substance Abuse recovery.",
  },
  {
    icon: Lightbulb,
    title: "Our Vision",
    description: "A Uganda where every young person has access to quality healthcare, protection from violence, and the holistic support needed to build healthy, productive lives — and in turn, stronger communities.",
  },
  {
    icon: Users,
    title: "Our Approach",
    description: "We combine clinical services with community-led outreach, psychosocial support, and referral networks — meeting young people where they are and addressing health challenges at their root causes.",
  },
];

const crisisStats = [
  { value: "1 in 4", label: "adolescent girls in Uganda", context: "becomes pregnant before age 18" },
  { value: "6,200+", label: "teenage pregnancies", context: "recorded in our districts during COVID-19 lockdown alone" },
  { value: "70%", label: "of GBV survivors", context: "in rural Uganda never access formal support or justice" },
  { value: "80%+", label: "of youth with NCDs", context: "like sickle cell and epilepsy lack consistent access to care" },
];

const pillars = [
  {
    id: "srhr",
    icon: Heart,
    color: "bg-rose-500",
    lightColor: "bg-rose-50",
    textColor: "text-rose-600",
    borderColor: "border-rose-200",
    title: "Sexual & Reproductive Health Rights (SRHR)",
    urgency: "Uganda has one of the highest adolescent pregnancy rates in Africa. Access to reproductive healthcare remains limited in rural districts.",
    services: [
      "Family Planning education & contraceptive services",
      "Post-Abortion Care (PAC)",
      "Teenage pregnancy prevention & support",
      "STI screening, treatment & education",
      "Cervical cancer screening",
      "Safe motherhood support",
    ],
  },
  {
    id: "ncd-management",
    icon: Brain,
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    borderColor: "border-indigo-200",
    title: "Non-Communicable Diseases (NCDs)",
    urgency: "NCDs are rising among Uganda's youth. Mental health, sickle cell, diabetes, and epilepsy often go undiagnosed and untreated in rural communities.",
    services: [
      "Mental health counseling & psychosocial support",
      "Sickle Cell Disease management & education",
      "Diabetes & Hypertension screening and care",
      "Obesity prevention programs",
      "Epilepsy management & community awareness",
      "NCD patient support groups",
    ],
  },
  {
    id: "gbv-support",
    icon: ShieldAlert,
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    title: "Gender-Based Violence (GBV) Response",
    urgency: "GBV remains pervasive in Uganda's rural communities — yet most survivors never access support. BHI provides structured, compassionate pathways to justice and healing.",
    services: [
      "Trauma-informed psychosocial counseling",
      "Court support & legal referrals",
      "Probation & welfare coordination",
      "Survivor case management",
      "Community GBV awareness campaigns",
      "Safe reporting channels for youth",
    ],
  },
  {
    id: "substance-abuse",
    icon: Pill,
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
    title: "Substance Abuse Prevention & Recovery",
    urgency: "Youth substance abuse is escalating across Uganda, fueled by poverty, trauma, and limited mental health services. BHI addresses both prevention and recovery.",
    services: [
      "Youth substance abuse education & training",
      "Individual & group counseling",
      "Recovery support (Adaptation programs)",
      "Community-based rehabilitation",
      "Family counseling & reintegration support",
      "Peer-led prevention campaigns",
    ],
  },
];

const achievements = [
  { number: "4", label: "Districts Served", description: "Kayunga, Mukono, Kamuli, & Buyende" },
  { number: "15M+", label: "Students Affected", description: "By COVID-19 school closures — a crisis we responded to" },
  { number: "6,200+", label: "Teen Pregnancies", description: "Addressed during the lockdown period" },
  { number: "2,000+", label: "Child Mothers", description: "Supported to overcome health risks since 2021" },
];

const testimonials = [
  {
    name: "Dr Mpooya Simon Suubi",
    role: "Director, Boost Health Initiative",
    content: "At Boost Health Initiative, we are dedicated to providing accessible, quality healthcare and empowering communities across Uganda. From maternal and child health to adolescent support and health education, our programs are designed to create lasting impact and brighter futures for all.",
    image: '/img/dr1.jpg'
  },
  {
    name: "Dr. John",
    role: "Doctor at Suubi Medical Centre",
    content: "As a doctor at Suubi Medical Centre — a hospital program from Boost Health Initiative supporting our community — I have witnessed firsthand how their partnership has been instrumental in improving health outcomes in rural areas. Their dedication to community health is truly remarkable.",
    image: '/img/dr2.jpg'
  }
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
    <main>
      {/* Hero Section */}
      <section id="about-hero" aria-labelledby="about-hero-heading" className="bg-background">
        <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
          <Badge variant="outline" className="mb-6">
            <Heart className="w-4 h-4 mr-2" />
            About Our Mission
          </Badge>
          <h1 id="about-hero-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Transforming Youth Health in Uganda
          </h1>
          <p className="text-2xl font-semibold text-primary mb-4">Healthy Minds, Strong Communities.</p>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Boost Health Initiative (BHI) is a Uganda-based nonprofit dedicated to improving health outcomes
            for young people by tackling the four most pressing youth health challenges: unmet Sexual &
            Reproductive Health Rights, Non-Communicable Diseases, Gender-Based Violence, and Substance
            Abuse — through community-driven programs rooted in dignity and evidence.
          </p>
        </div>
      </section>

      {/* The Crisis — Why This Work Matters Now */}
      <section id="the-crisis" aria-labelledby="crisis-heading" className="bg-primary text-white">
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <AlertTriangle className="w-4 h-4 mr-2" />
              The Crisis We Are Addressing
            </Badge>
            <h2 id="crisis-heading" className="text-3xl md:text-4xl font-bold mb-4">
              Why This Work Is Urgent Right Now
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              In Kayunga and surrounding districts, young people face compounding health crises with
              nowhere to turn. The numbers speak for themselves.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {crisisStats.map(({ value, label, context }) => (
              <div key={label} className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/20">
                <p className="text-4xl font-bold text-white mb-2">{value}</p>
                <p className="font-semibold text-white/90 mb-1">{label}</p>
                <p className="text-sm text-white/70">{context}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Vision / Approach */}
      <section id="our-approach" aria-labelledby="our-approach-heading" className="bg-secondary">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-6">
              <Target className="w-4 h-4 mr-2" />
              Who We Are
            </Badge>
            <h2 id="our-approach-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Mission, Vision & Approach
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {missionData.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="text-center bg-background shadow-lg border-0">
                <CardHeader className="items-center pb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl mb-6 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-foreground">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Section */}
      <section id="focus-areas" aria-labelledby="focus-areas-heading" className="bg-background">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              What We Do
            </Badge>
            <h2 id="focus-areas-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Four Core Focus Areas
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Every BHI program is built around one of four health challenges that disproportionately
              affect Uganda&apos;s youth — and for which community-based intervention can make a lasting
              difference.
            </p>
          </div>

          <div className="space-y-10">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.id}
                  className={`grid md:grid-cols-2 gap-8 items-start rounded-2xl p-8 ${pillar.lightColor} border ${pillar.borderColor}`}
                >
                  <div className={index % 2 === 1 ? "md:order-last" : ""}>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${pillar.color} text-white text-sm font-semibold mb-4`}>
                      <Icon className="w-4 h-4" />
                      Pillar {index + 1}
                    </div>
                    <h3 className={`text-2xl font-bold mb-3 ${pillar.textColor}`}>{pillar.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed italic border-l-4 border-current pl-4" style={{ borderColor: 'currentColor' }}>
                      {pillar.urgency}
                    </p>
                    <Link href={`/services`}>
                      <Button variant="outline" className={`${pillar.textColor} border-current hover:bg-current hover:text-white transition-colors`}>
                        Explore This Pillar <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Services under this pillar:</h4>
                    <ul className="space-y-2">
                      {pillar.services.map((service) => (
                        <li key={service} className="flex items-start gap-3">
                          <CheckCircle className={`w-5 h-5 ${pillar.textColor} flex-shrink-0 mt-0.5`} />
                          <span className="text-foreground text-sm">{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements / Impact Section */}
      <section id="achievements" aria-labelledby="achievements-heading" className="bg-secondary">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-6">
              <Award className="w-4 h-4 mr-2" />
              Our Impact
            </Badge>
            <h2 id="achievements-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Measurable Results in Our Communities
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Demonstrating our commitment to improving health outcomes and empowering communities
              through data-driven, sustained impact.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map(({ number, label, description }) => (
              <Card key={label} className="text-center bg-background border-0 shadow-lg">
                <CardContent className="p-6">
                  <p className="text-5xl font-bold text-primary mb-2">{number}</p>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{label}</h3>
                  <p className="text-muted-foreground text-sm">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" aria-labelledby="testimonials-heading" className="bg-background">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-6">
              <Users className="w-4 h-4 mr-2" />
              Voices from Our Community
            </Badge>
            <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The People Behind BHI
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Hear from the dedicated health professionals who make our mission possible every day.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map(({ name, role, content, image }) => (
              <Card key={name} className="bg-secondary shadow-lg border-0">
                <CardContent className="p-8">
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

      {/* UN SDG Alignment */}
      <section id="sdg-goals" aria-labelledby="sdg-goals-heading" className="bg-secondary">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-6">
              <Globe className="w-4 h-4 mr-2" />
              UN SDG Alignment
            </Badge>
            <h2 id="sdg-goals-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Contributing to Global Goals
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
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

      {/* Fund Our Work CTA */}
      <section id="fund-our-work" aria-labelledby="fund-cta-heading" className="bg-background">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="bg-primary rounded-3xl p-10 md:p-16 text-white text-center max-w-5xl mx-auto">
            <HandHeart className="w-14 h-14 mx-auto mb-6 opacity-90" />
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Award className="w-4 h-4 mr-2" />
              Partner With BHI
            </Badge>
            <h2 id="fund-cta-heading" className="text-3xl md:text-4xl font-bold mb-6">
              Your Investment Changes Lives
            </h2>
            <p className="text-xl text-white/85 max-w-3xl mx-auto mb-4 leading-relaxed">
              BHI operates in some of Uganda&apos;s most underserved communities, where youth face compounding
              health crises with inadequate support. Funding our programs enables us to expand our reach,
              train more community health workers, and provide services that no one else is delivering.
            </p>
            <p className="text-lg text-white/75 max-w-2xl mx-auto mb-10">
              Whether through direct funding, partnerships, in-kind support, or technical collaboration —
              your contribution has a measurable, lasting impact on young people&apos;s lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8" asChild>
                <Link href="/contact">Become a Partner</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8" asChild>
                <Link href="/programs">See Our Programs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
