import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiUploadCloud } from "react-icons/fi";
import { PageTitle, Card, Field, Spinner, Empty, Modal } from "../../components/admin/ui";
import { contentApi, uploadsApi } from "../../services/api";

const EMPTY = { title: "", excerpt: "", content: "", cover_image: "", author: "Wallmark Realtors", tags: "", is_published: true };

export default function ManageBlog() {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = () => contentApi.blog().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (editing.id) await contentApi.updateBlog(editing.id, editing);
    else await contentApi.createBlog(editing);
    setEditing(null);
    load();
  };
  const remove = async (id) => {
    if (!confirm("Delete this blog post?")) return;
    await contentApi.removeBlog(id);
    load();
  };
  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadsApi.generic(file);
      setEditing((b) => ({ ...b, cover_image: res.url }));
    } catch {
      alert("Upload failed. Check Cloudinary settings or paste an image URL.");
    } finally {
      setUploading(false);
    }
  };

  if (!items) return <Spinner />;

  return (
    <div>
      <PageTitle title="Blog Posts" action={<button onClick={() => setEditing(EMPTY)} className="btn-gold"><FiPlus /> New Post</button>} />

      {items.length === 0 ? (
        <Empty message="No blog posts yet." />
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <Card key={p.id} className="flex items-center gap-4">
              <img src={p.cover_image || "https://via.placeholder.com/80"} alt="" className="h-16 w-16 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-navy-900">{p.title}</p>
                <p className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()} {!p.is_published && "· Draft"}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(p)} className="rounded-lg border border-gray-200 p-2 text-navy-900 hover:text-gold"><FiEdit2 /></button>
                <button onClick={() => remove(p.id)} className="rounded-lg border border-gray-200 p-2 text-red-500"><FiTrash2 /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? "Edit Post" : "New Post"} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-4">
            <Field label="Title"><input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="input-luxe" /></Field>
            <Field label="Cover Image">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-6 hover:border-gold">
                <FiUploadCloud className="text-2xl text-gold" />
                <span className="mt-1 text-xs text-gray-500">{uploading ? "Uploading..." : "Upload image"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={upload} />
              </label>
              <input value={editing.cover_image || ""} onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })} placeholder="or paste image URL" className="input-luxe mt-2" />
            </Field>
            <Field label="Excerpt"><textarea rows={2} value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} className="input-luxe resize-none" /></Field>
            <Field label="Content"><textarea required rows={8} value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} className="input-luxe resize-none" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Author"><input value={editing.author || ""} onChange={(e) => setEditing({ ...editing, author: e.target.value })} className="input-luxe" /></Field>
              <Field label="Tags (comma separated)"><input value={editing.tags || ""} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} className="input-luxe" /></Field>
            </div>
            <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={editing.is_published} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} className="h-4 w-4 accent-gold" /> Published</label>
            <button className="btn-gold w-full">Save Post</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
