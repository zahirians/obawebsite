import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { HighlightTab } from "./tabs/HighlightTab";
import { MembershipTab } from "./tabs/MembershipTab";
import { NewsTab } from "./tabs/NewsTab";
import { BranchesTab } from "./tabs/BranchesTab";
import { BatchesTab } from "./tabs/BatchesTab";
import { AssociationsTab } from "./tabs/AssociationsTab";
import { ProjectsTab } from "./tabs/ProjectsTab";
import { InboxTab } from "./tabs/InboxTab";

const tabs = [
  { id: "news", label: "News" },
  { id: "highlight", label: "Home highlight" },
  { id: "membership", label: "Membership page" },
  { id: "branches", label: "Branches" },
  { id: "batches", label: "Batches" },
  { id: "associations", label: "Associations" },
  { id: "projects", label: "Projects" },
  { id: "inbox", label: "Contact inbox" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function AdminDashboard() {
  const [tab, setTab] = useState<TabId>("news");

  return (
    <div className="min-h-screen bg-brand-gray/40 text-brand-blue">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-gray bg-white px-4 py-4">
        <div>
          <Link to="/" className="text-sm font-semibold text-brand-maroon hover:underline">
            ← Back to website
          </Link>
          <h1 className="font-display text-2xl font-bold text-brand-blue">Admin</h1>
        </div>
        <button
          type="button"
          onClick={() => void supabase.auth.signOut()}
          className="rounded-full border border-brand-gray px-4 py-2 text-sm font-semibold hover:bg-brand-gray/60"
        >
          Sign out
        </button>
      </header>
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        <aside className="border-b border-brand-gray bg-white md:w-52 md:border-b-0 md:border-r md:shrink-0">
          <nav className="flex flex-row overflow-x-auto gap-1 p-2 md:flex-col md:overflow-visible">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-semibold md:w-full ${
                  tab === t.id
                    ? "bg-brand-blue text-white"
                    : "text-brand-blue hover:bg-brand-gray/60"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </aside>
        <div className="flex-1 p-4 md:p-8">
          {tab === "highlight" && <HighlightTab />}
          {tab === "membership" && <MembershipTab />}
          {tab === "news" && <NewsTab />}
          {tab === "branches" && <BranchesTab />}
          {tab === "batches" && <BatchesTab />}
          {tab === "associations" && <AssociationsTab />}
          {tab === "projects" && <ProjectsTab />}
          {tab === "inbox" && <InboxTab />}
        </div>
      </div>
    </div>
  );
}
