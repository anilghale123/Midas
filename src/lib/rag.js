import { connectDB } from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import Notice from "@/models/Notice";
import Service from "@/models/Service";
import { logger } from "@/lib/logger";

const MAX_FAQS = 4;
const MAX_NOTICES = 3;
const MAX_SERVICES = 3;
const MAX_CHARS_PER_DOC = 600;

function truncate(str, max = MAX_CHARS_PER_DOC) {
  if (!str) return "";
  const clean = String(str).replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max) + "…" : clean;
}

function stripHtml(html) {
  if (!html) return "";
  return String(html).replace(/<[^>]+>/g, " ");
}

/**
 * Retrieve relevant FAQ / Notice / Service docs for a user query.
 * Uses MongoDB $text indexes (already present on FAQ.question/answer and
 * Notice.title/content). Falls back gracefully if text search fails.
 */
export async function retrieveContext(query) {
  if (!query || typeof query !== "string") return { faqs: [], notices: [], services: [] };

  await connectDB();

  const safeQuery = query.slice(0, 200);

  let faqs = [];
  let notices = [];
  let services = [];

  try {
    faqs = await FAQ.find(
      { $text: { $search: safeQuery }, isActive: true },
      { score: { $meta: "textScore" }, question: 1, answer: 1, category: 1 }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(MAX_FAQS)
      .lean();
  } catch (err) {
    logger.warn({ err }, "rag: faq text search failed");
  }

  try {
    notices = await Notice.find(
      { $text: { $search: safeQuery }, isActive: true },
      { score: { $meta: "textScore" }, title: 1, content: 1, category: 1, publishedAt: 1, slug: 1 }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(MAX_NOTICES)
      .lean();
  } catch (err) {
    logger.warn({ err }, "rag: notice text search failed");
  }

  // Services has no $text index — fall back to regex on title + description.
  try {
    const rx = new RegExp(
      safeQuery
        .split(/\s+/)
        .filter((w) => w.length > 2)
        .slice(0, 5)
        .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|") || safeQuery,
      "i"
    );
    services = await Service.find({
      isActive: true,
      $or: [{ title: rx }, { shortDescription: rx }, { description: rx }, { category: rx }],
    })
      .select("title shortDescription description category ctaHref")
      .sort({ order: 1 })
      .limit(MAX_SERVICES)
      .lean();
  } catch (err) {
    logger.warn({ err }, "rag: service search failed");
  }

  return { faqs, notices, services };
}

/**
 * Format retrieved docs as a single context block to inject into the
 * system prompt. Keep it compact so we don't blow the token budget.
 */
export function formatContext({ faqs, notices, services }) {
  const parts = [];

  if (faqs?.length) {
    parts.push("### Relevant FAQs");
    for (const f of faqs) {
      parts.push(
        `Q: ${truncate(f.question, 200)}\nA: ${truncate(stripHtml(f.answer))}`
      );
    }
  }

  if (notices?.length) {
    parts.push("\n### Relevant Notices");
    for (const n of notices) {
      const date = n.publishedAt ? new Date(n.publishedAt).toISOString().slice(0, 10) : "";
      parts.push(
        `- (${date}) ${truncate(n.title, 160)}\n  ${truncate(stripHtml(n.content), 300)}`
      );
    }
  }

  if (services?.length) {
    parts.push("\n### Relevant Services");
    for (const s of services) {
      parts.push(
        `- ${truncate(s.title, 120)}: ${truncate(stripHtml(s.shortDescription || s.description), 240)}`
      );
    }
  }

  if (!parts.length) return "(No matching FAQs, notices, or services found in the database.)";

  return parts.join("\n");
}
