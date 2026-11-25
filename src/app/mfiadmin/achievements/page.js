"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AchievementModal } from "@/components/admin/achievement-modal";
import { DataTable } from "@/components/admin/data-table";
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

  const columns = useMemo(
    () => [
      {
        id: "title",
        accessorKey: "title",
        header: "Title",
        meta: { primary: true },
        cell: ({ row }) => {
          const item = row.original;
          return (
            <>
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
            </>
          );
        },
      },
      { id: "type", accessorKey: "type", header: "Type", cell: ({ getValue }) => <span style={{ textTransform: "capitalize" }}>{getValue()}</span> },
      { id: "date", accessorKey: "date", header: "Date", cell: ({ getValue }) => getValue() },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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

      <DataTable columns={columns} data={visible} loading={loading} initialSort={[{ id: "date", desc: true }]} emptyText={items.length === 0 ? "No achievements yet. Use Add New to create the first one." : "No achievements match."} />

      <AchievementModal open={modalOpen} onOpenChange={setModalOpen} initialData={editing} onSubmit={submit} isSubmitting={saving} />
    </div>
  );
}
