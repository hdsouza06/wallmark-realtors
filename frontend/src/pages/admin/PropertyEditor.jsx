import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiUploadCloud, FiTrash2, FiSave } from "react-icons/fi";
import { PageTitle, Card, Field, Spinner } from "../../components/admin/ui";
import { propertiesApi, uploadsApi } from "../../services/api";

const EMPTY = {
  title: "",
  description: "",
  price: 0,
  location: "",
  city: "",
  bhk: "",
  area_sqft: "",
  property_type: "apartment",
  listing_type: "buy",
  status: "available",
  amenities: "",
  youtube_url: "",
  is_featured: false,
  is_published: true,
};

export default function PropertyEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [propId, setPropId] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    propertiesApi.list({ page_size: 60 }).then((d) => {
      const p = d.items.find((x) => String(x.id) === String(id));
      if (p) {
        setForm({
          ...EMPTY,
          ...p,
          bhk: p.bhk ?? "",
          area_sqft: p.area_sqft ?? "",
        });
        setImages(p.images || []);
        setPropId(p.id);
      }
      setLoading(false);
    });
  }, [id, isEdit]);

  const update = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const buildPayload = () => ({
    ...form,
    price: Number(form.price) || 0,
    bhk: form.bhk === "" ? null : Number(form.bhk),
    area_sqft: form.area_sqft === "" ? null : Number(form.area_sqft),
  });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      let saved;
      if (isEdit) {
        saved = await propertiesApi.update(propId, buildPayload());
      } else {
        saved = await propertiesApi.create(buildPayload());
        setPropId(saved.id);
      }
      navigate("/admin/properties");
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to save property.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    let targetId = propId;
    if (!targetId) {
      // Create the property first so images have somewhere to attach.
      try {
        const saved = await propertiesApi.create(buildPayload());
        targetId = saved.id;
        setPropId(saved.id);
      } catch {
        setError("Save the property details before uploading images.");
        return;
      }
    }
    setUploading(true);
    setError("");
    try {
      const uploaded = await uploadsApi.propertyImages(targetId, files);
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err?.response?.data?.detail || "Image upload failed. Check Cloudinary settings.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (imgId) => {
    await uploadsApi.deleteImage(imgId);
    setImages((prev) => prev.filter((i) => i.id !== imgId));
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <button onClick={() => navigate("/admin/properties")} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gold">
        <FiArrowLeft /> Back to Properties
      </button>
      <PageTitle title={isEdit ? "Edit Property" : "Add Property"} />

      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <form onSubmit={save} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="space-y-4">
            <Field label="Title">
              <input required value={form.title} onChange={update("title")} className="input-luxe" />
            </Field>
            <Field label="Description">
              <textarea rows={5} value={form.description} onChange={update("description")} className="input-luxe resize-none" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Location">
                <input required value={form.location} onChange={update("location")} className="input-luxe" />
              </Field>
              <Field label="City">
                <input value={form.city} onChange={update("city")} className="input-luxe" />
              </Field>
            </div>
            <Field label="Amenities (comma separated)">
              <input value={form.amenities} onChange={update("amenities")} placeholder="Pool, Gym, Parking" className="input-luxe" />
            </Field>
            <Field label="YouTube Video URL">
              <input value={form.youtube_url} onChange={update("youtube_url")} placeholder="https://youtube.com/watch?v=..." className="input-luxe" />
            </Field>
          </Card>

          <Card>
            <p className="mb-3 text-sm font-medium text-navy-900">Images</p>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-10 text-center hover:border-gold">
              <FiUploadCloud className="text-3xl text-gold" />
              <span className="mt-2 text-sm text-gray-500">{uploading ? "Uploading..." : "Click to upload images"}</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {images.map((img) => (
                  <div key={img.id} className="group relative overflow-hidden rounded-xl">
                    <img src={img.url} alt="" className="h-24 w-full object-cover" />
                    <button type="button" onClick={() => removeImage(img.id)} className="absolute right-1 top-1 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition group-hover:opacity-100">
                      <FiTrash2 className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4">
            <Field label="Listing Type">
              <select value={form.listing_type} onChange={update("listing_type")} className="input-luxe">
                <option value="buy">Buy</option>
                <option value="lease">Lease</option>
              </select>
            </Field>
            <Field label="Property Type">
              <select value={form.property_type} onChange={update("property_type")} className="input-luxe">
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={update("status")} className="input-luxe">
                <option value="available">Available</option>
                <option value="under_offer">Under Offer</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </Field>
            <Field label="Price (₹)">
              <input type="number" value={form.price} onChange={update("price")} className="input-luxe" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="BHK">
                <input type="number" value={form.bhk} onChange={update("bhk")} className="input-luxe" />
              </Field>
              <Field label="Area (sqft)">
                <input type="number" value={form.area_sqft} onChange={update("area_sqft")} className="input-luxe" />
              </Field>
            </div>
            <label className="flex items-center gap-3 text-sm text-navy-900">
              <input type="checkbox" checked={form.is_featured} onChange={update("is_featured")} className="h-4 w-4 accent-gold" />
              Mark as Featured
            </label>
            <label className="flex items-center gap-3 text-sm text-navy-900">
              <input type="checkbox" checked={form.is_published} onChange={update("is_published")} className="h-4 w-4 accent-gold" />
              Published (visible on site)
            </label>
          </Card>

          <button disabled={saving} className="btn-gold w-full">
            <FiSave /> {saving ? "Saving..." : "Save Property"}
          </button>
        </div>
      </form>
    </div>
  );
}
