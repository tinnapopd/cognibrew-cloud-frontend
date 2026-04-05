import { FileKey, HardDrive, Trash2, User } from "lucide-react"
import { useState } from "react"
import type { FaceRecord } from "@/client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface FaceCardProps {
  face: FaceRecord
  onDelete: (s3_key: string) => void
  isDeleting: boolean
}

export default function FaceCard({
  face,
  onDelete,
  isDeleting,
}: FaceCardProps) {
  const [showVector, setShowVector] = useState(false)

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30">
      {/* Subtle gradient accent on top */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-transparent" />

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">
                {face.username}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Enrolled Face
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1 text-xs">
            <HardDrive className="h-3 w-3" />
            {face.device_id}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {/* S3 Key */}
        <div className="flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2">
          <FileKey className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
          <p className="break-all text-xs text-muted-foreground font-mono">
            {face.s3_key}
          </p>
        </div>

        {/* Embedding preview */}
        <button
          type="button"
          onClick={() => setShowVector(!showVector)}
          className="text-xs text-primary/70 hover:text-primary transition-colors"
        >
          {showVector ? "Hide" : "Show"} embedding vector (
          {face.embedding.length}-dim)
        </button>
        {showVector && (
          <pre className="max-h-32 overflow-auto rounded-lg bg-muted/50 p-2 text-[10px] text-muted-foreground leading-relaxed">
            [
            {face.embedding
              .slice(0, 20)
              .map((v) => v.toFixed(4))
              .join(", ")}
            {face.embedding.length > 20 ? ", …" : ""}]
          </pre>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="w-full gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={isDeleting}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete face record?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the face record for{" "}
                <strong>{face.username}</strong> from device{" "}
                <strong>{face.device_id}</strong>. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(face.s3_key)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
