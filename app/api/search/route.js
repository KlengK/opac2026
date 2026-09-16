import { aggregate } from "@/lib/aggregate.js";

export async function GET(request) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return Response.json({ error: "Provide a search term with ?q=" }, { status: 400 });
  }

  if (query.length > 300) {
    return Response.json({ error: "Search term is too long." }, { status: 400 });
  }

  const limit = clamp(Number(request.nextUrl.searchParams.get("limit")) || 12, 1, 25);

  try {
    const payload = await aggregate(query, { limit });
    return Response.json(payload, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (error) {
    console.error("Search failed:", error);
    return Response.json({ error: "Search failed. Please try again." }, { status: 502 });
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
