import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiCalendar, FiUser, FiArrowLeft } from "react-icons/fi";
import Seo from "../components/Seo";
import { contentApi } from "../services/api";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    contentApi.blogPost(slug).then(setPost).catch(() => setError(true));
  }, [slug]);

  if (error) {
    return (
      <div className="container-luxe flex min-h-[60vh] flex-col items-center justify-center pt-24 text-center">
        <h1 className="text-3xl font-semibold text-navy-900">Post not found</h1>
        <Link to="/blog" className="btn-gold mt-6">Back to Blog</Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-luxe pt-32">
        <div className="skeleton mx-auto h-8 w-2/3 rounded" />
        <div className="skeleton mx-auto mt-6 h-96 w-full rounded-2xl" />
      </div>
    );
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.cover_image,
    datePublished: post.created_at,
    author: { "@type": "Organization", name: post.author || "Wallmark Realtors" },
  };

  return (
    <>
      <Seo title={post.title} description={post.excerpt} image={post.cover_image} type="article" schema={schema} />
      <article className="pt-28">
        <div className="container-luxe max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gold">
            <FiArrowLeft /> Back to Blog
          </Link>
          <h1 className="mt-6 text-3xl font-bold leading-tight text-navy-900 sm:text-5xl">{post.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-gray-500">
            <span className="flex items-center gap-2"><FiUser className="text-gold" /> {post.author}</span>
            <span className="flex items-center gap-2"><FiCalendar className="text-gold" /> {new Date(post.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </div>

        {post.cover_image && (
          <div className="container-luxe mt-10 max-w-4xl">
            <img src={post.cover_image} alt={post.title} className="h-[420px] w-full rounded-3xl object-cover shadow-luxe" />
          </div>
        )}

        <div className="container-luxe mt-12 max-w-3xl pb-24">
          <div className="whitespace-pre-line text-lg leading-relaxed text-gray-700">{post.content}</div>
          {post.tags && (
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.split(",").map((t) => (
                <span key={t} className="rounded-full bg-cream px-4 py-1.5 text-xs font-medium text-navy-900">#{t.trim()}</span>
              ))}
            </div>
          )}
        </div>
      </article>
    </>
  );
}
