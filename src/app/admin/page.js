"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2, Edit, ExternalLink, Github } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectModal } from "@/components/admin/project-modal";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setFetchingData(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('id', { ascending: false });
    
    if (error) console.error('Error fetching projects:', error);
    else setProjects(data || []);
    setFetchingData(false);
    setLoading(false);
  };

  const handleCreate = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

    if (error) {
        alert("Error deleting project");
        console.error(error);
    } else {
        fetchProjects();
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(formData)
          .eq('id', editingProject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([formData]);
        if (error) throw error;
      }
      setModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-charcoal-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-serif font-bold text-charcoal-blue dark:text-verdigris mb-2">
              Projects Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your portfolio works</p>
        </div>
        <Button onClick={handleCreate} className="bg-burnt-peach hover:bg-burnt-peach/90 text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>
      
      <div className="grid gap-6">
        {fetchingData ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
        ) : projects.length === 0 ? (
            <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <p>No projects found.</p>
                    <Button variant="link" onClick={handleCreate}>Create your first project</Button>
                </CardContent>
            </Card>
        ) : (
            <div className="grid gap-4">
                {projects.map((project) => (
                    <Card key={project.id} className="border-border/50 bg-card/50 hover:border-primary/20 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold">{project.name}</h3>
                                        {project.featured && <Badge className="bg-tuscan-sun text-charcoal-blue">Featured</Badge>}
                                        <Badge variant="outline">{project.year}</Badge>
                                    </div>
                                    
                                    <p className="text-muted-foreground line-clamp-2 md:line-clamp-none">
                                        {project.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech?.map((t, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">
                                                {t}
                                            </Badge>
                                        ))}
                                    </div>
                                    
                                    <div className="flex items-center gap-4 text-sm">
                                        {project.github_url && (
                                            <a href={project.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                                                <Github className="h-4 w-4" /> GitHub
                                            </a>
                                        )}
                                        {project.live_url && (
                                            <a href={project.live_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                                                <ExternalLink className="h-4 w-4" /> Live Demo
                                            </a>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex md:flex-col gap-2 justify-end items-end md:justify-center md:border-l md:pl-6 border-border/50">
                                    <Button variant="outline" size="sm" className="w-full" onClick={() => handleEdit(project)}>
                                        <Edit className="h-4 w-4 mr-2" /> Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(project.id)}>
                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
      </div>

      <ProjectModal 
        open={modalOpen} 
        onOpenChange={setModalOpen}
        initialData={editingProject}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
