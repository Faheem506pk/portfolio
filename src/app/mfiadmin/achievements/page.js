"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AchievementModal } from "@/components/admin/achievement-modal";
import { saveAchievementAction, deleteAchievementAction } from "@/actions/achievements";

async function fetchAchievements() {
  const { data, error } = await supabase.from("achievements").select("*").order("date", { ascending: false });
  if (error) console.error("Error fetching achievements:", error);
  return data || [];
}

export default function AchievementsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => setItems(await fetchAchievements()), []);

  useEffect(() => {
    let alive = true;
    fetchAchievements().then((rows) => {
      if (!alive) return;
      setItems(rows);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    setModalOpen(true);
  };

  const remove = async (item) => {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    try {
      const result = await deleteAchievementAction(item.id);
      if (!result.success) throw new Error(result.error || "Error deleting achievement");
      toast.success("Achievement deleted");
      reload();
    } catch (error) {
      toast.error(error.message || "Error deleting achievement");
    }
  };

  const submit = async (formData) => {
    setSaving(true);
    try {
      const result = await saveAchievementAction(formData, editing?.id || null);
      if (!result.success) throw new Error(result.error);
      setModalOpen(false);
      reload();
      toast.success("Achievement saved");
    } catch (error) {
      toast.error(error.message || "Failed to save achievement.");
    } finally {
      setSaving(false);
    }
  };

  const types = ["all", ...Array.from(new Set(items.map((i) => i.type).filter(Boolean)))];
  const visible = items.filter(
    (i) => (type === "all" || i.type === type) && `${i.title} ${i.description || ""}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="wp-heading">
        <h1>Achievements</h1>
        <button type="button" className="wp-btn-add" onClick={openNew}>
          Add New
        </button>
      </div>

      <ul className="wp-views">
        {types.map((t) => (
          <li key={t}>
            <button type="button" aria-current={type === t} onClick={() => setType(t)} style={{ textTransform: "capitalize" }}>
              {t === "all" ? "All" : t}{" "}
              <span className="count">({t === "all" ? items.length : items.filter((i) => i.type === t).length})</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mb-2 flex justify-end">
        <label className="sr-only" htmlFor="ach-search">
          Search achievements
        </label>
        <input
          id="ach-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search achievements"
          className="w-full max-w-xs"
        />
      </div>

      <div className="wp-table-wrap">
        <table className="wp-table">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Type</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="muted">
                  <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                  Loading
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={3} className="muted">
                  {items.length === 0 ? "No achievements yet. Use Add New to create the first one." : "No achievements match."}
                </td>
              </tr>
            ) : (
              visible.map((item) => (
                <tr key={item.id}>
                  <td>
                    <button type="button" className="row-title" onClick={() => openEdit(item)} style={{ background: "none", border: 0, padding: 0, cursor: "pointer", textAlign: "left" }}>
                      {item.title}
                    </button>
                    <div className="muted" style={{ maxWidth: "60ch" }}>
                      {item.description}
                    </div>
                    <div className="row-actions">
                      <button type="button" onClick={() => openEdit(item)}>
                        Edit
                      </button>
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noreferrer">
                          View source
                        </a>
                      )}
                      <button type="button" className="delete" onClick={() => remove(item)}>
                        Delete
                      </button>
                    </div>
                  </td>
                  <td data-label="Type" style={{ textTransform: "capitalize" }}>{item.type}</td>
                  <td data-label="Date">{item.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AchievementModal open={modalOpen} onOpenChange={setModalOpen} initialData={editing} onSubmit={submit} isSubmitting={saving} />
    </div>
  );
}
