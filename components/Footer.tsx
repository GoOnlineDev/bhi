'use client';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Twitter, Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';

const socialLinks = [
  { href: "#", label: "X (formerly Twitter)", icon: Twitter },
  { href: "#", label: "Facebook", icon: Facebook },
  { href: "#", label: "Instagram", icon: Instagram },
  { href: "https://www.linkedin.com/company/boosthealthinitiative/", label: "LinkedIn", icon: Linkedin },
  { href: "https://wa.me/256727003409", label: "WhatsApp", icon: MessageCircle },
];

const footerNav = [
  {
    heading: "About BHI",
    links: [
      { href: "/about", label: "Our Mission" },
      { href: "/services", label: "Services" },
      { href: "/programs", label: "Programs" },
      { href: "/contact", label: "Contact Us" },
    ]
  },
  {
    heading: "Resources",
    links: [
      { href: "/news", label: "News" },
      { href: "/gallery", label: "Gallery" },
      { href: "/faq", label: "FAQ" },
    ]
  },
  {
    heading: "Get Involved",
    links: [
      { href: "/contact", label: "Partnerships" },
      { href: "/contact", label: "Volunteer" },
    ]
  }
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const addSubscriber = useMutation(api.subscribers.addSubscriber);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await addSubscriber({ email });
      toast({
        title: "Subscribed!",
        description: "Thank you for joining our newsletter.",
      });
      setEmail('');
    } catch (err) {
      toast({
        title: "Subscription Failed",
        description: "An error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo and Social */}
          <div className="lg:col-span-2 flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative w-12 h-12">
                <Image src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png" alt="Boost Health Initiative Logo" fill className="object-contain" />
              </div>
              <span className="font-bold text-lg text-foreground">Boost Health Initiative</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs text-center md:text-left mb-6">
              Empowering communities through health initiatives and sustainable solutions in Uganda.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Footer Navigation */}
          {footerNav.map((section) => (
            <div key={section.heading}>
              <h4 className="font-semibold text-foreground mb-4">{section.heading}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
             <h4 className="font-semibold text-foreground mb-4">Subscribe to our Newsletter</h4>
             <p className="text-muted-foreground text-sm mb-4">
               Get the latest updates and stories from our community.
             </p>
            <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <Input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Boost Health Initiative. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 