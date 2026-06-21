import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiUploadCloud } from "react-icons/fi";
import { PageTitle, Card, Field, Spinner, Empty, Modal } from "../../components/admin/ui";
import { contentApi, uploadsApi } from "../../services/api";

const EMPTY = { title: "", subtitle: "", image_url: "", cta_text: "", cta_link: "", is_active: true, position: 0 };

export default function ManageBanners() {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = () => contentApi.banners().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...editing, position: Number(editing.position) };
    if (editing.id) await contentApi.updateBanner(editing.id, payload);
    else await contentApi.createBanner(payload);
    setEditing(null);
    load();
  };
  const remove = async (id) => {
    if (!confirm("Delete this banner?")) return;
    await contentApi.removeBanner(id);
    load();
  };
  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadsApi.generic(file);
      setEditing((b) => ({ ...b, image_url: res.url, public_id: res.public_id }));
    } catch {
      alert("Upload failed. Check Cloudinary settings or paste an image URL.");
    } finally {
      setUploading(false);
    }
  };

  if (!items) return <Spinner />;

  return (
    <div>
      <PageTitle title="Banners" subtitle="Homepage hero banners" action={<button onClick={() => setEditing(EMPTY)} className="btn-gold"><FiPlus /> Add Banner</button>} />

      {items.length === 0 ? (
        <Empty message="No banners yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((b) => (
            <Card key={b.id} className="p-0 overflow-hidden">
              <div className="relative h-40">
                <img src={b.image_url} alt={b.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-navy-900/50 p-4 text-white">
                  <p className="font-semibold">{b.title}</p>
                  <p className="text-xs text-white/70">{b.subtitle}</p>
                </div>
                <div className="absolute right-2 top-2 flex gap-2">
                  <button onClick={() => setEditing(b)} className="rounded-lg bg-white p-2 text-navy-900"><FiEdit2 /></button>
                  <button onClick={() => remove(b.id)} className="rounded-lg bg-white p-2 text-red-500"><FiTrash2 /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? "Edit Banner" : "Add Banner"} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-4">
            <Field label="Banner Image">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-6 hover:border-gold">
                <FiUploadCloud className="text-2xl text-gold" />
                <span className="mt-1 text-xs text-gray-500">{uploading ? "Uploading..." : "Upload image"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={upload} />
              </label>
              <input value={editing.image_url} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} placeholder="or paste image URL" className="input-luxe mt-2" />
            </Field>
            {editing.image_url && <img src={editing.image_url} alt="" className="h-32 w-full rounded-xl object-cover" />}
            <Field label="Title"><input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="input-luxe" /></Field>
            <Field label="Subtitle"><input value={editing.subtitle} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} className="input-luxe" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="CTA Text"><input value={editing.cta_text || ""} onChange={(e) => setEditing({ ...editing, cta_text: e.target.value })} className="input-luxe" /></Field>
              <Field label="CTA Link"><input value={editing.cta_link || ""} onChange={(e) => setEditing({ ...editing, cta_link: e.target.value })} placeholder="/buy" className="input-luxe" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Position"><input type="number" value={editing.position} onChange={(e) => setEditing({ ...editing, position: e.target.value })} className="input-luxe" /></Field>
              <label className="flex items-center gap-3 pt-7 text-sm"><input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} className="h-4 w-4 accent-gold" /> Active</label>
            </div>
            <button disabled={!editing.image_url} className="btn-gold w-full">Save</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
