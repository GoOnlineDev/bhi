"use client";

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
  ArrowRight,
  Phone,
  MapPin,
  Clock
} from "lucide-react";

const services = [
  {
    id: "maternal-child-health",
    title: "Maternal and Child Health Services",
    description: "Comprehensive care for mothers and children including prenatal care, delivery support, child health programs, and breastfeeding education.",
    icon: Heart,
    color: "bg-pink-500",
    lightColor: "bg-pink-50",
    borderColor: "border-pink-200",
    textColor: "text-pink-600",
    features: [
      "Maternal health care",
      "Child health programs", 
      "Breastfeeding support and education",
      "Prenatal and postnatal care"
    ],
    stats: "500+ mothers served annually"
  },
  {
    id: "sexual-reproductive-health",
    title: "Sexual and Reproductive Health Services",
    description: "Complete reproductive health services including family planning, STI screening, cervical cancer screening, and comprehensive education.",
    icon: Users,
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-600",
    features: [
      "Family planning services",
      "STI and STD screening and treatment",
      "Cervical cancer screening",
      "Sexual reproductive health education"
    ],
    stats: "1,200+ clients served"
  },
  {
    id: "mental-health",
    title: "Mental Health Services",
    description: "Mental health support programs focused on emotional wellbeing, counseling, and movement therapy for improved mental health outcomes.",
    icon: Brain,
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-600",
    features: [
      "Mental health support programs",
      "Movement and mobility support",
      "Counseling services",
      "Stress management programs"
    ],
    stats: "300+ individuals supported"
  },
  {
    id: "education-prevention",
    title: "Education and Prevention Services",
    description: "Comprehensive health education programs covering obesity prevention, general health education, and hygiene planning.",
    icon: BookOpen,
    color: "bg-green-500",
    lightColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-600",
    features: [
      "Obesity education and prevention",
      "Health education programs",
      "Hygiene education and planning",
      "Nutrition counseling"
    ],
    stats: "2,000+ people educated"
  },
  {
    id: "community-based",
    title: "Community-Based Services",
    description: "Community-focused health interventions and outreach programs designed to improve healthcare access in rural communities.",
    icon: Home,
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
    features: [
      "Community-based health interventions",
      "Community outreach programs",
      "Access to healthcare services in communities",
      "Mobile health clinics"
    ],
    stats: "15+ communities reached"
  },
  {
    id: "clinical-services",
    title: "Clinical Services",
    description: "Essential clinical services including general health screenings, therapeutic communication, and comprehensive healthcare access.",
    icon: Stethoscope,
    color: "bg-red-500",
    lightColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-600",
    features: [
      "Screening services (general health screenings)",
      "Therapeutic communication and counseling",
      "General healthcare access",
      "Diagnostic services"
    ],
    stats: "800+ screenings conducted"
  },
  {
    id: "nursing-services",
    title: "Nursing Services",
    description: "Professional nursing care both in clinical settings and community environments, providing essential healthcare support.",
    icon: UserCheck,
    color: "bg-teal-500",
    lightColor: "bg-teal-50",
    borderColor: "border-teal-200",
    textColor: "text-teal-600",
    features: [
      "Clinical nursing care",
      "Community nursing support",
      "Home-based care",
      "Health monitoring"
    ],
    stats: "24/7 nursing support"
  },
  {
    id: "environmental-health",
    title: "Environmental Health Services",
    description: "Environmental health programs addressing climate-related health issues and animal health services for community wellbeing.",
    icon: Leaf,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-600",
    features: [
      "Cold environment health considerations",
      "Animal services (veterinary public health)",
      "Environmental health assessments",
      "Climate health adaptation"
    ],
    stats: "Environmental health monitoring"
  },
  {
    id: "youth-services",
    title: "Youth Services",
    description: "Specialized health programs designed for young people, focusing on youth-specific health needs and accessible healthcare services.",
    icon: Baby,
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-600",
    features: [
      "Youth-focused health programs",
      "Adolescent health services",
      "Youth health education",
      "Accessible youth healthcare"
    ],
    stats: "400+ youth engaged"
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#fcfaf8]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#f37c1b] to-[#ff9d4d] text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white text-sm font-semibold mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Our Services
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Comprehensive Health Services
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Boost Health Initiative provides a full spectrum of health services designed to empower communities 
              and improve health outcomes across Uganda.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1c140d] mb-4">
            Our Service Areas
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We offer comprehensive healthcare services across multiple specialties, 
            ensuring accessible and quality care for all community members.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Link key={service.id} href={`/services/${service.id}`}>
                <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden cursor-pointer h-full">
                  <CardHeader className={`${service.lightColor} ${service.borderColor} border-b`}>
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <Badge className={`${service.textColor} bg-white border ${service.borderColor}`}>
                        {service.stats}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-[#1c140d] group-hover:text-[#f37c1b] transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <p className="text-gray-600 leading-relaxed mb-4 flex-1">
                      {service.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      <h4 className="font-semibold text-[#1c140d] text-sm">Key Services:</h4>
                      <ul className="space-y-1">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <div className={`w-1.5 h-1.5 ${service.color} rounded-full mr-2`}></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className={`text-sm font-medium ${service.textColor}`}>
                        Learn More
                      </span>
                      <ArrowRight className={`w-4 h-4 ${service.textColor} group-hover:translate-x-1 transition-transform duration-300`} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-[#1c140d] to-[#2d1f17] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Need Our Services?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Our dedicated team is ready to provide you with quality healthcare services. 
              Contact us today to learn more about how we can help you and your community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#f37c1b]" />
                <span>+256 XXX XXX XXX</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#f37c1b]" />
                <span>Multiple Locations Across Uganda</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#f37c1b]" />
                <span>24/7 Emergency Services</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-[#f37c1b] text-white rounded-lg hover:bg-[#ff9d4d] transition-colors font-semibold"
              >
                Contact Us
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-semibold"
              >
                View Programs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
