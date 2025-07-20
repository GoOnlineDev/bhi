"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
        404 – Page Not Found
      </h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
      >
        Go back home
      </Link>
    </main>
  );
}
