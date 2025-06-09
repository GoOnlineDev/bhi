'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stethoscope as StethoscopeIcon, Heart, Shield, GraduationCap, HandHeart } from 'lucide-react';
import Image from 'next/image';

const imagePool = [
  '/img/dr1.jpg',
  '/img/dr2.jpg',
  '/img/dr3.jpg',
  '/img/dr4.jpg',
];

function getRandomImage() {
  return imagePool[Math.floor(Math.random() * imagePool.length)];
}

const programs = [
  {
    title: "Suubi Medical Centre",
    description: "A state-of-the-art health facility established by BHI to serve the community.",
    icon: Heart,
    category: "Healthcare Facility",
    image: getRandomImage()
  },
  {
    title: "Sexual Reproductive Health",
    description: "Comprehensive education and support for reproductive health in rural communities.",
    icon: Heart,
    category: "Health Promotion",
    image: getRandomImage()
  },
  {
    title: "Cervical Cancer Screening",
    description: "Early detection and prevention programs to reduce cervical cancer mortality.",
    icon: Shield,
    category: "Health Promotion",
    image: getRandomImage()
  },
  {
    title: "Prevention of Child Marriages",
    description: "Protecting young girls from early marriages and supporting their education.",
    icon: GraduationCap,
    category: "Gender Equality",
    image: getRandomImage()
  },
  {
    title: "Immunization Programs",
    description: "Ensuring children and adults receive essential vaccinations for disease prevention.",
    icon: StethoscopeIcon,
    category: "Health Promotion",
    image: getRandomImage()
  },
  {
    title: "Skills Development",
    description: "Empowering women with income-generating skills and entrepreneurship training.",
    icon: HandHeart,
    category: "Women Empowerment",
    image: getRandomImage()
  },
  {
    title: "HIV Prevention",
    description: "Education, testing, and support services to prevent HIV transmission.",
    icon: Shield,
    category: "Health Promotion",
    image: getRandomImage()
  }
];

export default function Programs() {
  return (
    <div className="font-['Lexend','Noto Sans',sans-serif']">
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full text-emerald-600 text-sm font-semibold mb-6">
              <StethoscopeIcon className="w-4 h-4 mr-2" />
              Our Programs
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Comprehensive Health Solutions</h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Comprehensive initiatives designed to address critical health challenges and empower communities across Uganda.
            </p>
          </div>
          {/* Suubi Medical Centre Button */}
          <div className="flex w-full max-w-[960px] px-4 py-3 justify-start mx-auto">
            <a
              href="https://suubi.com"
              target="_blank"
              rel="noopener"
              className="flex min-w-[84px] max-w-[480px] items-center justify-center rounded-lg h-10 px-4 bg-[#f4ede7] text-[#1c140d] text-sm font-bold tracking-[0.015em]"
            >
              <span className="relative w-7 h-7 mr-2">
                <Image src="/SUUBI LOGO ICON PNG Bckd TRANS.png" alt="Suubi Medical Centre Logo" fill className="object-contain" />
              </span>
              <span className="truncate">Visit Suubi Medical Centre</span>
            </a>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => {
              const IconComponent = program.icon;
              return (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={program.image}
                      alt={program.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-slate-700 hover:bg-white">{program.category}</Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-xl text-slate-800">{program.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">{program.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
} 