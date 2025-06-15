'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Target, Users, Globe, Award, Star, CheckCircle } from 'lucide-react';
import Image from 'next/image';

const achievements = [
  { number: "4", label: "Districts Served", description: "Kayunga, Mukono, Kamuli, Buyende" },
  { number: "15M", label: "Students Returned", description: "After COVID-19 school closures" },
  { number: "6,200", label: "Teen Pregnancies", description: "Addressed during lockdown" },
  { number: "2021", label: "Child Mothers", description: "Helped overcome mortality" }
];

const imagePool = [
  '/img/dr1.jpg',
  '/img/dr2.jpg',
  '/img/dr3.jpg',
  '/img/dr4.jpg',
];

function getRandomImage() {
  return imagePool[Math.floor(Math.random() * imagePool.length)];
}

const testimonials = [
  {
    name: "Sarah Nakato",
    role: "Community Health Worker",
    content: "BHI has transformed our community's approach to healthcare. The training and support we received has enabled us to help hundreds of families.",
    image: getRandomImage()
  },
  {
    name: "Dr. James Mukasa",
    role: "Regional Health Director",
    content: "The partnership with Boost Health Initiative has been instrumental in improving health outcomes in rural areas. Their dedication is remarkable.",
    image: getRandomImage()
  }
];

const sdgTargets = [
  { target: "3.1", description: "Reduce maternal mortality", color: "bg-emerald-500" },
  { target: "5.3", description: "Eliminate harmful practices against women", color: "bg-orange-500" }
];

export default function About() {
  return (
    <div className="font-['Lexend','Noto Sans',sans-serif]">
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-600 text-sm font-semibold mb-6">
              <Heart className="w-4 h-4 mr-2" />
              About Our Mission
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">About Boost Health Initiative</h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Founded with a mission to transform health outcomes in rural communities, we focus on sustainable solutions that empower individuals and strengthen healthcare systems across Uganda.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <Card className="text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-b from-white to-slate-50">
              <CardHeader className="pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-slate-800">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">To improve health outcomes and empower communities through evidence-based interventions and sustainable healthcare solutions.</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-b from-white to-slate-50">
              <CardHeader className="pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-slate-800">Our Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">Community-centered programs that address root causes of health disparities while building local capacity and leadership.</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-b from-white to-slate-50">
              <CardHeader className="pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-slate-800">Our Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">Serving multiple districts in Uganda with programs that have reached thousands of individuals and families.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-emerald-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-orange-300 text-sm font-semibold mb-6 backdrop-blur-sm">
              <Award className="w-4 h-4 mr-2" />
              Our Impact
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Measurable Results</h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Demonstrating our commitment to improving health outcomes and empowering communities through data-driven impact.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-emerald-400">{achievement.number}</div>
                  <div className="text-xl font-semibold mb-3 text-white">{achievement.label}</div>
                  <div className="text-slate-300 leading-relaxed">{achievement.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-600 text-sm font-semibold mb-6">
              <Users className="w-4 h-4 mr-2" />
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Voices from Our Community</h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Hear from the people whose lives have been transformed through our programs and partnerships.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 hover:shadow-2xl transition-all duration-500">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800">{testimonial.name}</h4>
                      <p className="text-orange-600 font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed italic text-lg">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full text-emerald-600 text-sm font-semibold mb-6">
              <Globe className="w-4 h-4 mr-2" />
              UN SDG Alignment
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Global Impact Goals</h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Our programs directly contribute to achieving the United Nations Sustainable Development Goals.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {sdgTargets.map((sdg, index) => (
              <div key={index} className="flex items-center space-x-4 bg-gradient-to-r from-white to-slate-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className={`w-16 h-16 ${sdg.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {sdg.target}
                </div>
                <span className="text-slate-700 font-semibold text-lg">{sdg.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 