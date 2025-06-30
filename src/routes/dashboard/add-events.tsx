import { isLoggedIn } from "@/utils/isLoggedIn";
import { createFileRoute, redirect } from "@tanstack/react-router";

function RouteComponent() {
  return <div>Hello "/_dashboard/add-events"!</div>;
}

export const Route = createFileRoute("/dashboard/add-events")({
  component: RouteComponent,
  beforeLoad: async () => {
    const res = await isLoggedIn();
    if (!res) {
      throw redirect({
        to: "/login",
      });
    }
  },
});
