export function toggleColorScheme(root: HTMLElement): "light" | "dark" {
  const next = root.dataset.colorScheme === "dark" ? "light" : "dark";
  root.dataset.colorScheme = next;
  return next;
}
