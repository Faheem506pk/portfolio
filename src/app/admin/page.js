"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        // Optional: Check specific email if you want double security
        // const adminEmail = "faheemiqbalm@gmail.com"; 
        // if (user.email !== adminEmail) { ... }
        setUser(user);
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
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
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-charcoal-blue dark:text-verdigris">
          Admin Dashboard
        </h1>
        <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
                Welcome, {user.email}
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Content Management</h2>
        <p className="text-muted-foreground">
          Welcome to the admin panel. Here you will be able to update your portfolio content.
        </p>
        <div className="mt-6 p-4 bg-muted/50 rounded-md border border-dashed border-muted-foreground/30 flex items-center justify-center text-sm text-muted-foreground">
          Supabase Connected. Ready for data integration.
        </div>
      </div>
    </div>
  );
}
