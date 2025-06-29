"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stethoscope as StethoscopeIcon, Heart, HandHeart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import DonateModal from '@/components/DonateModal';

export default function Programs() {
  const programsList = useQuery(api.programs.getApprovedPrograms) || [];
  const [search, setSearch] = useState("");
  const [donateOpen, setDonateOpen] = useState(false);

  const filteredPrograms = programsList.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.status && p.status.toLowerCase().includes(q))
    );
  });

  return (
    <div className="font-['Lexend','Noto Sans',sans-serif]">
      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
      
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

          {/* Donate Section */}
          <div className="mb-16">
            <Card className="bg-gradient-to-r from-[#f37c1b] to-orange-500 text-white border-0 shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-white/20 rounded-full p-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Support Our Mission</h3>
                <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
                  Your donation helps us continue providing essential health services and programs to communities in need. 
                  Every contribution makes a real difference in someone's life.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => setDonateOpen(true)}
                    className="bg-white text-[#f37c1b] hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                  >
                    <HandHeart className="w-5 h-5" />
                    Donate Now
                  </button>
                  <div className="text-sm opacity-80">
                    <p>🔒 Secure donation process</p>
                    <p>💝 100% goes to our programs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center my-8">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search programs..."
              className="w-full max-w-md rounded-lg border-2 border-blue-400 bg-blue-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#14201c] placeholder:text-blue-400 shadow-sm transition"
            />
          </div>

          {/* Programs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <Link key={program._id} href={`/programs/${program._id}`}>
                <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    {program.images && program.images.length > 0 ? (
                      <Image
                        src={program.images[0]}
                        alt={program.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-slate-700 hover:bg-white">{program.status}</Badge>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {program.startDate ? new Date(program.startDate).getFullYear() : ""}
                      </span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-800 leading-tight line-clamp-2">{program.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed line-clamp-3">{program.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Additional Support Section */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Every Donation Counts</h3>
            <p className="text-slate-600 max-w-2xl mx-auto mb-8">
              Join us in making a lasting impact on the health and wellbeing of communities across Uganda. 
              Your support enables us to expand our reach and enhance our programs.
            </p>
            <button
              onClick={() => setDonateOpen(true)}
              className="bg-[#f37c1b] hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Make a Difference Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 