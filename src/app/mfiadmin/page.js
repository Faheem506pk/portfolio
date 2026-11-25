"use client";

import { AtAGlance, SiteHealth, QuickDraft } from "@/components/admin/dashboard-widgets";
import { ContentPipelineCard } from "@/components/admin/content-pipeline-card";
import { ReadershipBox } from "@/components/admin/analytics-widgets";

// WordPress-style dashboard: boxes, not marketing cards. Projects and achievements have their own list pages.
export default function AdminDashboardPage() {
  return (
    <div>
      <div className="wp-heading">
        <h1>Dashboard</h1>
      </div>

      <div className="mb-3">
        <ReadershipBox />
      </div>

      <div className="wp-grid">
        <div className="grid gap-3">
          <AtAGlance />
          <SiteHealth />
        </div>
        <div className="grid gap-3">
          <ContentPipelineCard />
          <QuickDraft />
        </div>
      </div>
    </div>
  );
}
