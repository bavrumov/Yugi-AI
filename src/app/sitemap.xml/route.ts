import { NextResponse } from "next/server";

export const runtime = "edge"; // Ensures it's included in Vercel deployment

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://yugiai.com/</loc>
        <lastmod>2025-03-05T12:34:56Z</lastmod>
        <priority>1.0</priority>
      </url>
    </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}