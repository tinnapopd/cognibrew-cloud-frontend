import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { CreateFacesRequest } from "@/client"
import { createFace, deleteFace, embedImage, getFaces } from "@/lib/api"

// ── Queries ────────────────────────────────────────────────────────────────

/** Get faces by username and device_id. */
export function useGetFaces(username: string, device_id: string) {
  return useQuery({
    queryKey: ["faces", username, device_id],
    queryFn: () => getFaces(username, device_id),
    enabled: !!username && !!device_id,
  })
}

/** Get faces by device_id (looks up all usernames on a specific device). */
export function useGetFacesByDevice(device_id: string) {
  return useQuery({
    queryKey: ["faces-by-device", device_id],
    queryFn: () => getFaces(undefined, device_id),
    enabled: !!device_id,
  })
}

// ── Mutations ──────────────────────────────────────────────────────────────

/** Embed an image then create the face record in the gateway. */
export function useEnrollFace(device_id: string, username?: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({
      file,
      enrollUsername,
    }: {
      file: File
      enrollUsername: string
    }) => {
      // Step 1 – extract embedding from inference server
      const embedding = await embedImage(file)

      // Step 2 – create face record in gateway
      const body: CreateFacesRequest = {
        username: enrollUsername,
        embedding: embedding as CreateFacesRequest["embedding"], // 512-tuple
        device_id: device_id,
      }
      return createFace(body)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["faces-by-device", device_id] })
      if (username) {
        qc.invalidateQueries({ queryKey: ["faces", username] })
      }
    },
  })
}

/** Delete a face record (by username + optional device_id + s3_key). */
export function useDeleteFace(username: string, device_id: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (s3_key: string) => deleteFace({ username, device_id, s3_key }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["faces-by-device", device_id] })
      qc.invalidateQueries({ queryKey: ["faces", username] })
    },
  })
}
