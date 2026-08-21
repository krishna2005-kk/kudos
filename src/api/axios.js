// TODO: Add the real backend base URL when it is ready.
const apiClient = {
  get: async () => {
    throw new Error('Backend API is not connected yet.')
  },
  post: async () => {
    throw new Error('Backend API is not connected yet.')
  },
}

export default apiClient
