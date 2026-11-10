import type { Metadata } from "next";
import { Settings } from "lucide-react";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Settings",
  description: "Units, refresh behaviour, theme and stored preferences.",
};

export default function SettingsPage() {
  return (
    <PagePlaceholder
      title="Settings"
      description="Units, refresh behaviour and stored preferences"
      icon={Settings}
      phase="Phase 5"
      planned={[
        "Temperature and wind speed units",
        "Snapshot auto-refresh interval",
        "Preferred air quality index",
        "Colour theme",
        "Manage favourite cameras",
        "Clear locally stored preferences",
      ]}
      source="Preferences are stored in your browser's localStorage only"
    />
  );
}
