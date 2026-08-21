import { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '@visa/nova-react/button'
import DepartmentFilter from '../components/leaderboard/DepartmentFilter'
import api, { getApiError } from '../lib/api'

function Admin() {
  const [users, setUsers] = useState([])
  const [department, setDepartment] = useState('All departments')
  const [selectedUserId, setSelectedUserId] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadUsers = useCallback(async function loadUsers() {
    try {
      const params = department === 'All departments' ? {} : { department }
      const response = await api.get('/admin/users', { params })
      const nextUsers = response.data.data.users
      setUsers(nextUsers)
      setSelectedUserId((current) => current || nextUsers[0]?._id || '')
      setError('')
    } catch (requestError) {
      setError(getApiError(requestError))
    }
  }, [department])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const stats = useMemo(() => ({
    employees: users.filter((user) => user.role === 'employee').length,
    earned: users.reduce((total, user) => total + (user.earnedPoints || 0), 0),
    available: users.reduce((total, user) => total + (user.givingAllowance || 0), 0),
  }), [users])

  async function submitAdjustment(event) {
    event.preventDefault()

    try {
      const response = await api.post(`/admin/users/${selectedUserId}/points`, { amount: 100 })
      setUsers((current) => current.map((user) => (
        user._id === response.data.data.user._id ? { ...user, ...response.data.data.user } : user
      )))
      setMessage('100 points awarded successfully.')
      setError('')
    } catch (requestError) {
      setError(getApiError(requestError))
      setMessage('')
    }
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>View employee points and award exactly 100 earned points.</p>

      <div className="simple-grid mt-4">
        <div className="card"><h3>Employees</h3><p>{stats.employees}</p></div>
        <div className="card"><h3>Total Earned Points</h3><p>{stats.earned}</p></div>
        <div className="card"><h3>Available Giving Points</h3><p>{stats.available}</p></div>
      </div>

      <section className="card mt-5">
        <h2>Award 100 Points to Employee</h2>
        <form className="mt-4" onSubmit={submitAdjustment}>
          <label className="label" htmlFor="admin-employee">Employee</label>
          <select className="field" id="admin-employee" value={selectedUserId} onChange={(event) => setSelectedUserId(event.target.value)} required>
            <option value="">Select employee</option>
            {users.filter((user) => user.role === 'employee').map((user) => (
              <option key={user._id} value={user._id}>{user.name} - {user.department}</option>
            ))}
          </select>
          <p className="mt-3">This action awards exactly <strong>100 earned points</strong>.</p>
          <Button className="primary-button mt-4" type="submit">Award 100 Points</Button>
        </form>
        {message && <p className="success-text mt-3">{message}</p>}
        {error && <p className="danger-text mt-3">{error}</p>}
      </section>

      <section className="card mt-5">
        <h2>Employee List</h2>
        <DepartmentFilter value={department} onChange={setDepartment} />
        <div className="table-wrapper">
          <table className="simple-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Department</th><th>Earned</th><th>Giving</th></tr>
            </thead>
            <tbody>
              {users.filter((user) => user.role === 'employee').map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.department}</td>
                  <td>{user.earnedPoints}</td>
                  <td>{user.givingAllowance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Admin
