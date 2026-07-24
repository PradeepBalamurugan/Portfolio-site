// ---------------------------------------------------------------------------
// Gym Tracker — Layout
// Standalone layout for the gym tracker section.
// Does NOT render the portfolio Navbar or Footer.
// Renders its own GymNavbar with user info, logout, and theme toggle.
// ---------------------------------------------------------------------------

import type { Metadata } from "next";
import "./gym-tracker.css";

export const metadata: Metadata = {
  title: "Gym Tracker | Pradeep Balamurugan",
  description:
    "Track your workouts, monitor progress, and build strength with the Gym Tracker — a personal fitness progression log.",
  robots: { index: false, follow: false },
};

export default function GymTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
}
