"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ProjectModal } from "@/components/admin/project-modal";

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
          className="h-8 w-60 border bg-card px-2 text-[13px]"
        />
      </div>

      <div className="wp-table-wrap">
        <table className="wp-table">
          <thead>
            <tr>
              <th scope="col">Project</th>
              <th scope="col">Technologies</th>
              <th scope="col">Year</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="muted">
                  <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                  Loading
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={4} className="muted">
                  {projects.length === 0 ? "No projects yet. Use Add New to create the first one." : "No projects match."}
                </td>
              </tr>
            ) : (
              visible.map((project) => (
                <tr key={project.id}>
                  <td>
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
                  </td>
                  <td className="muted">{(project.tech || []).slice(0, 5).join(", ")}{(project.tech || []).length > 5 ? ` +${project.tech.length - 5}` : ""}</td>
                  <td>{project.year}</td>
                  <td>
                    <span className={`wp-status ${project.featured ? "ok" : ""}`}>{project.featured ? "Featured" : "Standard"}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ProjectModal open={modalOpen} onOpenChange={setModalOpen} initialData={editing} onSubmit={submit} isSubmitting={saving} />
    </div>
  );
}
