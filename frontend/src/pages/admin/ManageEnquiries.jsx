import { useEffect, useState } from "react";
import { FiTrash2, FiCheck, FiMail, FiPhone } from "react-icons/fi";
import { PageTitle, Card, Spinner, Empty } from "../../components/admin/ui";
import { enquiriesApi } from "../../services/api";

export default function ManageEnquiries() {
  const [items, setItems] = useState(null);
  const [filter, setFilter] = useState("all");

  const load = () => enquiriesApi.list().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await enquiriesApi.markRead(id);
    load();
  };
  const remove = async (id) => {
    if (!confirm("Delete this enquiry?")) return;
    await enquiriesApi.remove(id);
    load();
  };

  if (!items) return <Spinner />;

  const filtered = items.filter((e) =>
    filter === "all" ? true : filter === "unread" ? !e.is_read : e.enquiry_type === filter
  );

  const types = ["all", "unread", "contact", "buy", "sell", "lease", "home_loan", "interiors", "redevelopment"];

  return (
    <div>
      <PageTitle title="Enquiries" subtitle={`${items.length} total · ${items.filter((e) => !e.is_read).length} unread`} />

      <div className="mb-5 flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${
              filter === t ? "bg-gold text-navy-900" : "bg-white text-gray-500 hover:text-navy-900"
            }`}
          >
            {t.replace("_", " ")}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Empty message="No enquiries found." />
      ) : (
        <div className="space-y-3">
          {filtered.map((e) => (
            <Card key={e.id} className={`${!e.is_read ? "border-l-4 border-gold" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-navy-900">{e.name}</h3>
                    <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs capitalize text-navy-900">{e.enquiry_type?.replace("_", " ")}</span>
                    {!e.is_read && <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-xs text-gold">New</span>}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                    {e.email && <a href={`mailto:${e.email}`} className="flex items-center gap-1.5 hover:text-gold"><FiMail /> {e.email}</a>}
                    {e.phone && <a href={`tel:${e.phone}`} className="flex items-center gap-1.5 hover:text-gold"><FiPhone /> {e.phone}</a>}
                  </div>
                  {e.subject && <p className="mt-2 text-sm font-medium text-navy-900">{e.subject}</p>}
                  {e.message && <p className="mt-1 text-sm text-gray-600">{e.message}</p>}
                  {e.property_ref && <p className="mt-2 text-xs text-gold">Re: {e.property_ref}</p>}
                  <p className="mt-2 text-xs text-gray-400">{new Date(e.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  {!e.is_read && (
                    <button onClick={() => markRead(e.id)} title="Mark as read" className="rounded-lg border border-gray-200 p-2 text-green-600 hover:border-green-400">
                      <FiCheck />
                    </button>
                  )}
                  <button onClick={() => remove(e.id)} title="Delete" className="rounded-lg border border-gray-200 p-2 text-red-500 hover:border-red-400">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
