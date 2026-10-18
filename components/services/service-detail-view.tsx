import Link from "next/link";
import SmartImage from "@/components/ui/smart-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, ArrowLeft, Phone, Mail, MapPin, CheckCircle, TrendingUp } from "lucide-react";
import { getCategoryStyle } from "@/lib/service-category-styles";
import type { ServiceContent, ServiceLink } from "@/lib/core-programs";

type Style = ReturnType<typeof getCategoryStyle>;

const DEFAULT_PHONE = "+256-772-670-744";
const DEFAULT_EMAIL = "bhi@boosthealthinitiative.org";

export function ServiceDetailSkeleton() {
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
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function DetailHero({ service, cfg }: { service: ServiceContent; cfg: Style }) {
  const Icon = cfg.icon;
  const heroImg = service.heroImage || service.images?.[0];
  return (
    <div className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <div className={`inline-flex items-center px-4 py-2 ${cfg.color} rounded-full text-white text-sm font-semibold mb-6`}>
              <Icon className="w-4 h-4 mr-2" aria-hidden />
              {service.shortTitle || service.category || "Health Service"}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 break-words">{service.title}</h1>
            <p className="text-base sm:text-xl text-white/90 leading-relaxed mb-8">{service.overview || service.description}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors font-semibold">
                Get Involved
              </Link>
              <Link href="/programs" className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-primary transition-colors font-semibold">
                Related Programs
              </Link>
            </div>
          </div>
          {heroImg ? (
            <SmartImage src={heroImg} alt={service.title} fit="contain" priority sizes="(max-width: 1024px) 100vw, 50vw" wrapperClassName="aspect-[4/3] rounded-2xl bg-white/10 shadow-xl" />
          ) : (
            <div className="hidden lg:flex aspect-[4/3] rounded-2xl bg-white/10 border border-white/20 items-center justify-center" aria-hidden>
              <Icon className="w-32 h-32 text-white/80" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailBody({ service, cfg }: { service: ServiceContent; cfg: Style }) {
  const Icon = cfg.icon;
  return (
    <div className="lg:col-span-2 space-y-8">
      {service.features && service.features.length > 0 && (
        <SectionCard title="What This Covers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.features.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className={`w-11 h-11 ${cfg.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" aria-hidden />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-1">{f.title}</h3>
                  <p className="text-foreground/75 text-base leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
      {service.benefits && service.benefits.length > 0 && (
        <SectionCard title="How It Helps">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {service.benefits.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <CheckCircle className={`w-5 h-5 ${cfg.textColor} flex-shrink-0`} aria-hidden />
                <span className="text-foreground text-base">{b}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
      {service.process && service.process.length > 0 && (
        <SectionCard title="How We Work">
          <ol className="space-y-4">
            {service.process.map((step, i) => (
              <li key={step} className="flex items-start gap-4">
                <span className={`w-8 h-8 ${cfg.color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>{i + 1}</span>
                <p className="text-foreground pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </SectionCard>
      )}
      {service.images && service.images.length > 1 && (
        <SectionCard title="Gallery">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {service.images.map((url, i) => (
              <SmartImage key={url} src={url} alt={`${service.title} image ${i + 1}`} wrapperClassName="aspect-square rounded-lg" sizes="(max-width: 768px) 50vw, 25vw" className="hover:scale-105 transition-transform duration-300" />
            ))}
          </div>
        </SectionCard>
      )}
      {service.videos && service.videos.length > 0 && (
        <SectionCard title="Videos">
          <div className="space-y-4">
            {service.videos.map((url) => (
              <video key={url} src={url} controls className="w-full rounded-lg border bg-black" />
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function ContactRow({ icon: RowIcon, cfg, children }: { icon: typeof Phone; cfg: Style; children: React.ReactNode }) {
  return (
    <>
      <span className={`w-10 h-10 rounded-lg ${cfg.lightColor} flex items-center justify-center flex-shrink-0`}>
        <RowIcon className={`w-5 h-5 ${cfg.textColor}`} aria-hidden />
      </span>
      {children}
    </>
  );
}

function DetailSidebar({ service, cfg, related }: { service: ServiceContent; cfg: Style; related: ServiceLink[] }) {
  const Icon = cfg.icon;
  const phone = service.contactPhone || DEFAULT_PHONE;
  const email = service.contactEmail || DEFAULT_EMAIL;
  return (
    <div className="space-y-6">
      <Card className={`border-2 ${cfg.borderColor} shadow-md overflow-hidden`}>
        <div className={`${cfg.color} px-6 py-4 flex items-center gap-3`}>
          <Icon className="w-6 h-6 text-white" aria-hidden />
          <h2 className="text-lg font-semibold text-white">Get involved</h2>
        </div>
        <CardContent className="space-y-4 pt-6">
          <p className="text-foreground/80 text-base">Reach out to learn more, refer someone, or support this work.</p>
          <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-3 group">
            <ContactRow icon={Phone} cfg={cfg}><span className="text-foreground text-base group-hover:underline">{phone}</span></ContactRow>
          </a>
          <a href={`mailto:${email}`} className="flex items-center gap-3 group">
            <ContactRow icon={Mail} cfg={cfg}><span className="text-foreground text-base break-all group-hover:underline">{email}</span></ContactRow>
          </a>
          <div className="flex items-center gap-3">
            <ContactRow icon={MapPin} cfg={cfg}><span className="text-foreground text-base">Kayunga, Uganda &amp; surrounding districts</span></ContactRow>
          </div>
          {service.contactPerson && (
            <div className="flex items-center gap-3">
              <ContactRow icon={Users} cfg={cfg}><span className="text-foreground text-base">{service.contactPerson}</span></ContactRow>
            </div>
          )}
          <Link href="/contact?type=partner" className="inline-flex w-full items-center justify-center px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
            Contact us
          </Link>
        </CardContent>
      </Card>
      {service.tags && service.tags.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardHeader><CardTitle className="text-base text-foreground">Tags</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {service.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
          </CardContent>
        </Card>
      )}
      {related.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardHeader><CardTitle className="text-lg text-foreground">Related areas of work</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {related.map((r) => (
              <Link key={r.key} href={r.href} className="flex gap-3 items-center group">
                <SmartImage src={r.image} alt={r.title} sizes="64px" wrapperClassName="w-16 h-16 rounded-lg flex-shrink-0" fallbackLabel={r.category} />
                <div className="min-w-0">
                  {r.category && <p className={`text-xs font-semibold ${getCategoryStyle(r.category).textColor}`}>{r.category}</p>}
                  <p className="font-medium text-foreground group-hover:underline line-clamp-2">{r.title}</p>
                </div>
              </Link>
            ))}
            <Link href="/services" className="block pt-2 text-primary font-medium hover:underline">All areas of work →</Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/** Shared detail layout for admin (Convex) services and built-in core programme pages. */
export function ServiceDetailView({ service, related }: { service: ServiceContent; related: ServiceLink[] }) {
  const cfg = getCategoryStyle(service.category);
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-2">
          <Link href="/services" className={`inline-flex items-center ${cfg.textColor} hover:opacity-80 transition-opacity`}>
            <ArrowLeft className="w-5 h-5 mr-2" aria-hidden />
            Back to What We Do
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {service.category && <Badge variant="outline" className={`${cfg.textColor} border-current`}>{service.category}</Badge>}
            {service.isFeatured && <Badge className="bg-amber-500 text-white border-0">Featured</Badge>}
          </div>
        </div>
      </div>
      <DetailHero service={service} cfg={cfg} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {service.stats && service.stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {service.stats.map((stat) => (
              <Card key={stat.label} className="text-center border-0 shadow-md">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${cfg.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <TrendingUp className="w-6 h-6 text-white" aria-hidden />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <DetailBody service={service} cfg={cfg} />
          <DetailSidebar service={service} cfg={cfg} related={related} />
        </div>
      </div>
    </div>
  );
}
