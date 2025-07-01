export const isAuthenticated = async () => {
  const response = await fetch("https://event-manager-server-vf31.onrender.com/auth/validate-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "no-cors", // Ensure CORS is handled correctly
  });
  const data = await response.json();
  return data;
};
