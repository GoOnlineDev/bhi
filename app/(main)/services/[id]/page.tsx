"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  Star,
  Calendar,
  Target,
  Award,
  TrendingUp
} from "lucide-react";

const servicesData = {
  "maternal-child-health": {
    title: "Maternal and Child Health Services",
    description: "Comprehensive care for mothers and children including prenatal care, delivery support, child health programs, and breastfeeding education.",
    icon: Heart,
    color: "bg-pink-500",
    lightColor: "bg-pink-50",
    borderColor: "border-pink-200",
    textColor: "text-pink-600",
    heroImage: "/img/dr1.jpg",
    overview: "Our Maternal and Child Health Services are designed to support mothers and children throughout their healthcare journey. We provide comprehensive care from pregnancy through childhood, ensuring the health and wellbeing of both mothers and their children.",
    features: [
      {
        title: "Maternal Health Care",
        description: "Complete prenatal, delivery, and postnatal care services",
        icon: Heart
      },
      {
        title: "Child Health Programs", 
        description: "Comprehensive health monitoring and care for children",
        icon: Baby
      },
      {
        title: "Breastfeeding Support",
        description: "Education and support for successful breastfeeding",
        icon: Users
      },
      {
        title: "Prenatal and Postnatal Care",
        description: "Specialized care before and after delivery",
        icon: Shield
      }
    ],
    stats: [
      { label: "Mothers Served Annually", value: "500+", icon: Heart },
      { label: "Successful Deliveries", value: "95%", icon: CheckCircle },
      { label: "Breastfeeding Success Rate", value: "88%", icon: TrendingUp },
      { label: "Child Health Screenings", value: "1,200+", icon: Baby }
    ],
    benefits: [
      "Reduced maternal mortality rates",
      "Improved child health outcomes",
      "Enhanced breastfeeding success",
      "Early detection of health issues",
      "Comprehensive family planning support",
      "Nutritional guidance for mothers and children"
    ],
    process: [
      "Initial consultation and assessment",
      "Personalized care plan development",
      "Regular monitoring and check-ups",
      "Delivery support and care",
      "Postnatal follow-up and support"
    ]
  },
  "sexual-reproductive-health": {
    title: "Sexual and Reproductive Health Services",
    description: "Complete reproductive health services including family planning, STI screening, cervical cancer screening, and comprehensive education.",
    icon: Users,
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-600",
    heroImage: "/img/dr2.jpg",
    overview: "Our Sexual and Reproductive Health Services provide comprehensive care for individuals of all ages. We focus on education, prevention, and treatment to ensure optimal reproductive health outcomes.",
    features: [
      {
        title: "Family Planning Services",
        description: "Comprehensive contraceptive counseling and services",
        icon: Users
      },
      {
        title: "STI Screening & Treatment",
        description: "Testing, treatment, and prevention of sexually transmitted infections",
        icon: Shield
      },
      {
        title: "Cervical Cancer Screening",
        description: "Early detection and prevention of cervical cancer",
        icon: Target
      },
      {
        title: "Health Education",
        description: "Comprehensive reproductive health education programs",
        icon: BookOpen
      }
    ],
    stats: [
      { label: "Clients Served", value: "1,200+", icon: Users },
      { label: "STI Detection Rate", value: "92%", icon: Shield },
      { label: "Screening Accuracy", value: "98%", icon: Target },
      { label: "Education Sessions", value: "150+", icon: BookOpen }
    ],
    benefits: [
      "Improved reproductive health outcomes",
      "Reduced STI transmission rates",
      "Early cancer detection and prevention",
      "Enhanced family planning knowledge",
      "Reduced unplanned pregnancies",
      "Comprehensive health education"
    ],
    process: [
      "Confidential consultation",
      "Health assessment and screening",
      "Personalized treatment plan",
      "Follow-up care and monitoring",
      "Ongoing education and support"
    ]
  },
  "mental-health": {
    title: "Mental Health Services",
    description: "Mental health support programs focused on emotional wellbeing, counseling, and movement therapy for improved mental health outcomes.",
    icon: Brain,
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-600",
    heroImage: "/img/dr3.jpg",
    overview: "Our Mental Health Services address the psychological and emotional wellbeing of our community members. We provide comprehensive support through counseling, therapy, and innovative treatment approaches.",
    features: [
      {
        title: "Mental Health Support",
        description: "Individual and group counseling services",
        icon: Brain
      },
      {
        title: "Movement Therapy",
        description: "Physical activity programs for mental wellness",
        icon: TrendingUp
      },
      {
        title: "Counseling Services",
        description: "Professional psychological counseling",
        icon: Users
      },
      {
        title: "Stress Management",
        description: "Programs to help manage stress and anxiety",
        icon: Shield
      }
    ],
    stats: [
      { label: "Individuals Supported", value: "300+", icon: Brain },
      { label: "Success Rate", value: "85%", icon: TrendingUp },
      { label: "Group Sessions", value: "120+", icon: Users },
      { label: "Stress Reduction", value: "78%", icon: Shield }
    ],
    benefits: [
      "Improved mental health outcomes",
      "Reduced anxiety and depression",
      "Enhanced coping strategies",
      "Better stress management",
      "Improved quality of life",
      "Stronger community support networks"
    ],
    process: [
      "Initial mental health assessment",
      "Personalized treatment planning",
      "Regular counseling sessions",
      "Progress monitoring and evaluation",
      "Ongoing support and follow-up"
    ]
  },
  "education-prevention": {
    title: "Education and Prevention Services",
    description: "Comprehensive health education programs covering obesity prevention, general health education, and hygiene planning.",
    icon: BookOpen,
    color: "bg-green-500",
    lightColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-600",
    heroImage: "/img/dr4.jpg",
    overview: "Our Education and Prevention Services focus on empowering communities with knowledge and skills to prevent disease and promote healthy lifestyles. We believe prevention is the best medicine.",
    features: [
      {
        title: "Obesity Prevention",
        description: "Programs to prevent and manage obesity",
        icon: TrendingUp
      },
      {
        title: "Health Education",
        description: "Comprehensive health education programs",
        icon: BookOpen
      },
      {
        title: "Hygiene Education",
        description: "Teaching proper hygiene practices",
        icon: Shield
      },
      {
        title: "Nutrition Counseling",
        description: "Dietary guidance and nutrition education",
        icon: Heart
      }
    ],
    stats: [
      { label: "People Educated", value: "2,000+", icon: BookOpen },
      { label: "Prevention Programs", value: "25+", icon: Shield },
      { label: "Nutrition Sessions", value: "180+", icon: Heart },
      { label: "Behavior Change", value: "72%", icon: TrendingUp }
    ],
    benefits: [
      "Reduced disease incidence",
      "Improved health knowledge",
      "Better hygiene practices",
      "Healthier lifestyle choices",
      "Reduced healthcare costs",
      "Stronger community health"
    ],
    process: [
      "Community health assessment",
      "Educational program design",
      "Interactive learning sessions",
      "Skill-building workshops",
      "Ongoing support and reinforcement"
    ]
  },
  "community-based": {
    title: "Community-Based Services",
    description: "Community-focused health interventions and outreach programs designed to improve healthcare access in rural communities.",
    icon: Home,
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
    heroImage: "/img/oldsuubi.jpg",
    overview: "Our Community-Based Services bring healthcare directly to communities, ensuring that geographic barriers don't prevent access to quality healthcare. We work within communities to build sustainable health systems.",
    features: [
      {
        title: "Health Interventions",
        description: "Community-specific health programs",
        icon: Home
      },
      {
        title: "Outreach Programs",
        description: "Mobile health services and community visits",
        icon: MapPin
      },
      {
        title: "Healthcare Access",
        description: "Improving access to essential health services",
        icon: Shield
      },
      {
        title: "Mobile Clinics",
        description: "Bringing healthcare to remote areas",
        icon: Stethoscope
      }
    ],
    stats: [
      { label: "Communities Reached", value: "15+", icon: Home },
      { label: "Mobile Clinic Visits", value: "200+", icon: Stethoscope },
      { label: "Community Members Served", value: "5,000+", icon: Users },
      { label: "Health Outcomes Improved", value: "68%", icon: TrendingUp }
    ],
    benefits: [
      "Increased healthcare access",
      "Reduced travel barriers",
      "Community health improvement",
      "Early disease detection",
      "Preventive care delivery",
      "Strengthened health systems"
    ],
    process: [
      "Community needs assessment",
      "Program planning and design",
      "Mobile service deployment",
      "Community health worker training",
      "Ongoing monitoring and evaluation"
    ]
  },
  "clinical-services": {
    title: "Clinical Services",
    description: "Essential clinical services including general health screenings, therapeutic communication, and comprehensive healthcare access.",
    icon: Stethoscope,
    color: "bg-red-500",
    lightColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-600",
    heroImage: "/img/labs.jpg",
    overview: "Our Clinical Services provide comprehensive medical care through our healthcare facilities. We offer diagnostic, therapeutic, and preventive services to ensure optimal health outcomes for all patients.",
    features: [
      {
        title: "Health Screenings",
        description: "Comprehensive health assessments and screenings",
        icon: Stethoscope
      },
      {
        title: "Therapeutic Communication",
        description: "Counseling and therapeutic support services",
        icon: Users
      },
      {
        title: "Healthcare Access",
        description: "Comprehensive medical care services",
        icon: Shield
      },
      {
        title: "Diagnostic Services",
        description: "Laboratory and diagnostic testing",
        icon: Target
      }
    ],
    stats: [
      { label: "Screenings Conducted", value: "800+", icon: Stethoscope },
      { label: "Diagnostic Accuracy", value: "96%", icon: Target },
      { label: "Patient Satisfaction", value: "94%", icon: Star },
      { label: "Treatment Success", value: "89%", icon: CheckCircle }
    ],
    benefits: [
      "Early disease detection",
      "Accurate diagnosis",
      "Effective treatment",
      "Comprehensive care",
      "Improved health outcomes",
      "Accessible healthcare"
    ],
    process: [
      "Patient registration and assessment",
      "Clinical examination and testing",
      "Diagnosis and treatment planning",
      "Treatment implementation",
      "Follow-up care and monitoring"
    ]
  },
  "nursing-services": {
    title: "Nursing Services",
    description: "Professional nursing care both in clinical settings and community environments, providing essential healthcare support.",
    icon: UserCheck,
    color: "bg-teal-500",
    lightColor: "bg-teal-50",
    borderColor: "border-teal-200",
    textColor: "text-teal-600",
    heroImage: "/img/newBHI.jpg",
    overview: "Our Nursing Services provide professional, compassionate nursing care across all healthcare settings. Our qualified nurses deliver high-quality care while supporting patients and families throughout their healthcare journey.",
    features: [
      {
        title: "Clinical Nursing",
        description: "Professional nursing care in clinical settings",
        icon: UserCheck
      },
      {
        title: "Community Nursing",
        description: "Nursing support in community settings",
        icon: Home
      },
      {
        title: "Home-Based Care",
        description: "Nursing care delivered in patients' homes",
        icon: Heart
      },
      {
        title: "Health Monitoring",
        description: "Ongoing health assessment and monitoring",
        icon: TrendingUp
      }
    ],
    stats: [
      { label: "Nursing Hours", value: "24/7", icon: Clock },
      { label: "Patients Cared For", value: "1,500+", icon: UserCheck },
      { label: "Home Visits", value: "300+", icon: Home },
      { label: "Care Quality Rating", value: "97%", icon: Star }
    ],
    benefits: [
      "Professional nursing care",
      "Continuous health monitoring",
      "Personalized patient care",
      "Family support and education",
      "Improved recovery outcomes",
      "Accessible nursing services"
    ],
    process: [
      "Nursing assessment and care planning",
      "Implementation of nursing interventions",
      "Continuous monitoring and evaluation",
      "Patient and family education",
      "Coordination with healthcare team"
    ]
  },
  "environmental-health": {
    title: "Environmental Health Services",
    description: "Environmental health programs addressing climate-related health issues and animal health services for community wellbeing.",
    icon: Leaf,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-600",
    heroImage: "/img/oldsuubimain.jpg",
    overview: "Our Environmental Health Services address the intersection of environmental factors and human health. We work to create healthier environments and address climate-related health challenges affecting our communities.",
    features: [
      {
        title: "Climate Health",
        description: "Addressing climate-related health issues",
        icon: Leaf
      },
      {
        title: "Animal Health Services",
        description: "Veterinary public health programs",
        icon: Heart
      },
      {
        title: "Environmental Assessment",
        description: "Health impact assessments of environmental factors",
        icon: Target
      },
      {
        title: "Health Adaptation",
        description: "Climate health adaptation strategies",
        icon: Shield
      }
    ],
    stats: [
      { label: "Environmental Assessments", value: "50+", icon: Target },
      { label: "Climate Programs", value: "12+", icon: Leaf },
      { label: "Animal Health Interventions", value: "80+", icon: Heart },
      { label: "Community Adaptation", value: "85%", icon: Shield }
    ],
    benefits: [
      "Healthier environments",
      "Reduced environmental health risks",
      "Climate adaptation strategies",
      "Improved animal health",
      "Community resilience",
      "Sustainable health practices"
    ],
    process: [
      "Environmental health assessment",
      "Risk identification and analysis",
      "Intervention planning and implementation",
      "Community education and engagement",
      "Monitoring and evaluation"
    ]
  },
  "youth-services": {
    title: "Youth Services",
    description: "Specialized health programs designed for young people, focusing on youth-specific health needs and accessible healthcare services.",
    icon: Baby,
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-600",
    heroImage: "/img/DrSimon.jpg",
    overview: "Our Youth Services are specifically designed to meet the unique health needs of young people. We provide age-appropriate healthcare services and education to support healthy development and wellbeing.",
    features: [
      {
        title: "Youth Health Programs",
        description: "Health programs tailored for young people",
        icon: Baby
      },
      {
        title: "Adolescent Health",
        description: "Specialized care for adolescents",
        icon: Users
      },
      {
        title: "Youth Education",
        description: "Health education programs for youth",
        icon: BookOpen
      },
      {
        title: "Accessible Care",
        description: "Youth-friendly healthcare services",
        icon: Heart
      }
    ],
    stats: [
      { label: "Youth Engaged", value: "400+", icon: Baby },
      { label: "Education Sessions", value: "60+", icon: BookOpen },
      { label: "Health Screenings", value: "250+", icon: Stethoscope },
      { label: "Satisfaction Rate", value: "91%", icon: Star }
    ],
    benefits: [
      "Age-appropriate healthcare",
      "Improved health knowledge",
      "Early intervention",
      "Healthy development support",
      "Peer education programs",
      "Accessible youth services"
    ],
    process: [
      "Youth-friendly assessment",
      "Age-appropriate education",
      "Peer support programs",
      "Health promotion activities",
      "Ongoing support and follow-up"
    ]
  }
};

export default function ServiceDetailsPage() {
  const params = useParams();
  const serviceId = params.id as string;
  const service = servicesData[serviceId as keyof typeof servicesData];

  if (!service) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1c140d] mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
          <Link 
            href="/services"
            className="inline-flex items-center px-4 py-2 bg-[#f37c1b] text-white rounded-lg hover:bg-[#ff9d4d] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = service.icon;

  return (
    <div className="min-h-screen bg-[#fcfaf8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/services"
              className="inline-flex items-center text-[#f37c1b] hover:text-[#ff9d4d] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Services
            </Link>
            <Badge className={`${service.textColor} bg-white border ${service.borderColor}`}>
              Healthcare Service
            </Badge>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#f37c1b] to-[#ff9d4d] text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className={`inline-flex items-center px-4 py-2 ${service.color} rounded-full text-white text-sm font-semibold mb-6`}>
                <IconComponent className="w-4 h-4 mr-2" />
                {service.title}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {service.title}
              </h1>
              <p className="text-xl text-white/90 leading-relaxed mb-8">
                {service.overview}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-white text-[#f37c1b] rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  Get This Service
                </Link>
                <Link
                  href="/programs"
                  className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-semibold"
                >
                  Related Programs
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm">
                <Image
                  src={service.heroImage}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {service.stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <StatIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[#1c140d] mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#1c140d]">Service Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {service.features.map((feature, index) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div className={`w-10 h-10 ${service.lightColor} ${service.borderColor} border rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <FeatureIcon className={`w-5 h-5 ${service.textColor}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#1c140d] mb-2">{feature.title}</h3>
                          <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#1c140d]">Key Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 ${service.textColor} flex-shrink-0`} />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Process */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#1c140d]">Our Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {service.process.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-8 h-8 ${service.color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-[#1c140d]">Get This Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#f37c1b]" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">+256 XXX XXX XXX</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#f37c1b]" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">info@boosthealthinitiative.org</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#f37c1b]" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">Multiple locations across Uganda</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#f37c1b]" />
                  <div>
                    <p className="font-medium text-gray-900">Hours</p>
                    <p className="text-gray-600">24/7 Emergency Services</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className={`${service.lightColor} ${service.borderColor} border`}>
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-[#1c140d] mb-2">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-4 text-sm">Contact us today to access this service.</p>
                <Link
                  href="/contact"
                  className={`inline-flex items-center px-4 py-2 ${service.color} text-white rounded-lg hover:opacity-90 transition-opacity w-full justify-center`}
                >
                  Contact Us
                </Link>
              </CardContent>
            </Card>

            {/* Related Services */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-[#1c140d]">Related Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/services" className="block text-[#f37c1b] hover:text-[#ff9d4d] transition-colors">
                  View All Services →
                </Link>
                <Link href="/programs" className="block text-[#f37c1b] hover:text-[#ff9d4d] transition-colors">
                  Related Programs →
                </Link>
                <Link href="/about" className="block text-[#f37c1b] hover:text-[#ff9d4d] transition-colors">
                  About Our Organization →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 