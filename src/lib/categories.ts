export const CATEGORIES = [
  "PORTRAITS",
  "NATURE & LANDSCAPES",
  "URBAN / ARCHITECTURE",
  "WILDLIFE",
  "MINIMALISM",
  "CONCEPTUAL",
  "EDITORIAL",
] as const;

export type Category = typeof CATEGORIES[number];

// URL-safe slugs (used in /category/:slug)
export const categoryToSlug = (c: string) =>
  c.toLowerCase().replace(/\s*\/\s*/g, "-").replace(/&/g, "and").replace(/\s+/g, "-");

export const slugToCategory = (slug: string): string | null => {
  const found = CATEGORIES.find((c) => categoryToSlug(c) === slug.toLowerCase());
  return found || null;
};

export const PHOTO_TYPES = [
  "Portrait",
  "Landscape",
  "Street",
  "Studio",
  "Outdoor",
  "Aerial",
  "Macro",
  "Documentary",
] as const;
