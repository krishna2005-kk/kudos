import api from "../lib/api";

export async function loginUser(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data.data;
}

export async function signupUser(values) {
  const response = await api.post("/auth/signup", values);
  return response.data.data;
}
