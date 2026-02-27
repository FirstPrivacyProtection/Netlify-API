export function getIPData(request) {
  const ip =
    request.headers.get("x-forwarded-for") ||
    "unknown";

  return { ip };
}
