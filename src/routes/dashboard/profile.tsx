import { createFileRoute } from "@tanstack/react-router";

function RouteComponent() {
  return <div>Hello "/_dashboard/profile"!</div>;
}

export const Route = createFileRoute("/dashboard/profile")({
  component: RouteComponent,
});
