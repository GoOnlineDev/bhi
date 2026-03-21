"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Heart,
  Brain,
  ShieldAlert,
  Pill,
  Baby,
  Users,
  Stethoscope,
  Leaf,
  BookOpen,
  UserCheck,
  Layers,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

const CATEGORY_CONFIG: Record<string, { color: string; lightColor: string; textColor: string; borderColor: string; icon: React.ElementType }> = {
  "SRHR": { color: "bg-rose-500", lightColor: "bg-rose-50", textColor: "text-rose-600", borderColor: "border-rose-200", icon: Heart },
  "NCDs": { color: "bg-indigo-500", lightColor: "bg-indigo-50", textColor: "text-indigo-600", borderColor: "border-indigo-200", icon: Brain },
  "GBV": { color: "bg-purple-500", lightColor: "bg-purple-50", textColor: "text-purple-600", borderColor: "border-purple-200", icon: ShieldAlert },
  "Substance Abuse": { color: "bg-amber-500", lightColor: "bg-amber-50", textColor: "text-amber-600", borderColor: "border-amber-200", icon: Pill },
  "Maternal & Child Health": { color: "bg-pink-500", lightColor: "bg-pink-50", textColor: "text-pink-600", borderColor: "border-pink-200", icon: Baby },
  "Mental Health": { color: "bg-cyan-500", lightColor: "bg-cyan-50", textColor: "text-cyan-600", borderColor: "border-cyan-200", icon: Brain },
  "Clinical Services": { color: "bg-red-500", lightColor: "bg-red-50", textColor: "text-red-600", borderColor: "border-red-200", icon: Stethoscope },
  "Community Outreach": { color: "bg-blue-500", lightColor: "bg-blue-50", textColor: "text-blue-600", borderColor: "border-blue-200", icon: Users },
  "Environmental Health": { color: "bg-emerald-500", lightColor: "bg-emerald-50", textColor: "text-emerald-600", borderColor: "border-emerald-200", icon: Leaf },
  "Education & Prevention": { color: "bg-green-500", lightColor: "bg-green-50", textColor: "text-green-600", borderColor: "border-green-200", icon: BookOpen },
  "Youth Services": { color: "bg-orange-500", lightColor: "bg-orange-50", textColor: "text-orange-600", borderColor: "border-orange-200", icon: Baby },
  "Nursing Services": { color: "bg-teal-500", lightColor: "bg-teal-50", textColor: "text-teal-600", borderColor: "border-teal-200", icon: UserCheck },
};
const DEFAULT_CONFIG = { color: "bg-primary", lightColor: "bg-primary/10", textColor: "text-primary", borderColor: "border-primary/30", icon: Layers };

function getConfig(category?: string) {
  if (!category) return DEFAULT_CONFIG;
  return CATEGORY_CONFIG[category] || DEFAULT_CONFIG;
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary border-b px-4 py-6 max-w-7xl mx-auto">
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="relative h-64 bg-muted">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="grid grid-cols-2 gap-4 mt-8">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params.id as string;

  const service = useQuery(api.services.getServiceById, { id: serviceId as Id<"services"> });
  const isLoading = service === undefined;

  if (isLoading) return <DetailSkeleton />;

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <Layers className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Service Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This service may have been removed or the link is invalid.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const cfg = getConfig(service.category);
  const Icon = cfg.icon;
  const heroImg = service.heroImage || service.images?.[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Back nav */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/services" className={`inline-flex items-center ${cfg.textColor} hover:opacity-80 transition-opacity`}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Services
            </Link>
            <div className="flex items-center gap-2">
              {service.category && (
                <Badge variant="outline" className={`${cfg.textColor} border-current`}>
                  {service.category}
                </Badge>
              )}
              {service.isFeatured && (
                <Badge className="bg-amber-500 text-white border-0">Featured</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className={`relative bg-gradient-to-br from-[#f37c1b] to-[#ff9d4d] text-white`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className={`inline-flex items-center px-4 py-2 ${cfg.color} rounded-full text-white text-sm font-semibold mb-6`}>
                <Icon className="w-4 h-4 mr-2" />
                {service.shortTitle || service.category || "Health Service"}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{service.title}</h1>
              <p className="text-xl text-white/90 leading-relaxed mb-8">
                {service.overview || service.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="inline-flex items-center px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                  Get This Service
                </Link>
                <Link href="/programs" className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-semibold">
                  Related Programs
                </Link>
              </div>
            </div>
            {heroImg && (
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm">
                <Image src={heroImg} alt={service.title} fill className="object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        {service.stats && service.stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {service.stats.map((stat: { label: string; value: string }, i: number) => (
              <Card key={i} className="text-center border-0 shadow-md">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${cfg.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Features */}
            {service.features && service.features.length > 0 && (
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Service Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {service.features.map((feature: { title: string; description: string }, i: number) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className={`w-10 h-10 ${cfg.lightColor} ${cfg.borderColor} border rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${cfg.textColor}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                          <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Key Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {service.benefits.map((benefit: string, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className={`w-5 h-5 ${cfg.textColor} flex-shrink-0`} />
                        <span className="text-foreground text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Process */}
            {service.process && service.process.length > 0 && (
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Our Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {service.process.map((step: string, i: number) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className={`w-8 h-8 ${cfg.color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                          {i + 1}
                        </div>
                        <p className="text-foreground pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Media gallery */}
            {service.images && service.images.length > 1 && (
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {service.images.map((url: string, i: number) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                        <Image src={url} alt={`${service.title} image ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Videos */}
            {service.videos && service.videos.length > 0 && (
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {service.videos.map((url: string, i: number) => (
                      <video key={i} src={url} controls className="w-full rounded-lg border bg-black" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Get This Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground text-sm">Phone</p>
                    <p className="text-muted-foreground text-sm">
                      {service.contactPhone || "+256-772-670-744"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground text-sm">Email</p>
                    <p className="text-muted-foreground text-sm">
                      {service.contactEmail || "bhi@boosthealthinitiative.org"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground text-sm">Location</p>
                    <p className="text-muted-foreground text-sm">Kayunga, Uganda & surrounding districts</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground text-sm">Hours</p>
                    <p className="text-muted-foreground text-sm">Open 24/7</p>
                  </div>
                </div>
                {service.contactPerson && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground text-sm">Contact Person</p>
                      <p className="text-muted-foreground text-sm">{service.contactPerson}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className={`${cfg.lightColor} ${cfg.borderColor} border-0 shadow-md`}>
              <CardContent className="p-6 text-center">
                <div className={`w-14 h-14 ${cfg.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Ready to Get Started?</h3>
                <p className="text-muted-foreground mb-4 text-sm">Contact us today to access this service.</p>
                <Link
                  href="/contact"
                  className={`inline-flex items-center px-4 py-2 ${cfg.color} text-white rounded-lg hover:opacity-90 transition-opacity w-full justify-center`}
                >
                  Contact Us
                </Link>
              </CardContent>
            </Card>

            {/* Tags */}
            {service.tags && service.tags.length > 0 && (
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-base text-foreground">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related links */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-base text-foreground">Related</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/services" className={`block ${cfg.textColor} hover:opacity-80 transition-opacity text-sm`}>
                  ← All Services
                </Link>
                <Link href="/programs" className={`block ${cfg.textColor} hover:opacity-80 transition-opacity text-sm`}>
                  Our Programs →
                </Link>
                <Link href="/about" className={`block ${cfg.textColor} hover:opacity-80 transition-opacity text-sm`}>
                  About BHI →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
