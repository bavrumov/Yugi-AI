import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Requires UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (set automatically
// when the Upstash Redis integration is connected via the Vercel Marketplace).
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? Redis.fromEnv()
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
    console.warn("Rate limiting disabled: UPSTASH_REDIS_REST_URL/TOKEN not set");
    return { success: true, remaining: Infinity };
  }

  const { success, remaining } = await judgeRatelimit.limit(ip);
  return { success, remaining };
}
