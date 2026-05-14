import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import PageContent from "@/models/PageContent";

// Read-side helper. Each page passes a `key` and a `fallback` (the original
// static export from src/data/*). If the DB document exists, we deep-merge
// its `data` over the fallback so partial saves (e.g. only the hero) don't
// blank out sections that the editor hasn't touched yet.

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function deepMerge(base, override) {
  if (!isPlainObject(base) || !isPlainObject(override)) return override ?? base;
  const out = { ...base };
  for (const k of Object.keys(override)) {
    const a = base?.[k];
    const b = override[k];
    if (isPlainObject(a) && isPlainObject(b)) {
      out[k] = deepMerge(a, b);
    } else if (b !== undefined) {
      out[k] = b;
    }
  }
  return out;
}

async function readPageContent(key) {
  if (!process.env.MONGODB_URI) return null;
  try {
    await connectDB();
    const doc = await PageContent.findOne({ key }).lean();
    return doc?.data ?? null;
  } catch {
    return null;
  }
}

export function getPageContent(key, fallback) {
  return unstable_cache(
    async () => {
      const dbData = await readPageContent(key);
      if (!dbData) return fallback;
      return deepMerge(fallback, dbData);
    },
    [`page-content:${key}`],
    { tags: ["page-content", `page-content:${key}`], revalidate: 3600 }
  )();
}
