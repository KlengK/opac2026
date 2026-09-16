export const SOURCE_TIMEOUT_MS = 7000;

// Cache external responses for a day. Query strings vary per search, so this is
// effectively a per-query cache — enough for a prototype without Redis.
const REVALIDATE_SECONDS = 86400;

export async function fetchJson(url, { timeout = SOURCE_TIMEOUT_MS, headers = {} } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json", ...headers },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} from ${new URL(url).hostname}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

export function buildUrl(base, params) {
  const url = new URL(base);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}
