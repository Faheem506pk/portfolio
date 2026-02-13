"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2, Edit, ExternalLink, Github, Trophy, Video, Newspaper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectModal } from "@/components/admin/project-modal";
import { AchievementModal } from "@/components/admin/achievement-modal";
import { toast } from "sonner";
import { saveAchievementAction, deleteAchievementAction } from "@/actions/achievements";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);

  // Projects State
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Achievements State
  const [achievementModalOpen, setAchievementModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkAuth = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase.from("projects").select("*").order("id", { ascending: false });
    if (error) console.error("Error fetching projects:", error);
    else setProjects(data || []);
  }, []);

  const fetchAchievements = useCallback(async () => {
    const { data, error } = await supabase.from("achievements").select("*").order("date", { ascending: false });
    if (error) console.error("Error fetching achievements:", error);
    else setAchievements(data || []);
  }, []);

  const fetchData = useCallback(async () => {
    setFetchingData(true);
    await Promise.all([fetchProjects(), fetchAchievements()]);
    setFetchingData(false);
    setLoading(false);
  }, [fetchProjects, fetchAchievements]);

  useEffect(() => {
    checkAuth();
    fetchData();
  }, [checkAuth, fetchData]);

  // --- Projects Handlers ---
  const handleCreateProject = () => {
    setEditingProject(null);
    setProjectModalOpen(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectModalOpen(true);
  };

  const handleDeleteProject = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error("Error deleting project");
    else {
      toast.success("Project deleted");
      fetchProjects();
    }
  };

  const handleSubmitProject = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingProject) {
        const { error } = await supabase.from("projects").update(formData).eq("id", editingProject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert([formData]);
        if (error) throw error;
      }
      setProjectModalOpen(false);
      fetchProjects();
      toast.success("Project saved successfully");
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Achievements Handlers ---
  const handleCreateAchievement = () => {
    setEditingAchievement(null);
    setAchievementModalOpen(true);
  };

  const handleEditAchievement = (achievement) => {
    setEditingAchievement(achievement);
    setAchievementModalOpen(true);
  };

  const handleDeleteAchievement = async (id) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    try {
      const result = await deleteAchievementAction(id);
      if (result.success) {
        toast.success("Achievement deleted");
        fetchAchievements();
      } else {
        toast.error(result.error || "Error deleting achievement");
      }
    } catch (error) {
      console.error("Error deleting achievement:", error);
      toast.error("Error deleting achievement");
    }
  };

  const handleSubmitAchievement = async (formData) => {
    setIsSubmitting(true);
    try {
      const result = await saveAchievementAction(formData, editingAchievement?.id || null);
      if (result.success) {
        setAchievementModalOpen(false);
        fetchAchievements();
        toast.success("Achievement saved successfully");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error saving achievement:", error);
      toast.error(error.message || "Failed to save achievement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAchievementIcon = (type) => {
    switch (type) {
      case "youtube":
        return <Video className="h-4 w-4" />;
      case "article":
        return <Newspaper className="h-4 w-4" />;
      case "news":
        return <Newspaper className="h-4 w-4" />;
      default:
        return <Trophy className="h-4 w-4" />;
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal-blue dark:text-verdigris mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your portfolio content</p>
        </div>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* PROJECTS TAB */}
        <TabsContent value="projects" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={handleCreateProject} className="bg-burnt-peach hover:bg-burnt-peach/90 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Project
            </Button>
          </div>

          {fetchingData ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              <p>No projects found.</p>
              <Button variant="link" onClick={handleCreateProject}>
                Create your first project
              </Button>
            </div>
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
                        <p className="text-muted-foreground line-clamp-2 md:line-clamp-none">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.tech?.map((t, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex md:flex-col gap-2 justify-end items-end md:justify-center md:border-l md:pl-6 border-border/50 min-w-[120px]">
                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleEditProject(project)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ACHIEVEMENTS TAB */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={handleCreateAchievement} className="bg-burnt-peach hover:bg-burnt-peach/90 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Achievement
            </Button>
          </div>

          {fetchingData ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin" />
            </div>
          ) : achievements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              <p>No achievements found.</p>
              <Button variant="link" onClick={handleCreateAchievement}>
                Add your first achievement
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {achievements.map((item) => (
                <Card key={item.id} className="border-border/50 bg-card/50 hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex gap-4 flex-1">
                        {item.thumbnail_url && (
                          <div className="hidden md:block w-32 h-20 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getAchievementIcon(item.type)}
                              <span className="capitalize">{item.type}</span>
                            </Badge>
                            <span className="text-sm text-muted-foreground">{item.date}</span>
                          </div>
                          <h3 className="text-xl font-bold line-clamp-1">{item.title}</h3>
                          <p className="text-muted-foreground line-clamp-2">{item.description}</p>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-sm text-verdigris hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" /> View Source
                          </a>
                        </div>
                      </div>
                      <div className="flex md:flex-col gap-2 justify-end items-end md:justify-center md:border-l md:pl-6 border-border/50 min-w-[120px]">
                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleEditAchievement(item)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteAchievement(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ProjectModal
        open={projectModalOpen}
        onOpenChange={setProjectModalOpen}
        initialData={editingProject}
        onSubmit={handleSubmitProject}
        isSubmitting={isSubmitting}
      />

      <AchievementModal
        open={achievementModalOpen}
        onOpenChange={setAchievementModalOpen}
        initialData={editingAchievement}
        onSubmit={handleSubmitAchievement}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
