export function updateSearchParams(
  searchParams: string,
  changes: Record<string, string | number | undefined>
) {
  const newSearchParams = new URLSearchParams(searchParams);
  for (const [key, value] of Object.entries(changes)) {
    if (value === undefined) {
      newSearchParams.delete(key);
      continue;
    }
    newSearchParams.set(key, String(value));
  }
  return newSearchParams;
}

export function offsetToPage(offset: number, limit: number) {
  return Math.floor(offset / limit) + 1;
}

export function pageToOffset(page: number, limit: number) {
  return (page - 1) * limit;
}
