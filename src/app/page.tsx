"use client";

import { useState } from "react";
import { AppProvider } from "@/components/providers/app-provider";
import { Router } from "@/components/router";
import { Navbar } from "@/components/navbar";
import { GoalWizard } from "@/components/views/goal-wizard";

export default function HomePage() {
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-4 pb-12">
          <Router onCreateGoal={() => setWizardOpen(true)} />
          {wizardOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-[#18181b]/40 backdrop-blur-sm p-4 sm:p-6">
              <div className="min-h-full flex items-start justify-center py-4">
                <div className="w-full max-w-3xl">
                  <GoalWizard onClose={() => setWizardOpen(false)} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AppProvider>
  );
}
