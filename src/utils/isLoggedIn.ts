import { isAuthenticated } from "./isAuthenticated";

export const isLoggedIn = async () => {
  const data = await isAuthenticated();
  return data.success;
};
