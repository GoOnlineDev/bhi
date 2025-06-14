"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stethoscope as StethoscopeIcon, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function Programs() {
  const programsList = useQuery(api.programs.getApprovedPrograms) || [];
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);

  const filteredPrograms = programsList.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.status && p.status.toLowerCase().includes(q))
    );
  });

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <Card
                key={program._id}
                className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden cursor-pointer"
                onClick={() => setSelected(program)}
              >
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
            ))}
          </div>
        </div>
      </section>
      {/* Modal for program details */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 p-6 overflow-y-auto max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-slate-500 hover:text-blue-500 focus:outline-none"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            {selected.images && selected.images.length > 0 && (
              <div className="mb-4 w-full aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={selected.images[0]}
                  alt={selected.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            <h2 className="text-2xl font-bold mb-2 text-[#1b7cf3]">{selected.name}</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className="bg-blue-100 text-blue-700">{selected.status}</Badge>
              {selected.location && <Badge className="bg-slate-100 text-slate-700">{selected.location}</Badge>}
              <span className="text-xs text-slate-500">{selected.startDate ? new Date(selected.startDate).toLocaleString() : ""}</span>
            </div>
            {selected.goal && <div className="mb-2 text-slate-700 font-semibold">Goal: {selected.goal}</div>}
            <div className="mb-4 text-slate-700 whitespace-pre-line" style={{ overflowWrap: 'anywhere' }}>{selected.description}</div>
            {selected.images && selected.images.length > 1 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {selected.images.slice(1).map((img: string, idx: number) => (
                  <Image
                    key={idx}
                    src={img}
                    alt="Program"
                    width={100}
                    height={70}
                    className="rounded-md border"
                  />
                ))}
              </div>
            )}
            {selected.contactPerson && (
              <div className="mt-4 text-sm text-slate-600">
                <span className="font-semibold">Contact:</span> {selected.contactPerson}
                {selected.contactEmail && (
                  <>
                    {" | "}
                    <a href={`mailto:${selected.contactEmail}`} className="text-blue-600 underline">{selected.contactEmail}</a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 