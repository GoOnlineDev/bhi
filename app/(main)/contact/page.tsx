'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const contactInfo = [
  { icon: MapPin, title: "Location", lines: ["Level 1 Ssebowa House", "Plot 1 Ssekajja Road, Kayunga Central"] },
  { icon: Phone, title: "Phone", lines: ["+256-772-670-744", "+256-700-304-407"] },
  { icon: Mail, title: "Email", lines: ["bhi@boosthealthinitiative.org"] },
  { icon: Clock, title: "Hours", lines: ["Open 24/7, All Days"] }
];

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema)
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
    } catch (err) {
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
            <h1 id="contact-hero-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-6">Contact Us in Kayunga – Ready to Make a Difference?</h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Contact our Kayunga, Uganda team to learn more about our health programs or explore partnership opportunities. We're here to help our community.
            </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-form" aria-labelledby="contact-form-heading" className="bg-secondary">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <Card className="bg-background p-8 shadow-lg">
              <CardHeader className="p-0 mb-6">
                <CardTitle id="contact-form-heading" className="text-2xl font-bold">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="sr-only">Name</label>
                    <Input id="name" placeholder="Full Name" {...register("name")} disabled={isLoading} />
                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                  </div>
                   <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <Input id="email" type="email" placeholder="Email Address" {...register("email")} disabled={isLoading} />
                    {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                  </div>
                   <div>
                    <label htmlFor="phone" className="sr-only">Phone</label>
                    <Input id="phone" type="tel" placeholder="Phone Number" {...register("phone")} disabled={isLoading} />
                    {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
                  </div>
                   <div>
                    <label htmlFor="subject" className="sr-only">Subject</label>
                    <Input id="subject" placeholder="Subject" {...register("subject")} disabled={isLoading} />
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
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              {contactInfo.map(({ icon: Icon, title, lines }) => (
                <div key={title} className="flex items-start gap-6">
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
          </div>
        </div>
      </section>
    </main>
  );
} 