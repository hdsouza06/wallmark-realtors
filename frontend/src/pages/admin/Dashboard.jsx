import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiHome, FiMail, FiStar, FiEdit3, FiPlus, FiArrowRight } from "react-icons/fi";
import { Card, PageTitle, Spinner } from "../../components/admin/ui";
import { propertiesApi, enquiriesApi, contentApi } from "../../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentEnq, setRecentEnq] = useState([]);

  useEffect(() => {
    Promise.all([
      propertiesApi.list({ page_size: 1 }),
      enquiriesApi.list(),
      contentApi.allTestimonials(),
      contentApi.blog(),
    ])
      .then(([props, enq, test, blog]) => {
        setStats({
          properties: props.total,
          enquiries: enq.length,
          unread: enq.filter((e) => !e.is_read).length,
          testimonials: test.length,
          blog: blog.length,
        });
        setRecentEnq(enq.slice(0, 5));
      })
      .catch(() => setStats({ properties: 0, enquiries: 0, unread: 0, testimonials: 0, blog: 0 }));
  }, []);

  if (!stats) return <Spinner />;

  const cards = [
    { label: "Total Properties", value: stats.properties, Icon: FiHome, to: "/admin/properties", color: "bg-navy-900" },
    { label: "Enquiries", value: stats.enquiries, sub: `${stats.unread} unread`, Icon: FiMail, to: "/admin/enquiries", color: "bg-gold" },
    { label: "Testimonials", value: stats.testimonials, Icon: FiStar, to: "/admin/testimonials", color: "bg-navy-900" },
    { label: "Blog Posts", value: stats.blog, Icon: FiEdit3, to: "/admin/blog", color: "bg-gold" },
  ];

  return (
    <div>
      <PageTitle
        title="Dashboard"
        subtitle="Welcome back. Here's an overview of your website."
        action={
          <Link to="/admin/properties/new" className="btn-gold">
            <FiPlus /> Add Property
          </Link>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="group">
            <Card className="flex items-center gap-4 transition group-hover:-translate-y-1">
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl text-white ${c.color}`}>
                <c.Icon />
              </span>
              <div>
                <p className="text-2xl font-bold text-navy-900">{c.value}</p>
                <p className="text-xs text-gray-500">{c.label}</p>
                {c.sub && <p className="text-xs font-semibold text-gold">{c.sub}</p>}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy-900">Recent Enquiries</h2>
          <Link to="/admin/enquiries" className="flex items-center gap-1 text-sm font-semibold text-gold">
            View All <FiArrowRight />
          </Link>
        </div>
        {recentEnq.length ? (
          <div className="divide-y divide-gray-100">
            {recentEnq.map((e) => (
              <div key={e.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-navy-900">{e.name} {!e.is_read && <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 text-xs text-gold">New</span>}</p>
                  <p className="text-sm text-gray-500">{e.subject || e.message?.slice(0, 50) || e.enquiry_type}</p>
                </div>
                <span className="text-xs text-gray-400">{new Date(e.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-gray-400">No enquiries yet.</p>
        )}
      </Card>
    </div>
  );
}
