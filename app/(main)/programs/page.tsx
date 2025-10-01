"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Stethoscope, Search, HandHeart, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import DonateModal from '@/components/DonateModal';

export default function ProgramsPage() {

  const programsList = useQuery(api.programs.getApprovedPrograms);
  const [searchQuery, setSearchQuery] = useState("");
  const [donateOpen, setDonateOpen] = useState(false);
  const isLoading = programsList === undefined;

  const filteredPrograms = useMemo(() => {
    if (!programsList) return [];
    const q = searchQuery.toLowerCase();
    return programsList.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.status && p.status.toLowerCase().includes(q))
    );
  }, [programsList, searchQuery]);

  return (
    <main>
      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
      
      {/* Hero Section */}
      <section id="programs-hero" aria-labelledby="programs-hero-heading" className="bg-background">
        <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
          <Badge variant="outline" className="mb-6">
            <Stethoscope className="w-4 h-4 mr-2" />
            Our Programs
          </Badge>
          <h1 id="programs-hero-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Comprehensive Health Initiatives in Kayunga, Uganda
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Explore our comprehensive health initiatives designed to address critical health challenges and empower communities in Kayunga, Uganda.
          </p>
        </div>
      </section>
      
      {/* Programs Grid Section */}
      <section id="programs-grid" aria-labelledby="programs-grid-heading" className="bg-secondary">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          {/* Search Bar */}
          <div className="flex justify-center mb-12">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, status, or keyword..."
                className="w-full pl-10"
              />
            </div>
          </div>
          
          {isLoading ? (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPrograms.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program) => (
                <Link key={program._id} href={`/programs/${program._id}`} className="group block h-full">
                  <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-background">
                    <div className="relative h-48 overflow-hidden">
                      {program.images && program.images.length > 0 ? (
                        <Image
                          src={program.images[0]}
                          alt={program.name || 'Program image'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">
                          <Stethoscope className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                       <div className="absolute top-4 right-4">
                        {program.status && <Badge variant={program.status === 'Active' ? 'default' : 'secondary'}>{program.status}</Badge>}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-foreground leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {program.name}
                      </h3>
                      {program.location && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-2">
                          <MapPin className="w-4 h-4" />
                          {program.location}
                        </p>
                      )}
                      <p className="text-muted-foreground leading-relaxed line-clamp-3">
                        {program.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-foreground mb-2">No Programs Found</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? "Try adjusting your search query to find what you're looking for."
                  : "There are no programs available at the moment. Please check back later."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="programs-cta" aria-labelledby="programs-cta-heading" className="bg-background">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="bg-primary/10 rounded-2xl p-8 md:p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <HandHeart className="w-8 h-8 text-primary" />
            </div>
            <h2 id="programs-cta-heading" className="text-3xl font-bold text-foreground mb-4">
              Support Our Mission
            </h2>
            <p className="text-muted-foreground mb-8 max-w-3xl mx-auto">
              Your donation helps us continue providing essential health services and programs to communities in need. 
              Every contribution makes a real difference.
            </p>
            <Button size="lg" onClick={() => setDonateOpen(true)}>
              Make a Difference Today
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
} 