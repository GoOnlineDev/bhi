"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UploadDropzone } from "@/utils/uploadthing";
import { Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Slide = { url: string; alt: string };

export function HeroSettingsForm() {
  const { toast } = useToast();
  const data = useQuery(api.heroSettings.getHeroForDashboard);
  const updateHero = useMutation(api.heroSettings.updateHeroSettings);
  const hydrated = useRef(false);

  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [primaryCtaLabel, setPrimaryCtaLabel] = useState("");
  const [secondaryCtaLabel, setSecondaryCtaLabel] = useState("");
  const [primaryCtaHref, setPrimaryCtaHref] = useState("");
  const [secondaryCtaHref, setSecondaryCtaHref] = useState("");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [newAlt, setNewAlt] = useState(
    "A healthcare worker smiling with a community member."
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data || hydrated.current) return;
    setHeadline(data.headline);
    setSubheadline(data.subheadline);
    setPrimaryCtaLabel(data.primaryCtaLabel);
    setSecondaryCtaLabel(data.secondaryCtaLabel);
    setPrimaryCtaHref(data.primaryCtaHref);
    setSecondaryCtaHref(data.secondaryCtaHref);
    setSlides(data.slides.map((s) => ({ ...s })));
    hydrated.current = true;
  }, [data]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateHero({
        headline,
        subheadline,
        primaryCtaLabel,
        secondaryCtaLabel,
        primaryCtaHref,
        secondaryCtaHref,
        slides,
      });
      toast({ title: "Saved", description: "Home hero has been updated." });
    } catch (e) {
      toast({
        title: "Could not save",
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const removeSlide = (index: number) => {
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSlideAlt = (index: number, alt: string) => {
    setSlides((prev) =>
      prev.map((s, i) => (i === index ? { ...s, alt } : s))
    );
  };

  if (data === undefined) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-muted rounded-md" />
        <div className="h-24 bg-muted rounded-md" />
        <div className="h-40 bg-muted rounded-md" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Hero text</CardTitle>
          <CardDescription>
            Headline, supporting text, and call-to-action buttons on the home
            page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Textarea
              id="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              rows={3}
              className="resize-y min-h-[4.5rem]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subheadline">Subheadline</Label>
            <Textarea
              id="subheadline"
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              rows={4}
              className="resize-y"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="primary-label">Primary button label</Label>
              <Input
                id="primary-label"
                value={primaryCtaLabel}
                onChange={(e) => setPrimaryCtaLabel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary-href">Primary button link</Label>
              <Input
                id="primary-href"
                value={primaryCtaHref}
                onChange={(e) => setPrimaryCtaHref(e.target.value)}
                placeholder="/programs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-label">Secondary button label</Label>
              <Input
                id="secondary-label"
                value={secondaryCtaLabel}
                onChange={(e) => setSecondaryCtaLabel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-href">Secondary button link</Label>
              <Input
                id="secondary-href"
                value={secondaryCtaHref}
                onChange={(e) => setSecondaryCtaHref(e.target.value)}
                placeholder="/contact"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Background images</CardTitle>
          <CardDescription>
            Carousel photos behind the hero text. Drop or select multiple images
            at once if you like. Edit each slide&apos;s alt text after upload.
            At least one image is required when you save.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="new-alt">
              Alt text for the next upload (applied to every image in a batch)
            </Label>
            <Input
              id="new-alt"
              value={newAlt}
              onChange={(e) => setNewAlt(e.target.value)}
              placeholder="Describe the image for accessibility"
            />
          </div>

          <UploadDropzone
            endpoint="heroImageUploader"
            onClientUploadComplete={(res) => {
              const alt = newAlt.trim() || "Hero background";
              const additions =
                res
                  ?.map((f) => f.url)
                  .filter((url): url is string => Boolean(url)) ?? [];
              if (additions.length === 0) return;
              setSlides((prev) => [
                ...prev,
                ...additions.map((url) => ({ url, alt })),
              ]);
              toast({
                title:
                  additions.length === 1
                    ? "Image added"
                    : `${additions.length} images added`,
                description: "Save to publish.",
              });
            }}
            onUploadError={(error: Error) => {
              toast({
                title: "Upload failed",
                description: error.message,
                variant: "destructive",
              });
            }}
            className="ut-label:text-primary ut-upload-icon:text-primary/80 ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
            appearance={{
              button:
                "bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700",
              label: "text-sm text-muted-foreground",
              container: "flex flex-col items-center space-y-4",
            }}
          />

          <div className="space-y-4">
            <Label>Slides (order = rotation order)</Label>
            <ul className="grid gap-4 sm:grid-cols-2">
              {slides.map((slide, index) => (
                <li
                  key={`${slide.url}-${index}`}
                  className="rounded-lg border bg-card p-3 space-y-2"
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
                    <Image
                      src={slide.url}
                      alt={slide.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <Input
                    value={slide.alt}
                    onChange={(e) => updateSlideAlt(index, e.target.value)}
                    placeholder="Alt text"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 text-destructive hover:text-destructive"
                    onClick={() => removeSlide(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
            {slides.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No slides yet. Upload at least one image before saving.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {data.hasStoredConfig
            ? "Custom hero is stored in the database."
            : "Showing built-in defaults until you save."}
        </p>
        <Button onClick={handleSave} disabled={saving || slides.length === 0}>
          {saving ? "Saving…" : "Save hero"}
        </Button>
      </div>
    </div>
  );
}
