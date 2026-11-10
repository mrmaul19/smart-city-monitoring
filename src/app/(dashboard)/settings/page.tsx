import type { Metadata } from "next";
import { Settings } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { SettingsPanel } from "@/components/dashboard/settings-panel";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Theme, preferred air quality index, snapshot refresh cadence and stored preferences.",
};

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Preferences, stored in this browser only"
        icon={Settings}
      />

      <SettingsPanel />
    </>
  );
}
