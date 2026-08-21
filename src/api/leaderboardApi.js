import api from "../lib/api";

export async function getLeaderboard(params) {
  const response = await api.get("/leaderboard", { params });
  return response.data.data;
}
