import { NextResponse } from 'next/server';

export async function GET() {
  // In a real app, fetch slugs/IDs for dynamic pages from your DB
  const staticPages = [
    '',
    'about',
    'contact',
    'gallery',
    'news',
    'programs',
  ];
  // Example dynamic pages (replace with real slugs/IDs)
  const newsPages = ['news/1', 'news/2'];
  const programPages = ['programs/1', 'programs/2'];

  const allPages = [
    ...staticPages,
    ...newsPages,
    ...programPages,
  ];

  const baseUrl = 'https://www.boosthealthinitiative.com';
  const urls = allPages.map(
    (path) =>
      `<url><loc>${baseUrl}/${path}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`
  ).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 