"use client";

import { useParams, notFound } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import SmartImage from "@/components/ui/smart-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { getCategoryStyle } from "@/lib/service-category-styles";

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
  const allServices = useQuery(api.services.getPublishedServices);
  const isLoading = service === undefined;

  if (isLoading) return <DetailSkeleton />;

  if (!service) notFound();

  const cfg = getCategoryStyle(service.category);
  const Icon = cfg.icon;
  const heroImg = service.heroImage || service.images?.[0];
  const related = (allServices ?? [])
    .filter((s: any) => s._id !== service._id)
    .sort((a: any, b: any) => Number(b.category === service.category) - Number(a.category === service.category))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Back nav */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/services" className={`inline-flex items-center ${cfg.textColor} hover:opacity-80 transition-opacity`}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to What We Do
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
                  Get Involved
                </Link>
                <Link href="/programs" className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-primary transition-colors font-semibold">
                  Related Programs
                </Link>
              </div>
            </div>
            {heroImg && (
              <SmartImage
                src={heroImg}
                alt={service.title}
                fit="contain"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                wrapperClassName="aspect-[4/3] rounded-2xl bg-white/10 shadow-xl"
              />
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
                  <CardTitle className="text-2xl text-foreground">What This Covers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {service.features.map((feature: { title: string; description: string }, i: number) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className={`w-11 h-11 ${cfg.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-foreground mb-1">{feature.title}</h3>
                          <p className="text-foreground/75 text-base leading-relaxed">{feature.description}</p>
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
                  <CardTitle className="text-2xl text-foreground">How It Helps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {service.benefits.map((benefit: string, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className={`w-5 h-5 ${cfg.textColor} flex-shrink-0`} />
                        <span className="text-foreground text-base">{benefit}</span>
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
                  <CardTitle className="text-2xl text-foreground">How We Work</CardTitle>
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
                      <SmartImage key={i} src={url} alt={`${service.title} image ${i + 1}`} wrapperClassName="aspect-square rounded-lg"
                        sizes="(max-width: 768px) 50vw, 25vw" className="hover:scale-105 transition-transform duration-300" />
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
            {/* Contact + CTA (merged; was two separate "Get Involved" cards) */}
            <Card className={`border-2 ${cfg.borderColor} shadow-md overflow-hidden`}>
              <div className={`${cfg.color} px-6 py-4 flex items-center gap-3`}>
                <Icon className="w-6 h-6 text-white" />
                <h2 className="text-lg font-semibold text-white">Get involved</h2>
              </div>
              <CardContent className="space-y-4 pt-6">
                <p className="text-foreground/80 text-base">Reach out to learn more, refer someone, or support this work.</p>
                <a href={`tel:${(service.contactPhone || "+256772670744").replace(/[^+\d]/g, "")}`} className="flex items-center gap-3 group">
                  <span className={`w-10 h-10 rounded-lg ${cfg.lightColor} flex items-center justify-center`}><Phone className={`w-5 h-5 ${cfg.textColor}`} /></span>
                  <span className="text-foreground text-base group-hover:underline">{service.contactPhone || "+256-772-670-744"}</span>
                </a>
                <a href={`mailto:${service.contactEmail || "bhi@boosthealthinitiative.org"}`} className="flex items-center gap-3 group">
                  <span className={`w-10 h-10 rounded-lg ${cfg.lightColor} flex items-center justify-center`}><Mail className={`w-5 h-5 ${cfg.textColor}`} /></span>
                  <span className="text-foreground text-base break-all group-hover:underline">{service.contactEmail || "bhi@boosthealthinitiative.org"}</span>
                </a>
                <div className="flex items-center gap-3">
                  <span className={`w-10 h-10 rounded-lg ${cfg.lightColor} flex items-center justify-center`}><MapPin className={`w-5 h-5 ${cfg.textColor}`} /></span>
                  <span className="text-foreground text-base">Kayunga, Uganda &amp; surrounding districts</span>
                </div>
                {service.contactPerson && (
                  <div className="flex items-center gap-3">
                    <span className={`w-10 h-10 rounded-lg ${cfg.lightColor} flex items-center justify-center`}><Users className={`w-5 h-5 ${cfg.textColor}`} /></span>
                    <span className="text-foreground text-base">{service.contactPerson}</span>
                  </div>
                )}
                <Link
                  href="/contact?type=partner"
                  className="inline-flex w-full items-center justify-center px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Contact us
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

            {/* Related: other areas of work, same category first */}
            {related.length > 0 && (
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Related areas of work</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {related.map((r: any) => {
                    const rs = getCategoryStyle(r.category);
                    return (
                      <Link key={r._id} href={`/services/${r._id}`} className="flex gap-3 items-center group">
                        <SmartImage src={r.heroImage || r.images?.[0]} alt={r.title} sizes="64px" wrapperClassName="w-16 h-16 rounded-lg flex-shrink-0" />
                        <div className="min-w-0">
                          {r.category && <p className={`text-xs font-semibold ${rs.textColor}`}>{r.category}</p>}
                          <p className="font-medium text-foreground group-hover:underline line-clamp-2">{r.title}</p>
                        </div>
                      </Link>
                    );
                  })}
                  <Link href="/services" className="block pt-2 text-primary font-medium hover:underline">
                    All areas of work →
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
