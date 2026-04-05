import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { AlertCircle, ArrowLeft, Cpu, RefreshCw, UserPlus } from "lucide-react"
import { toast } from "sonner"
import EnrollDialog from "@/components/Faces/EnrollDialog"
import FaceCard from "@/components/Faces/FaceCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useDeleteFace, useGetFacesByDevice } from "@/hooks/useFaces"

interface FacesSearch {
  device_id: string
}

export const Route = createFileRoute("/_layout/faces")({
  validateSearch: (search: Record<string, unknown>): FacesSearch => ({
    device_id: (search.device_id as string) || "",
  }),
  component: FacesPage,
})

function FacesPage() {
  const { device_id } = Route.useSearch()
  const navigate = useNavigate()
  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetFacesByDevice(device_id)
  const deleteMutation = useDeleteFace(undefined, device_id)

  if (!device_id) {
    navigate({ to: "/" })
    return null
  }

  const handleDelete = async (username: string) => {
    try {
      await deleteMutation.mutateAsync(username)
      toast.success("Face deleted", {
        description: `Removed face for ${username} from device ${device_id}`,
      })
    } catch (err) {
      toast.error("Delete failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      })
    }
  }

  const faces = data?.faces ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/" })}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <Cpu className="h-6 w-6 text-primary" />
              {device_id}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? "Loading face records…"
                : `${faces.length} face${faces.length !== 1 ? "s" : ""} enrolled`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <EnrollDialog device_id={device_id} />
        </div>
      </div>

      <Separator />

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={`skel-${i}`} className="space-y-3 rounded-xl border p-5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="text-sm font-medium text-destructive">
            {error instanceof Error ? error.message : "Failed to load faces"}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* Empty state — no faces found, ask to create */}
      {!isLoading && !isError && faces.length === 0 && (
        <div className="flex flex-col items-center gap-5 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <UserPlus className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-lg font-medium">
              No faces found on device{" "}
              <span className="text-primary">{device_id}</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Would you like to enroll a new face for this device?
            </p>
          </div>
          <EnrollDialog device_id={device_id} />
        </div>
      )}

      {/* Grid of face cards */}
      {!isLoading && faces.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {faces.map((face) => (
            <FaceCard
              key={`${face.username}-${face.device_id}-${face.s3_key}`}
              face={face}
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  )
}
