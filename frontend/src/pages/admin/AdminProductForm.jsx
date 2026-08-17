import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import client from "../../api/client";
import Spinner from "../../components/Spinner";
import { CATEGORIES } from "../../config";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: CATEGORIES[0],
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    client
      .get(`/products/${id}`)
      .then(({ data }) => {
        setForm({
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          category: data.category || CATEGORIES[0],
        });
        setExistingImages(data.images);
      })
      .catch(() => setError("Could not load this broom"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleFilesSelected(e) {
    const files = Array.from(e.target.files || []);
    const withPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewFiles((prev) => [...prev, ...withPreviews]);
    e.target.value = "";
  }

  function removeExistingImage(publicId) {
    setExistingImages((prev) => prev.filter((img) => img.publicId !== publicId));
  }

  function removeNewFile(idx) {
    setNewFiles((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  }

  useEffect(() => {
    return () => {
      newFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const totalImages = existingImages.length + newFiles.length;
    if (totalImages === 0) {
      setError("Please add at least one photo.");
      return;
    }

    setSaving(true);
    try {
      let uploadedImages = [];
      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach(({ file }) => formData.append("images", file));
        const { data } = await client.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedImages = data.images;
      }

      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        images: [...existingImages, ...uploadedImages],
      };

      if (isEdit) {
        await client.put(`/products/${id}`, payload);
        toast.success("Broom updated");
      } else {
        await client.post("/products", payload);
        toast.success("Broom added");
      }

      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save broom");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-semibold text-stone-900">
        {isEdit ? "Edit Broom" : "Add New Broom"}
      </h1>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-6">
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="input"
            placeholder="Coconut Fiber Broom"
          />
        </div>

        <div>
          <label className="label" htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className="input"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="price">Price</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.price}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="stock">Stock</label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              required
              value={form.stock}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <span className="label">Photos</span>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img) => (
              <div key={img.publicId} className="group relative h-24 w-24">
                <img
                  src={img.url}
                  alt=""
                  className="h-full w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.publicId)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white shadow"
                >
                  ✕
                </button>
              </div>
            ))}
            {newFiles.map((item, idx) => (
              <div key={idx} className="group relative h-24 w-24">
                <img
                  src={item.preview}
                  alt=""
                  className="h-full w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeNewFile(idx)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white shadow"
                >
                  ✕
                </button>
              </div>
            ))}
            <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-300 text-xs text-stone-500 hover:border-amber-600 hover:text-amber-700">
              + Add
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesSelected}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving..." : "Save Broom"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
