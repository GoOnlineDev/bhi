'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
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

const news = [
  {
    title: "Simon Mpooya Appointed to Hospital Board",
    date: "2024",
    description: "BHI Executive Director chairs Kayunga Regional Referral Hospital Board of Directors.",
    category: "Leadership",
    image: getRandomImage()
  },
  {
    title: "Cholera Outbreak Response",
    date: "2024",
    description: "BHI responds to cholera outbreak in Kayunga with 8 deaths reported, providing emergency support.",
    category: "Emergency Response",
    image: getRandomImage()
  },
  {
    title: "Schools Reopen After COVID-19",
    date: "2024",
    description: "15 million pupils return to classrooms after nearly two-year closure due to pandemic.",
    category: "Education",
    image: getRandomImage()
  }
];

export default function News() {
  return (
    <div className="font-['Lexend','Noto Sans',sans-serif']">
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-600 text-sm font-semibold mb-6">
              <Calendar className="w-4 h-4 mr-2" />
              Latest News
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Recent Updates</h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Stay updated with our recent activities, achievements, and community impact stories.
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
            {news.map((article, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-slate-700 hover:bg-white">{article.category}</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">{article.date}</span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 leading-tight">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">{article.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 