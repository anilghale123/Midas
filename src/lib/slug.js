import slugify from "slugify";

export function toSlug(input) {
  return slugify(String(input ?? ""), { lower: true, strict: true, trim: true });
}

export async function uniqueSlug(Model, base, excludeId = null) {
  let candidate = toSlug(base) || "item";
  let n = 1;

  while (true) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Model.exists(query);
    if (!exists) return candidate;
    n += 1;
    candidate = `${toSlug(base)}-${n}`;
  }
}
