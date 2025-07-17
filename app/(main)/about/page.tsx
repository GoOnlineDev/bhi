'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Target, Users, Globe, Award, CheckCircle } from 'lucide-react';
import Image from 'next/image';

const missionData = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To improve health outcomes and empower communities through evidence-based interventions and sustainable healthcare solutions.",
  },
  {
    icon: Users,
    title: "Our Approach",
    description: "Community-centered programs that address root causes of health disparities while building local capacity and leadership.",
  },
  {
    icon: Globe,
    title: "Our Impact",
    description: "Serving multiple districts in Uganda with programs that have reached thousands of individuals and families.",
  }
];

const achievements = [
  { number: "4", label: "Districts Served", description: "Kayunga, Mukono, Kamuli, & Buyende" },
  { number: "15M+", label: "Students Returned", description: "After COVID-19 school closures" },
  { number: "6,200+", label: "Teen Pregnancies", description: "Addressed during lockdown" },
  { number: "2,000+", label: "Child Mothers", description: "Helped overcome mortality since 2021" }
];

const testimonials = [
  {
    name: "Sarah Nakato",
    role: "Community Health Worker",
    content: "BHI has transformed our community's approach to healthcare. The training and support we received has enabled us to help hundreds of families.",
    image: '/img/dr1.jpg'
  },
  {
    name: "Dr. James Mukasa",
    role: "Regional Health Director",
    content: "The partnership with Boost Health Initiative has been instrumental in improving health outcomes in rural areas. Their dedication is remarkable.",
    image: '/img/dr2.jpg'
  }
];

const sdgTargets = [
  { target: "3.1", description: "Reduce maternal mortality" },
  { target: "5.3", description: "Eliminate harmful practices against women" }
];

export default function AboutPage() {
  useEffect(() => {
    document.title = "About Boost Health Initiative | Healthcare in Kayunga, Uganda";
    const metaDescription = document.querySelector('meta[name="description"]');
    const content = "Learn about Boost Health Initiative's mission to improve health outcomes in Kayunga, Uganda through community-centered healthcare programs and sustainable solutions.";
    if (metaDescription) {
      metaDescription.setAttribute('content', content);
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = content;
      document.head.appendChild(meta);
    }
    // Structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'bhi-org-jsonld';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Boost Health Initiative",
      "url": "https://www.boosthealthinitiative.org",
      "logo": "https://www.boosthealthinitiative.org/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+256-772-670-744",
        "contactType": "Customer service"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Level 1 Ssebowa House, Plot 1 Ssekajja Road",
        "addressLocality": "Kayunga",
        "addressRegion": "Central Uganda",
        "postalCode": "0000",
        "addressCountry": "UG"
      }
    });
    // Remove old script if exists
    const old = document.getElementById('bhi-org-jsonld');
    if (old) old.remove();
    document.head.appendChild(script);
  }, []);
  return (
    <main>
      {/* Hero Section */}
      <section id="about-hero" aria-labelledby="about-hero-heading" className="bg-background">
        <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
            <Badge variant="outline" className="mb-6">
              <Heart className="w-4 h-4 mr-2" />
              About Our Mission
            </Badge>
            <h1 id="about-hero-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-6">About Boost Health Initiative in Kayunga, Uganda</h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Founded in Kayunga, Uganda, with a mission to transform health outcomes in rural communities, we focus on sustainable solutions that empower individuals and strengthen healthcare systems across Uganda.
            </p>
        </div>
      </section>

      {/* Mission/Approach/Impact Section */}
      <section id="our-approach" aria-labelledby="our-approach-heading" className="bg-secondary">
        <div className="container mx-auto px-4 py-16 sm:py-24">
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

      {/* Achievements Section */}
      <section id="achievements" aria-labelledby="achievements-heading" className="bg-background">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-6">
                <Award className="w-4 h-4 mr-2" />
                Our Impact
            </Badge>
            <h2 id="achievements-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">Measurable Results</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Demonstrating our commitment to improving health outcomes and empowering communities through data-driven impact.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map(({ number, label, description }) => (
              <Card key={label} className="text-center bg-secondary border-0">
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

      {/* Testimonials Section */}
      <section id="testimonials" aria-labelledby="testimonials-heading" className="bg-secondary">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-12">
             <Badge variant="outline" className="mb-6">
                <Users className="w-4 h-4 mr-2" />
                Testimonials
            </Badge>
            <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">Voices from Our Community</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Hear from the people whose lives have been transformed through our programs and partnerships.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map(({ name, role, content, image }) => (
              <Card key={name} className="bg-background shadow-lg border-0">
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
                  <blockquote className="text-muted-foreground leading-relaxed italic text-lg border-l-4 border-primary/20 pl-4">
                    "{content}"
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* UN SDG Section */}
      <section id="sdg-goals" aria-labelledby="sdg-goals-heading" className="bg-background">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-6">
                <Globe className="w-4 h-4 mr-2" />
                UN SDG Alignment
            </Badge>
            <h2 id="sdg-goals-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">Global Impact Goals</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our programs directly contribute to achieving the United Nations Sustainable Development Goals.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {sdgTargets.map(({ target, description }) => (
              <div key={target} className="flex items-center space-x-4 bg-secondary p-6 rounded-2xl shadow-sm">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-lg">
                  {target}
                </div>
                <span className="text-foreground font-semibold text-lg">{description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
} 