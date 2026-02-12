import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const user = await currentUser();
  
  // Check if user is authenticated and matches the admin email
  // If ADMIN_EMAIL is not set, we block access for safety
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (!user || !adminEmail || user.emailAddresses[0].emailAddress !== adminEmail) {
    redirect("/");
  }

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-charcoal-blue dark:text-verdigris">
          Admin Dashboard
        </h1>
        <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
                Welcome, {user.firstName}
            </span>
            <UserButton afterSignOutUrl="/" />
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Content Management</h2>
        <p className="text-muted-foreground">
          Welcome to the admin panel. Here you will be able to update your portfolio content.
        </p>
        <div className="mt-6 p-4 bg-muted/50 rounded-md border border-dashed border-muted-foreground/30 flex items-center justify-center text-sm text-muted-foreground">
          Connect your Supabase database to start managing content dynamically.
        </div>
      </div>
    </div>
  );
}
