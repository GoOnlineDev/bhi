'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail, Clock, ShieldAlert, HandHeart, Users, MessageSquare } from 'lucide-react';
import { Suspense } from 'react';

const contactInfo = [
  { icon: MapPin, title: "Location", lines: ["Level 1 Ssebowa House", "Plot 1 Ssekajja Road, Kayunga Central"] },
  { icon: Phone, title: "Phone", lines: ["+256-772-670-744", "+256-700-304-407"] },
  { icon: Mail, title: "Email", lines: ["bhi@boosthealthinitiative.org"] },
  { icon: Clock, title: "Hours", lines: ["Open 24/7, All Days"] }
];

const quickPaths = [
  {
    icon: ShieldAlert,
    label: "Get Help Now",
    color: "bg-rose-500",
    lightColor: "bg-rose-50",
    borderColor: "border-rose-200",
    textColor: "text-rose-600",
    description: "Facing a health crisis, GBV situation, or substance issue? Reach out — your inquiry can be kept confidential.",
    subject: "I Need Help",
  },
  {
    icon: HandHeart,
    label: "Fund / Partner With Us",
    color: "bg-primary",
    lightColor: "bg-primary/5",
    borderColor: "border-primary/20",
    textColor: "text-primary",
    description: "Interested in funding BHI programs or exploring partnership opportunities? We'd love to hear from you.",
    subject: "Partnership / Funding Inquiry",
  },
  {
    icon: Users,
    label: "Volunteer or Join",
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-600",
    description: "Want to volunteer, join our team, or bring your skills to support our mission? Get in touch.",
    subject: "Volunteer / Join BHI",
  },
  {
    icon: MessageSquare,
    label: "General Inquiry",
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-600",
    description: "Have a question about our programs, services, or community outreach? Send us a message.",
    subject: "General Inquiry",
  },
];

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

function ContactPageInner() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const type = searchParams.get('type');

  const defaultSubject = type === 'help'
    ? 'I Need Help'
    : type === 'partner'
    ? 'Partnership / Funding Inquiry'
    : '';

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { subject: defaultSubject },
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/send-email/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast({
          title: "Message Sent!",
          description: "Thank you for reaching out. We'll get back to you soon.",
        });
        reset();
      } else {
        throw new Error("Failed to send email");
      }
    } catch {
      toast({
        title: "An Error Occurred",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section id="contact-hero" aria-labelledby="contact-hero-heading" className="bg-background">
        <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
          <Badge variant="outline" className="mb-6">
            <Mail className="w-4 h-4 mr-2" />
            Get In Touch
          </Badge>
          <h1 id="contact-hero-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            We&apos;re Here for You. Reach Out Today.
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Whether you need help, want to partner with us, or simply have a question —
            our team in Kayunga, Uganda is ready to listen. All inquiries are treated
            with care and confidentiality.
          </p>
        </div>
      </section>

      {/* Quick Path Cards */}
      <section id="quick-paths" className="bg-secondary">
        <div className="container mx-auto px-4 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickPaths.map(({ icon: Icon, label, color, lightColor, borderColor, textColor, description, subject }) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setValue("subject", subject);
                  document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`text-left rounded-2xl p-5 border ${lightColor} ${borderColor} hover:shadow-md transition-all duration-200 group`}
              >
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className={`font-semibold ${textColor} mb-2`}>{label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section id="contact-form" aria-labelledby="contact-form-heading" className="bg-background">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <Card className="bg-background p-8 shadow-lg border">
              <CardHeader className="p-0 mb-6">
                <CardTitle id="contact-form-heading" className="text-2xl font-bold">Send Us a Message</CardTitle>
                <p className="text-muted-foreground text-sm mt-1">
                  All messages are confidential. We respond within 24 hours.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="sr-only">Name</label>
                    <Input id="name" placeholder="Full Name (or leave blank to stay anonymous)" {...register("name")} disabled={isLoading} />
                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <Input id="email" type="email" placeholder="Email Address" {...register("email")} disabled={isLoading} />
                    {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="sr-only">Phone</label>
                    <Input id="phone" type="tel" placeholder="Phone Number (optional)" {...register("phone")} disabled={isLoading} />
                    {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="subject" className="sr-only">Subject</label>
                    <Input id="subject" placeholder="Subject (e.g. I Need Help, Partnership Inquiry)" {...register("subject")} disabled={isLoading} />
                    {errors.subject && <p className="text-destructive text-sm mt-1">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="message" className="sr-only">Message</label>
                    <Textarea id="message" placeholder="Your message..." rows={5} {...register("message")} disabled={isLoading} />
                    {errors.message && <p className="text-destructive text-sm mt-1">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Message"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Your message is confidential. We never share your personal information.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Contact Information</h2>
                <p className="text-muted-foreground mb-6">
                  Reach us directly by phone, email, or visit our office in Kayunga Central.
                </p>
                {contactInfo.map(({ icon: Icon, title, lines }) => (
                  <div key={title} className="flex items-start gap-6 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-1">{title}</h3>
                      <div className="text-muted-foreground">
                        {lines.map(line => <p key={line}>{line}</p>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Emergency note */}
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-rose-700 mb-1">Need Urgent Help?</h3>
                    <p className="text-rose-600 text-sm leading-relaxed mb-3">
                      If you or someone you know is in immediate danger or facing a GBV or
                      health emergency, call us directly at:
                    </p>
                    <a href="tel:+256772670744" className="font-bold text-rose-700 text-lg hover:underline block">
                      +256-772-670-744
                    </a>
                    <a href="tel:+256700304407" className="font-bold text-rose-700 text-lg hover:underline block">
                      +256-700-304-407
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ContactPageInner />
    </Suspense>
  );
}
