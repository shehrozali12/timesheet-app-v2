export function isAuthorized(request: Request): boolean {
  const apiKey = request.headers.get("x-api-key");
  return apiKey === process.env.API_SECRET_KEY;
}