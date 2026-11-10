import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground ring-1 ring-border">
            <Compass className="size-5" aria-hidden />
          </span>
          <CardTitle>Page not found</CardTitle>
          <CardDescription>
            That route does not exist in this dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="secondary">
            <Link href="/">Back to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
