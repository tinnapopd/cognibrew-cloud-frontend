import { createFileRoute, Outlet } from "@tanstack/react-router"
import { Toaster } from "@/components/ui/sonner"

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Toaster richColors position="bottom-right" />
    </div>
  )
}
