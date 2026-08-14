"use client";

import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import { LucideLogOut } from "lucide-react";

export default function Page() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear the admin token cookie
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Admin Dashboard
            </h1>
            <p className="text-zinc-500 mt-1">Welcome back, Admin.</p>
          </div>
          
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LucideLogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-500">Total Users</h3>
            <p className="text-3xl font-bold mt-2 text-zinc-900 dark:text-zinc-100">1,248</p>
          </div>
          <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-500">Active Orders</h3>
            <p className="text-3xl font-bold mt-2 text-zinc-900 dark:text-zinc-100">84</p>
          </div>
          <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-500">Revenue (Today)</h3>
            <p className="text-3xl font-bold mt-2 text-zinc-900 dark:text-zinc-100">$4,290</p>
          </div>
        </div>
      </div>
    </div>
  )
}
