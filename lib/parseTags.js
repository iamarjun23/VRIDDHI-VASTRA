export function parseTags(tagsString) {
  if (!tagsString) return [];
  if (Array.isArray(tagsString)) return tagsString;
  return tagsString
    .split(",")
    .map(t => t.trim())
    .filter(t => t.length > 0);
}
