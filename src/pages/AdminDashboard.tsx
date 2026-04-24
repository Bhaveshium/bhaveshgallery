import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit2, Plus, LogOut, X, Save } from "lucide-react";
import { CATEGORIES, PHOTO_TYPES } from "@/lib/categories";

interface MediaItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  file_url: string;
  thumbnail_url: string | null;
  width: number | null;
  height: number | null;
  photographer: string;
  location: string;
  details: string;
  sort_order: number;
  photo_type?: string;
  date_taken?: string | null;
  tags?: string[];
}

const emptyForm = {
  title: "",
  description: "",
  category: CATEGORIES[0] as string,
  type: "image",
  photo_type: "",
  photographer: "",
  location: "",
  details: "",
  date_taken: "",
  tags: "",
  sort_order: 0,
};

const AdminDashboard = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingUrl, setExistingUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "video">("image");

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPreviewType(file.type.startsWith("video/") ? "video" : "image");
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/admin/login", { replace: true });
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) navigate("/admin/login", { replace: true });
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (session) fetchMedia();
  }, [session]);

  const fetchMedia = async () => {
    const { data, error } = await supabase.from("media").select("*").order("sort_order", { ascending: true });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setMedia((data as MediaItem[]) || []);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  const resetForm = () => {
    setForm({ ...emptyForm });
    setFile(null);
    setExistingUrl(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: MediaItem) => {
    setForm({
      title: item.title,
      description: item.description || "",
      category: CATEGORIES.includes(item.category as any) ? item.category : (CATEGORIES[0] as string),
      type: item.type,
      photo_type: item.photo_type || "",
      photographer: item.photographer || "",
      location: item.location || "",
      details: item.details || "",
      date_taken: item.date_taken || "",
      tags: (item.tags || []).join(", "),
      sort_order: item.sort_order || 0,
    });
    setEditingId(item.id);
    setExistingUrl(item.file_url);
    setPreviewType(item.type === "video" ? "video" : "image");
    setFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from("media").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted" });
      fetchMedia();
    }
  };

  const buildPayload = () => {
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    return {
      title: form.title,
      description: form.description,
      category: form.category,
      type: form.type,
      photo_type: form.photo_type,
      photographer: form.photographer,
      location: form.location,
      details: form.details,
      date_taken: form.date_taken || null,
      tags,
      sort_order: form.sort_order,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    setUploading(true);

    let fileUrl = "";
    let imgWidth: number | null = null;
    let imgHeight: number | null = null;

    if (file) {
      // Read intrinsic size for images so masonry can use real aspect ratios
      if (file.type.startsWith("image/")) {
        try {
          const dims = await new Promise<{ w: number; h: number }>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
          });
          imgWidth = dims.w;
          imgHeight = dims.h;
        } catch {
          // ignore
        }
      }

      const ext = file.name.split(".").pop();
      const path = `${session.user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
      if (uploadError) {
        toast({ title: "Upload error", description: uploadError.message, variant: "destructive" });
        setUploading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
      fileUrl = urlData.publicUrl;
    }

    const basePayload: any = buildPayload();

    if (editingId) {
      if (fileUrl) basePayload.file_url = fileUrl;
      if (imgWidth) basePayload.width = imgWidth;
      if (imgHeight) basePayload.height = imgHeight;
      const { error } = await supabase.from("media").update(basePayload).eq("id", editingId);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Updated" });
        resetForm();
        fetchMedia();
      }
    } else {
      if (!fileUrl) {
        toast({ title: "Please select a file", variant: "destructive" });
        setUploading(false);
        return;
      }
      const { error } = await supabase.from("media").insert({
        ...basePayload,
        file_url: fileUrl,
        width: imgWidth,
        height: imgHeight,
        user_id: session.user.id,
      });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Added" });
        resetForm();
        fetchMedia();
      }
    }
    setUploading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs uppercase tracking-widest font-inter text-muted-foreground hover:text-foreground transition-colors">← Home</Link>
            <h1 className="font-playfair text-xl text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => { setShowForm(true); setEditingId(null); }}>
              <Plus className="w-4 h-4 mr-1" /> Add Media
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {showForm && (
          <div className="mb-8 border border-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-lg">{editingId ? "Edit" : "Add"} Media</h2>
              <button onClick={resetForm}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="border border-border bg-background px-3 py-2 text-sm"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
              <select
                value={form.photo_type}
                onChange={(e) => setForm({ ...form, photo_type: e.target.value })}
                className="border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">Type (Portrait, Landscape, ...)</option>
                {PHOTO_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <Input placeholder="Location (City, Country)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <Input type="date" placeholder="Date" value={form.date_taken} onChange={(e) => setForm({ ...form, date_taken: e.target.value })} />
              <Input placeholder="Photographer" value={form.photographer} onChange={(e) => setForm({ ...form, photographer: e.target.value })} />
              <Input placeholder="Sort Order" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
              <Input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="md:col-span-2" />
              <Input placeholder="Tags (comma separated, 5–10 keywords)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="md:col-span-2" />
              <Textarea placeholder="Description (1–2 lines, shown when photo is opened)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="md:col-span-2" />
              <Textarea placeholder="Additional details (optional)" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} className="md:col-span-2" />
              <div className="md:col-span-2">
                <Button type="submit" disabled={uploading} className="w-full">
                  <Save className="w-4 h-4 mr-2" /> {uploading ? "Uploading..." : editingId ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {media.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p>No media items yet. Click "Add Media" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item) => (
              <div key={item.id} className="group relative border border-border overflow-hidden">
                <img src={item.file_url} alt={item.title} className="w-full h-48 object-cover" />
                <div className="p-3 space-y-1">
                  <p className="text-sm font-medium text-foreground truncate">{item.title || "Untitled"}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.category}</p>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(item)} className="p-1.5 bg-background/90 hover:bg-background border border-border rounded">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-background/90 hover:bg-destructive hover:text-destructive-foreground border border-border rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
