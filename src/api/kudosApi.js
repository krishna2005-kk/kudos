import api from "../lib/api";

export async function getKudosFeed(params) {
  const response = await api.get("/kudos", { params });
  return response.data.data;
}

export async function sendKudos(values) {
  const response = await api.post("/kudos", values);
  return response.data.data;
}
