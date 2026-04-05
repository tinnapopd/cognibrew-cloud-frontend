import { createFileRoute } from "@tanstack/react-router";
import DeviceConnect from "@/components/Faces/DeviceConnect";

export const Route = createFileRoute("/_layout/")({
  component: IndexPage,
});

function IndexPage() {
  return <DeviceConnect />;
}
