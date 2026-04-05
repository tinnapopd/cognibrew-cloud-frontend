import { useNavigate } from "@tanstack/react-router"
import { ArrowRight, Coffee, Cpu } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DeviceConnect() {
  const [deviceId, setDeviceId] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!deviceId.trim()) return
    navigate({ to: "/faces", search: { device_id: deviceId.trim() } })
  }

  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center px-4">
      {/* Animated hero */}
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-24 w-24 animate-ping rounded-full bg-primary/20" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-xl shadow-primary/25">
            <Coffee className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>

        <h1 className="mt-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          Cognibrew Edge
        </h1>
        <p className="max-w-sm text-muted-foreground">
          Face Recognition Management Console — Enter a Device ID to view &amp;
          manage enrolled faces.
        </p>
      </div>

      {/* Connect form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl border border-border/60 bg-card/80 p-8 shadow-2xl backdrop-blur-lg"
      >
        <div className="space-y-2">
          <Label
            htmlFor="device-id"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Cpu className="h-4 w-4 text-primary" />
            Device ID
          </Label>
          <Input
            id="device-id"
            type="text"
            placeholder="e.g. edge-01"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="h-12 text-base"
            autoFocus
            required
          />
          <p className="text-xs text-muted-foreground">
            Enter the device ID to look up enrolled face records.
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full gap-2 text-base font-semibold"
          disabled={!deviceId.trim()}
        >
          Connect
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {/* Version tag */}
      <p className="mt-8 text-xs text-muted-foreground/60">
        CogniBrew Edge Gateway v0.1.0
      </p>
    </div>
  )
}
