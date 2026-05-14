import Link from "next/link";
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import Notice from "@/models/Notice";

export const metadata = {
  title: "Notices | MIDAS Stock Broking",
  description: "Latest notices, market updates, and regulatory announcements from MIDAS.",
};

export const revalidate = 3600;

const getActiveNotices = unstable_cache(
  async () => {
    if (!process.env.MONGODB_URI) return [];
    try {
      await connectDB();
      const docs = await Notice.find({ isActive: true })
        .sort({ publishedAt: -1, _id: -1 })
        .limit(50)
        .lean();
      return docs.map((n) => ({
        _id: String(n._id),
        title: n.title,
        slug: n.slug,
        category: n.category,
        publishedAt: n.publishedAt ?? n.createdAt,
        attachmentUrl: n.attachmentUrl ?? null,
      }));
    } catch {
      return [];
    }
  },
  ["public-notices"],
  { tags: ["notices"], revalidate: 3600 }
);

export default async function PublicNoticesPage() {
  const items = await getActiveNotices();

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Notices</h1>
        <p className="mt-2 text-slate-600">
          Market updates, regulatory announcements, and corporate notices.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-500">No notices have been published yet.</p>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {items.map((n) => (
            <li key={n._id} className="p-5 hover:bg-slate-50">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {n.category}
                  </span>
                  <h2 className="mt-2 text-lg font-semibold text-slate-900">
                    <Link href={`/notices/${n.slug}`} className="hover:underline">
                      {n.title}
                    </Link>
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Published {new Date(n.publishedAt).toLocaleDateString()}
                  </p>
                </div>
                {n.attachmentUrl && (
                  <a
                    href={n.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Download
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
