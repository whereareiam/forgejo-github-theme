export function loginRedirect(location: URL): string {
  const target = location.searchParams.get("next");
  return target && target.startsWith("/") ? target : "/";
}
