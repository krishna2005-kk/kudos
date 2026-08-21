import { kudosFeed } from '../data/mockData'

// TODO: Replace mock kudos data with backend kudos API calls later.
export async function getKudosFeed() {
  return kudosFeed
}

export async function sendKudos() {
  return { success: true }
}
