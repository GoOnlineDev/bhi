import { HeroSettingsForm } from "@/components/dashboard/hero/hero-settings-form";

export default function DashboardHeroPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Home hero</h1>
        <p className="text-muted-foreground">
          Edit the main banner on the public home page: rotating backgrounds
          and headline copy.
        </p>
      </div>
      <HeroSettingsForm />
    </div>
  );
}
