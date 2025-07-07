export const isAuthenticated = async () => {
  const response = await fetch("https://event-manager-dun.vercel.app/auth/validate-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await response.json();
  return data;
};
