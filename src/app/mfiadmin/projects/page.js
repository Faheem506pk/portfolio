"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ProjectModal } from "@/components/admin/project-modal";
import { DataTable } from "@/components/admin/data-table";

async function fetchProjects() {
  const { data, error } = await supabase.from("projects").select("*").order("id", { ascending: false });
  if (error) console.error("Error fetching projects:", error);
  return data || [];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [view, setView] = useState("all"); // all | featured
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => setProjects(await fetchProjects()), []);

  useEffect(() => {
    let alive = true;
    fetchProjects().then((rows) => {
      if (!alive) return;
      setProjects(rows);
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
  const openEdit = (project) => {
    setEditing(project);
    setModalOpen(true);
  };

  const remove = async (project) => {
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", project.id);
    if (error) return toast.error("Error deleting project");
    toast.success("Project deleted");
    reload();
  };

  const submit = async (formData) => {
    setSaving(true);
    try {
      const result = editing
        ? await supabase.from("projects").update(formData).eq("id", editing.id)
        : await supabase.from("projects").insert([formData]);
      if (result.error) throw result.error;
      setModalOpen(false);
      reload();
      toast.success("Project saved");
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Project",
        meta: { primary: true },
        cell: ({ row }) => {
          const project = row.original;
          return (
            <>
              <button type="button" className="row-title" onClick={() => openEdit(project)} style={{ background: "none", border: 0, padding: 0, cursor: "pointer", textAlign: "left" }}>
                {project.name}
              </button>
              <div className="muted" style={{ maxWidth: "60ch" }}>
                {project.description}
              </div>
              <div className="row-actions">
                <button type="button" onClick={() => openEdit(project)}>
                  Edit
                </button>
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noreferrer">
                    Live demo
                  </a>
                )}
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noreferrer">
                    Repository
                  </a>
                )}
                <button type="button" className="delete" onClick={() => remove(project)}>
                  Delete
                </button>
              </div>
            </>
          );
        },
      },
      {
        id: "tech",
        header: "Technologies",
        enableSorting: false,
        accessorFn: (p) => (p.tech || []).slice(0, 5).join(", ") + ((p.tech || []).length > 5 ? ` +${p.tech.length - 5}` : ""),
        meta: { className: "muted" },
        cell: ({ getValue }) => getValue(),
      },
      { id: "year", accessorKey: "year", header: "Year", cell: ({ getValue }) => getValue() },
      {
        id: "status",
        header: "Status",
        accessorFn: (p) => (p.featured ? "Featured" : "Standard"),
        cell: ({ getValue }) => <span className={`wp-status ${getValue() === "Featured" ? "ok" : ""}`}>{getValue()}</span>,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const featuredCount = projects.filter((p) => p.featured).length;
  const visible = projects.filter(
    (p) => (view === "all" || p.featured) && `${p.name} ${p.description || ""}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="wp-heading">
        <h1>Projects</h1>
        <button type="button" className="wp-btn-add" onClick={openNew}>
          Add New
        </button>
      </div>

      <ul className="wp-views">
        <li>
          <button type="button" aria-current={view === "all"} onClick={() => setView("all")}>
            All <span className="count">({projects.length})</span>
          </button>
        </li>
        <li>
          <button type="button" aria-current={view === "featured"} onClick={() => setView("featured")}>
            Featured <span className="count">({featuredCount})</span>
          </button>
        </li>
      </ul>

      <div className="mb-2 flex justify-end">
        <label className="sr-only" htmlFor="project-search">
          Search projects
        </label>
        <input
          id="project-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects"
          className="w-full max-w-xs"
        />
      </div>

      <DataTable columns={columns} data={visible} loading={loading} initialSort={[{ id: "year", desc: true }]} emptyText={projects.length === 0 ? "No projects yet. Use Add New to create the first one." : "No projects match."} />

      <ProjectModal open={modalOpen} onOpenChange={setModalOpen} initialData={editing} onSubmit={submit} isSubmitting={saving} />
    </div>
  );
}
