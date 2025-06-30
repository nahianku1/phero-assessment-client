import { createFileRoute } from "@tanstack/react-router";

function RouteComponent() {
  return <div>Hello "/_dashboard/settings"!</div>;
}

export const Route = createFileRoute("/dashboard/settings")({
  component: RouteComponent,
});
