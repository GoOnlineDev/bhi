import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Baby, 
  Users, 
  Brain, 
  BookOpen, 
  Home, 
  Stethoscope, 
  Shield, 
  Leaf, 
  UserCheck,
  ArrowRight
} from "lucide-react";

const services = [
  {
    id: "maternal-child-health",
    title: "Maternal and Child Health",
    description: "Comprehensive care for mothers and children including prenatal care, delivery support, and child health programs.",
    icon: Heart,
  },
  {
    id: "sexual-reproductive-health",
    title: "Sexual and Reproductive Health",
    description: "Complete reproductive health services including family planning, STI screening, and comprehensive education.",
    icon: Users,
  },
  {
    id: "mental-health",
    title: "Mental Health Services",
    description: "Mental health support programs focused on emotional wellbeing, counseling, and movement therapy.",
    icon: Brain,
  },
  {
    id: "education-prevention",
    title: "Education and Prevention",
    description: "Health education programs covering obesity prevention, general health education, and hygiene planning.",
    icon: BookOpen,
  },
  {
    id: "community-based",
    title: "Community-Based Services",
    description: "Community-focused health interventions and outreach programs to improve healthcare access in rural areas.",
    icon: Home,
  },
  {
    id: "clinical-services",
    title: "Clinical Services",
    description: "Essential clinical services including general health screenings, therapeutic communication, and healthcare access.",
    icon: Stethoscope,
  },
  {
    id: "nursing-services",
    title: "Nursing Services",
    description: "Professional nursing care in clinical settings and community environments, providing essential healthcare support.",
    icon: UserCheck,
  },
  {
    id: "environmental-health",
    title: "Environmental Health",
    description: "Programs addressing climate-related health issues and animal health services for community wellbeing.",
    icon: Leaf,
  },
  {
    id: "youth-services",
    title: "Youth Services",
    description: "Specialized health programs designed for young people, focusing on youth-specific health needs.",
    icon: Baby,
  }
];

export default function ServicesPage() {
  return (
    <main>
      {/* Hero Section */}
      <section id="services-hero" aria-labelledby="services-hero-heading" className="bg-background">
        <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
          <Badge variant="outline" className="mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Our Services
          </Badge>
          <h1 id="services-hero-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Comprehensive Health Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Boost Health Initiative provides a full spectrum of health services designed to empower communities 
            and improve health outcomes across Uganda.
          </p>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services-grid" aria-labelledby="services-grid-heading" className="bg-secondary">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-12">
            <h2 id="services-grid-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Service Areas
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We offer comprehensive healthcare services across multiple specialties, 
              ensuring accessible and quality care for all community members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <Link key={service.id} href={`/services/${service.id}`} className="block h-full">
                  <Card className="group bg-background shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {service.description}
                      </p>
                      <div className="flex items-center text-sm font-medium text-primary">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="services-cta" aria-labelledby="services-cta-heading" className="bg-background">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="bg-secondary rounded-2xl p-8 md:p-12 text-center">
            <h2 id="services-cta-heading" className="text-3xl font-bold text-foreground mb-4">
              Need Our Services?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-3xl mx-auto">
              Our dedicated team is ready to provide you with quality healthcare services. 
              Contact us today to learn more about how we can help you and your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/programs">View Programs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
