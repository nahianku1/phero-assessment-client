import { isAuthenticated } from "./isAuthenticated";
import { redirect } from "@tanstack/react-router";

export const beforeLoad = async () => {
  const data = await isAuthenticated();
  if (!data.success) {
    return redirect({ to: "/login" });
  } else {
    return { user: data.data };
  }
};
