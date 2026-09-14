import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Vercel's Upstash Redis Marketplace integration injects KV_REST_API_URL /
// KV_REST_API_TOKEN by default (legacy "Vercel KV" naming), not
// UPSTASH_REDIS_REST_URL/TOKEN as @upstash/redis's own docs suggest — Redis.fromEnv()
// looks for the latter and would silently find nothing. Fall back to the
// UPSTASH_-prefixed names too, in case a raw Upstash account is wired in directly.
const restUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const restToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = restUrl && restToken
  ? new Redis({ url: restUrl, token: restToken })
  : null;

const judgeRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      prefix: "yugiai:judge",
    })
  : null;

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

// Fails open (allows the request) if Redis isn't configured, so local dev
// without Upstash env vars still works. Logs once per miss so the gap is visible.
export async function checkRateLimit(ip: string): Promise<{ success: boolean; remaining: number }> {
  if (!judgeRatelimit) {
    console.warn("Rate limiting disabled: KV_REST_API_URL/TOKEN (or UPSTASH_REDIS_REST_URL/TOKEN) not set");
    return { success: true, remaining: Infinity };
  }

  const { success, remaining } = await judgeRatelimit.limit(ip);
  return { success, remaining };
}
