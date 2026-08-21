import api from "../lib/api";

export async function getCurrentUser() {
  const response = await api.get("/users/me");
  return response.data.data.user;
}
