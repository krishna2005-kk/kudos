export const currentUser = {
  id: '1',
  name: 'Heer Solanki',
  email: 'heer@example.com',
  department: 'Engineering',
  givingAllowance: 70,
  allowanceTotal: 100,
  earnedPoints: 120,
  pointsGiven: 30,
  pointsReceived: 120,
  kudosGiven: 5,
  kudosReceived: 8,
}

export const employees = [
  { id: '1', name: 'Heer Solanki', department: 'Engineering' },
  { id: '2', name: 'Rahul Mehta', department: 'Engineering' },
  { id: '3', name: 'Priya Shah', department: 'Design' },
  { id: '4', name: 'Jay Patel', department: 'Marketing' },
  { id: '5', name: 'Anika Desai', department: 'Sales' },
]

export const kudosFeed = [
  {
    id: '1',
    sender: 'Heer',
    receiver: 'Rahul',
    points: 20,
    message: 'Great work on the project!',
    value: '#Teamwork',
    reactions: { Like: 5, Clap: 3, Fire: 2 },
  },
  {
    id: '2',
    sender: 'Priya',
    receiver: 'Jay',
    points: 50,
    message: 'Thanks for helping with the campaign.',
    value: '#Innovation',
    reactions: { Like: 8, Clap: 4, Fire: 1 },
  },
  {
    id: '3',
    sender: 'Anika',
    receiver: 'Priya',
    points: 10,
    message: 'You explained the design clearly.',
    value: '#CustomerFocus',
    reactions: { Like: 4, Clap: 6, Fire: 3 },
  },
]

export const leaderboard = [
  { rank: 1, name: 'Rahul Mehta', department: 'Engineering', points: 450 },
  { rank: 2, name: 'Priya Shah', department: 'Design', points: 380 },
  { rank: 3, name: 'Heer Solanki', department: 'Engineering', points: 320 },
  { rank: 4, name: 'Jay Patel', department: 'Marketing', points: 280 },
  { rank: 5, name: 'Anika Desai', department: 'Sales', points: 245 },
]

export const pointHistory = [
  {
    id: 1,
    date: '20 Aug 2026',
    description: 'Gave 20 points to Rahul',
    type: 'debit',
    points: 20,
    balance: 'Remaining balance: 70',
  },
  {
    id: 2,
    date: '19 Aug 2026',
    description: 'Received 50 points from Priya',
    type: 'credit',
    points: 50,
    balance: 'Earned points: 120',
  },
  {
    id: 3,
    date: '18 Aug 2026',
    description: 'Gave 10 points to Jay',
    type: 'debit',
    points: 10,
    balance: 'Remaining balance: 90',
  },
  {
    id: 4,
    date: '15 Aug 2026',
    description: 'Received 20 points from Rahul',
    type: 'credit',
    points: 20,
    balance: 'Earned points: 70',
  },
]

export const badges = ['Trophy Team Player', 'Idea Innovator', 'Star Helpful Teammate']
