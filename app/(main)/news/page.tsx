"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function News() {
  const newsList = useQuery(api.news.getPublishedNews) || [];
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);

  const filteredNews = newsList.filter((n) => {
    const q = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.summary.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="font-['Lexend','Noto Sans',sans-serif]">
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
          {/* Search Bar */}
          <div className="flex justify-center my-8">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search news..."
              className="w-full max-w-md rounded-lg border-2 border-orange-400 bg-orange-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-[#1c140d] placeholder:text-orange-400 shadow-sm transition"
            />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((article, index) => (
              <Card
                key={article._id}
                className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden cursor-pointer"
                onClick={() => setSelected(article)}
              >
                <div className="relative h-48 overflow-hidden">
                  {article.images && article.images.length > 0 ? (
                    <Image
                      src={article.images[0]}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-slate-700 hover:bg-white">{article.category}</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {article.startDate ? new Date(article.startDate).getFullYear() : ""}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 leading-tight line-clamp-2">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed line-clamp-3">{article.summary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Modal for news details */}
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
              className="absolute top-3 right-3 text-slate-500 hover:text-orange-500 focus:outline-none"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            {selected.images && selected.images.length > 0 && (
              <div className="mb-4 w-full aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={selected.images[0]}
                  alt={selected.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            <h2 className="text-2xl font-bold mb-2 text-[#f37c1b]">{selected.title}</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className="bg-orange-100 text-orange-700">{selected.category}</Badge>
              {selected.institution && <Badge className="bg-slate-100 text-slate-700">{selected.institution}</Badge>}
              <span className="text-xs text-slate-500">{selected.startDate ? new Date(selected.startDate).toLocaleString() : ""}</span>
            </div>
            <div className="mb-3 text-slate-700 font-semibold">{selected.summary}</div>
            <div className="mb-4 text-slate-700 whitespace-pre-line" style={{ overflowWrap: 'anywhere' }}>{selected.content}</div>
            {selected.images && selected.images.length > 1 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {selected.images.slice(1).map((img: string, idx: number) => (
                  <Image
                    key={idx}
                    src={img}
                    alt="News"
                    width={100}
                    height={70}
                    className="rounded-md border"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 