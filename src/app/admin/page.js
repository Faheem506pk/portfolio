"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const router = useRouter();

  const fetchProjects = async () => {
    setFetchingData(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) console.error('Error fetching projects:', error);
    else setProjects(data || []);
    setFetchingData(false);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        fetchProjects();
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDeleteProject = async (id) => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-charcoal-blue" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container py-12 space-y-8">
      <div className="flex justify-between items-center border-b pb-6">
        <div>
            <h1 className="text-3xl font-serif font-bold text-charcoal-blue dark:text-verdigris mb-2">
            Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your portfolio content</p>
        </div>
        
        <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
                {user.email}
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
        </div>
      </div>
      
      {/* Projects Section */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Projects</CardTitle>
            <Button size="sm" className="bg-burnt-peach hover:bg-burnt-peach/90 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Project
            </Button>
        </CardHeader>
        <CardContent>
            {fetchingData ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
            ) : projects.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No projects found.</p>
            ) : (
                <div className="space-y-4">
                    {projects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{project.name}</h3>
                                    {project.featured && <Badge variant="secondary" className="text-xs">Featured</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => alert("Edit functionality coming next!")}>
                                    <Edit className="h-4 w-4 text-blue-500" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </CardContent>
      </Card>
      
    </div>
  );
}
