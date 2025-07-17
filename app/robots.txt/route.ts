import { NextResponse } from 'next/server';

export async function GET() {
  const content = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /api
Sitemap: https://www.boosthealthinitiative.org/sitemap.xml
`;
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
} 