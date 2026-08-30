import { ratelimit } from "./ratelimit";

export function isAuthorized(request: Request): boolean {
  const apiKey = request.headers.get("x-api-key");
  return apiKey === process.env.API_SECRET_KEY;
}

export async function checkRateLimit(request: Request) {
  const apiKey = request.headers.get("x-api-key") ?? "anonymous";
  const { success, limit, remaining } = await ratelimit.limit(apiKey);
  return { success, limit, remaining };
}