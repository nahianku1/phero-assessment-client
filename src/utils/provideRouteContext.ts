import { isAuthenticated } from "./isAuthenticated";

export const provideRouteContext = async () => {
  const data = await isAuthenticated();
  if (data.success) {
    return { user: data.data };
  } else {
    return { user: null };
  }
};
