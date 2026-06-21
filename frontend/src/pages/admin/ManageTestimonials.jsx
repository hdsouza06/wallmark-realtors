import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiStar } from "react-icons/fi";
import { PageTitle, Card, Field, Spinner, Empty, Modal } from "../../components/admin/ui";
import { contentApi } from "../../services/api";

const EMPTY = { name: "", role: "", message: "", rating: 5, avatar_url: "", is_published: true, position: 0 };

export default function ManageTestimonials() {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = () => contentApi.allTestimonials().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...editing, rating: Number(editing.rating), position: Number(editing.position) };
    if (editing.id) await contentApi.updateTestimonial(editing.id, payload);
    else await contentApi.createTestimonial(payload);
    setEditing(null);
    load();
  };
  const remove = async (id) => {
    if (!confirm("Delete this testimonial?")) return;
    await contentApi.removeTestimonial(id);
    load();
  };

  if (!items) return <Spinner />;

  return (
    <div>
      <PageTitle
        title="Testimonials"
        action={<button onClick={() => setEditing(EMPTY)} className="btn-gold"><FiPlus /> Add Testimonial</button>}
      />

      {items.length === 0 ? (
        <Empty message="No testimonials yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <Card key={t.id}>
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: t.rating }).map((_, i) => <FiStar key={i} className="fill-gold" />)}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(t)} className="text-navy-900 hover:text-gold"><FiEdit2 /></button>
                  <button onClick={() => remove(t.id)} className="text-red-500"><FiTrash2 /></button>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600">"{t.message}"</p>
              <p className="mt-3 font-semibold text-navy-900">{t.name}</p>
              <p className="text-xs text-gray-400">{t.role} {!t.is_published && "· Hidden"}</p>
            </Card>
          ))}
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? "Edit Testimonial" : "Add Testimonial"} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-4">
            <Field label="Name"><input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input-luxe" /></Field>
            <Field label="Role"><input value={editing.role || ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className="input-luxe" placeholder="e.g. Home Buyer" /></Field>
            <Field label="Message"><textarea required rows={4} value={editing.message} onChange={(e) => setEditing({ ...editing, message: e.target.value })} className="input-luxe resize-none" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Rating (1-5)"><input type="number" min="1" max="5" value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: e.target.value })} className="input-luxe" /></Field>
              <Field label="Position"><input type="number" value={editing.position} onChange={(e) => setEditing({ ...editing, position: e.target.value })} className="input-luxe" /></Field>
            </div>
            <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={editing.is_published} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} className="h-4 w-4 accent-gold" /> Published</label>
            <button className="btn-gold w-full">Save</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
