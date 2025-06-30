export const isAuthenticated = async () => {
  const response = await fetch("http://localhost:3000/auth/validate-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await response.json();
  return data;
};
