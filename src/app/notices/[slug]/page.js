import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import Notice from "@/models/Notice";

export const revalidate = 3600;

function getCachedNotice(slug) {
  return unstable_cache(
    async () => {
      if (!process.env.MONGODB_URI) return null;
      try {
        await connectDB();
        const doc = await Notice.findOne({ slug, isActive: true }).lean();
        if (!doc) return null;
        return {
          _id: String(doc._id),
          title: doc.title,
          slug: doc.slug,
          category: doc.category,
          content: doc.content,
          publishedAt: doc.publishedAt ?? doc.createdAt,
          attachmentUrl: doc.attachmentUrl ?? null,
        };
      } catch {
        return null;
      }
    },
    ["public-notice", slug],
    { tags: ["notices", `notice:${slug}`], revalidate: 3600 }
  )();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const notice = await getCachedNotice(slug);
  if (!notice) return { title: "Notice not found | MIDAS" };
  return {
    title: `${notice.title} | MIDAS`,
    description: notice.content?.slice(0, 160),
  };
}

export default async function NoticeDetailPage({ params }) {
  const { slug } = await params;
  const notice = await getCachedNotice(slug);
  if (!notice) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/notices" className="text-sm text-slate-500 hover:text-slate-700">
        &larr; All notices
      </Link>
      <span className="mt-4 inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
        {notice.category}
      </span>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">{notice.title}</h1>
      <p className="mt-1 text-sm text-slate-500">
        Published {new Date(notice.publishedAt).toLocaleDateString()}
      </p>

      <div className="prose prose-slate mt-8 max-w-none whitespace-pre-wrap">
        {notice.content}
      </div>

      {notice.attachmentUrl && (
        <a
          href={notice.attachmentUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Download attachment
        </a>
      )}
    </article>
  );
}
