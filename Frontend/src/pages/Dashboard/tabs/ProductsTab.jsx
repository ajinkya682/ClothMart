import { useState, useEffect } from "react";
import api from "../../../../utils/api";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2, ImagePlus, LoaderCircle, AlertCircle, ShoppingBag } from "lucide-react";

export default function ProductsTab({ store }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", description: "", price: "", discountPrice: "",
    category: "Saree", sizes: "", colors: "", stock: "",
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products", { params: { store: store._id, limit: 100 } });
      setProducts(res.data.products || []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditProduct(null);
    setForm({ name: "", description: "", price: "", discountPrice: "", category: "Saree", sizes: "", colors: "", stock: "" });
    setImages([]);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      name: p.name, description: p.description || "", price: p.price, discountPrice: p.discountPrice || "",
      category: p.category, sizes: p.sizes?.join(", ") || "", colors: p.colors?.join(", ") || "", stock: p.stock,
    });
    setImages([]);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock) {
      toast.error("Name, price and stock are required");
      return;
    }
    setFormLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      if (form.discountPrice) fd.append("discountPrice", form.discountPrice);
      fd.append("category", form.category);
      fd.append("stock", form.stock);
      fd.append("sizes", JSON.stringify(form.sizes.split(",").map(s => s.trim()).filter(Boolean)));
      fd.append("colors", JSON.stringify(form.colors.split(",").map(c => c.trim()).filter(Boolean)));
      images.forEach(img => fd.append("images", img));

      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, fd);
        toast.success("Product updated!");
      } else {
        await api.post("/products", fd);
        toast.success("Product added!");
      }

      setShowForm(false);
      fetchProducts();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save product");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this product permanently?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  if (showForm) {
    return (
      <div className="max-w-4xl animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold font-heading text-gray-900 tracking-tight">
            {editProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
            Cancel
          </button>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-200 p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Product Name *</label>
              <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Premium Cotton Saree" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Category *</label>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {["Saree", "Kids", "Mens", "Ethnic", "Western", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
               <label className="block text-sm font-semibold text-gray-900 mb-2">Regular Price (₹) *</label>
               <input type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="2999" />
            </div>

            <div>
               <label className="block text-sm font-semibold text-gray-900 mb-2">Discount Price (₹)</label>
               <input type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none" value={form.discountPrice} onChange={e => setForm({...form, discountPrice: e.target.value})} placeholder="1999" />
            </div>

            <div>
               <label className="block text-sm font-semibold text-gray-900 mb-2">Stock Inventory *</label>
               <input type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} placeholder="50" />
            </div>

             <div>
               <label className="block text-sm font-semibold text-gray-900 mb-2">Available Sizes (comma separated)</label>
               <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none" value={form.sizes} onChange={e => setForm({...form, sizes: e.target.value})} placeholder="S, M, L, XL" />
            </div>

             <div className="col-span-2">
               <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
               <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Product details..." />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Product Images (up to 4)</label>
              <div className="flex gap-4 items-center">
                 <label className="relative flex flex-col items-center justify-center w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl hover:border-black cursor-pointer transition-colors group">
                    <ImagePlus className="text-gray-400 group-hover:text-black transition-colors" size={28} />
                    <span className="mt-2 text-xs font-semibold text-gray-500 group-hover:text-black">Upload</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={e => setImages(Array.from(e.target.files).slice(0, 4))} />
                 </label>
                 {images.length > 0 ? (
                   <div className="flex gap-2">
                     {images.map((img, i) => (
                       <div key={i} className="w-32 h-32 rounded-2xl bg-gray-100 overflow-hidden border border-gray-200">
                         <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover" />
                       </div>
                     ))}
                   </div>
                 ) : editProduct?.images?.length > 0 && (
                     <div className="flex gap-2">
                     {editProduct.images.map((img, i) => (
                       <div key={i} className="w-32 h-32 rounded-2xl bg-gray-100 overflow-hidden border border-gray-200 relative">
                         <img src={img} alt="preview" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                            <span className="bg-white/80 px-2 py-1 rounded text-[10px] font-bold">Current</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
             <button onClick={handleSubmit} disabled={formLoading} className={`flex items-center justify-center py-3 px-8 border border-transparent rounded-xl shadow-sm text-sm font-bold tracking-wide text-white bg-black hover:bg-gray-800 hover:-translate-y-0.5 transition-all ${formLoading ? 'opacity-70 cursor-wait' : ''}`}>
               {formLoading ? <LoaderCircle className="animate-spin" size={18} /> : "Save Product"}
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-heading text-gray-900 tracking-tight">Products Catalog</h2>
          <p className="text-sm text-gray-500 mt-1">{products.length} products listed</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-[2rem] bg-gray-50">
          <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Your store is empty</h3>
          <p className="text-gray-500 mb-6">Add products to start selling to customers.</p>
          <button onClick={openAdd} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-bold shadow-sm hover:border-black transition-all">
            <Plus size={18} /> Add First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map(p => (
            <div key={p._id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-black hover:shadow-md transition-all gap-4 group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0">
                <img src={p.images?.[0] || "/placeholder.jpg"} alt={p.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 truncate text-base">{p.name}</h3>
                  {p.stock < 10 && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800"><AlertCircle size={10} className="mr-1"/> Low Stock</span>}
                </div>
                <p className="text-sm text-gray-500 truncate mb-1">{p.category} • {p.colors?.length || 0} colors • {p.sizes?.length || 0} sizes</p>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">₹{(p.discountPrice || p.price).toLocaleString("en-IN")}</span>
                  {p.discountPrice && <span className="text-sm text-gray-400 line-through">₹{p.price.toLocaleString("en-IN")}</span>}
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-gray-100">
                <div className="w-24 text-center">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Stock</p>
                  <p className={`font-mono font-bold ${p.stock < 10 ? 'text-amber-600' : 'text-gray-900'}`}>{p.stock}</p>
                </div>
                <div className="flex items-center gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all" title="Edit">
                     <Edit size={18} />
                   </button>
                   <button onClick={() => handleDelete(p._id)} disabled={deletingId === p._id} className={`p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all ${deletingId === p._id ? 'animate-pulse' : ''}`} title="Delete">
                     <Trash2 size={18} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
