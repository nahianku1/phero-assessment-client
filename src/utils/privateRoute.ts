import { isAuthenticated } from "./isAuthenticated";
import { redirect } from "@tanstack/react-router";

export const privateRoute = async () => {
  const data = await isAuthenticated();
  if (!data.success) {
    throw redirect({ to: "/login" });
  } else {
    return { user: data.data };
  }
};
