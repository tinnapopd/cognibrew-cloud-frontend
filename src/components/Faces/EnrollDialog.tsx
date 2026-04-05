import { ImagePlus, Loader2, Plus, Upload } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEnrollFace } from "@/hooks/useFaces"

interface EnrollDialogProps {
  device_id: string
  enrollUsername?: string
}

export default function EnrollDialog({
  device_id,
  enrollUsername,
}: EnrollDialogProps) {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState(enrollUsername || "")
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const enrollMutation = useEnrollFace(device_id)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(null)
    }
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file || !username.trim()) return

    try {
      await enrollMutation.mutateAsync({
        file,
        enrollUsername: username.trim(),
      })
      toast.success("Face enrolled", {
        description: `Successfully enrolled face for ${username.trim()} on device ${device_id}`,
      })
      setOpen(false)
      resetForm()
    } catch (err) {
      toast.error("Enrollment failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      })
    }
  }

  const resetForm = () => {
    setUsername("")
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Enroll New Face
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImagePlus className="h-5 w-5 text-primary" />
            Enroll New Face
          </DialogTitle>
          <DialogDescription>
            Upload a photo with a clearly visible face. The embedding will be
            extracted automatically from the inference server and stored on
            device <strong>{device_id}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="enroll-username">Username</Label>
            <Input
              id="enroll-username"
              placeholder="e.g. john_doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              The identity label for this face record.
            </p>
          </div>

          {/* File upload */}
          <div className="space-y-2">
            <Label htmlFor="enroll-file">Photo</Label>
            <div className="relative">
              <Input
                id="enroll-file"
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="cursor-pointer"
              />
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div className="flex justify-center rounded-xl border border-border/60 bg-muted/30 p-4">
              <img
                src={preview}
                alt="Preview"
                className="max-h-56 rounded-lg object-contain shadow-md"
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={enrollMutation.isPending || !username.trim()}
              className="w-full gap-2 sm:w-auto"
            >
              {enrollMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Extracting &amp; Enrolling…
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Enroll Face
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
