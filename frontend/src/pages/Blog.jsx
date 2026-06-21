import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCalendar } from "react-icons/fi";
import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { contentApi } from "../services/api";

const PLACEHOLDER = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80";

export default function Blog() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    contentApi.blog().then(setPosts).catch(() => setPosts([]));
  }, []);

  return (
    <>
      <Seo title="Blog & Insights" description="Real estate insights, buying guides and market trends from Wallmark Realtors." />
      <PageHero
        eyebrow="Insights & News"
        title="The Wallmark Journal"
        subtitle="Expert advice, market trends and guides for the discerning buyer."
        breadcrumb="Blog"
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=80"
      />

      <section className="container-luxe py-20 lg:py-28">
        {posts === null ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl shadow-luxe">
                <div className="skeleton h-52 w-full" />
                <div className="space-y-3 p-6">
                  <div className="skeleton h-5 w-3/4 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} index={i}>
                <Link to={`/blog/${post.slug}`} className="group block overflow-hidden rounded-2xl bg-white shadow-luxe">
                  <div className="h-52 overflow-hidden">
                    <img src={post.cover_image || PLACEHOLDER} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-6">
                    <p className="flex items-center gap-2 text-xs text-gold">
                      <FiCalendar /> {new Date(post.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold text-navy-900 group-hover:text-gold">{post.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">{post.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                      Read More <FiArrowRight className="transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No blog posts yet. Check back soon!</p>
        )}
      </section>
    </>
  );
}
