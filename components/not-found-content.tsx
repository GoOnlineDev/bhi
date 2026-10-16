import Link from "next/link";

export default function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 sm:py-16 text-center">
      <p className="text-primary font-semibold mb-2">404</p>
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">Page not found</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-xl">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90">
          Go back home
        </Link>
        <Link href="/contact" className="px-6 py-3 rounded-lg border border-primary text-primary font-semibold hover:bg-primary/10">
          Contact us
        </Link>
      </div>
    </div>
  );
}
