export const currentUser = {
  id: '1',
  name: 'Heer Solanki',
  email: 'heer.solanki@company.com',
  department: 'Engineering',
  avatar: 'HS',
  givingAllowance: 70,
  allowanceTotal: 100,
  earnedPoints: 120,
  kudosGiven: 18,
  kudosReceived: 24,
}

export const employees = [
  { id: '1', name: 'Heer Solanki', department: 'Engineering', avatar: 'HS' },
  { id: '2', name: 'Rahul Mehta', department: 'Engineering', avatar: 'RM' },
  { id: '3', name: 'Priya Shah', department: 'Design', avatar: 'PS' },
  { id: '4', name: 'Jay Patel', department: 'Marketing', avatar: 'JP' },
  { id: '5', name: 'Anika Desai', department: 'Sales', avatar: 'AD' },
]

export const kudosFeed = [
  { id: '1', sender: employees[0], receiver: employees[1], points: 20, message: 'Great work on the project launch. Your calm problem-solving made a real difference!', value: '#Teamwork', reactions: { '👍': 5, '👏': 3, '🔥': 2 } },
  { id: '2', sender: employees[2], receiver: employees[3], points: 50, message: 'Thank you for bringing such a thoughtful perspective to our campaign.', value: '#Innovation', reactions: { '👍': 8, '👏': 4, '🔥': 1 } },
  { id: '3', sender: employees[4], receiver: employees[2], points: 10, message: 'You made the customer handoff feel effortless. Amazing partnership!', value: '#CustomerObsession', reactions: { '👍': 4, '👏': 6, '🔥': 3 } },
]

export const leaderboard = [
  { rank: 1, ...employees[1], points: 450 },
  { rank: 2, ...employees[2], points: 380 },
  { rank: 3, ...employees[0], points: 320 },
  { rank: 4, ...employees[3], points: 280 },
  { rank: 5, ...employees[4], points: 245 },
]

export const badges = [
  { icon: '🏆', title: 'Team Player', detail: 'Recognized for collaboration' },
  { icon: '💡', title: 'Innovator', detail: 'Brings fresh ideas to life' },
  { icon: '⭐', title: 'Top Recognized', detail: 'Among this month’s standouts' },
]