import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiStar } from "react-icons/fi";
import { PageTitle, Card, Spinner, Empty } from "../../components/admin/ui";
import { propertiesApi } from "../../services/api";
import { formatPrice } from "../../config/site";

export default function ManageProperties() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);

  const load = () => {
    propertiesApi.list({ page, page_size: 20, sort: "newest" }).then(setData).catch(() => setData({ items: [] }));
  };
  useEffect(load, [page]);

  const remove = async (id) => {
    if (!confirm("Delete this property? This cannot be undone.")) return;
    await propertiesApi.remove(id);
    load();
  };

  if (!data) return <Spinner />;

  return (
    <div>
      <PageTitle
        title="Properties"
        subtitle={`${data.total ?? data.items.length} total`}
        action={
          <Link to="/admin/properties/new" className="btn-gold">
            <FiPlus /> Add Property
          </Link>
        }
      />

      {data.items.length === 0 ? (
        <Empty message="No properties yet. Add your first listing." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="p-4">Property</th>
                <th className="p-4">Type</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.items.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]?.url || "https://via.placeholder.com/60"} alt="" className="h-12 w-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-navy-900">
                          {p.title} {p.is_featured && <FiStar className="ml-1 inline fill-gold text-gold" />}
                        </p>
                        <p className="text-xs text-gray-400">{p.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 capitalize">{p.listing_type} · {p.property_type || "-"}</td>
                  <td className="p-4">{formatPrice(p.price, p.listing_type)}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium capitalize text-navy-900">
                      {p.status?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/properties/${p.id}`} className="rounded-lg border border-gray-200 p-2 text-navy-900 hover:border-gold hover:text-gold">
                        <FiEdit2 />
                      </Link>
                      <button onClick={() => remove(p.id)} className="rounded-lg border border-gray-200 p-2 text-red-500 hover:border-red-400">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {data.pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: data.pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-9 w-9 rounded-lg text-sm ${page === i + 1 ? "bg-gold text-navy-900" : "bg-white"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
