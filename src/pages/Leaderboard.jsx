import { useEffect, useState } from "react";
import DepartmentFilter from "../components/leaderboard/DepartmentFilter";
import api, { getApiError } from '../lib/api'

function Leaderboard() {
  const [department, setDepartment] = useState("All departments");
  const [people, setPeople] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const params = department === 'All departments' ? {} : { department }
    api.get('/leaderboard', { params })
      .then((response) => { setPeople(response.data.data.entries); setError('') })
      .catch((requestError) => setError(getApiError(requestError)))
  }, [department])

  return (
    <div>
      <h1>Monthly Leaderboard</h1>

      <div className="card mt-4">
        <DepartmentFilter value={department} onChange={setDepartment} />
        {error && <p className="danger-text">{error}</p>}

        <div className="table-wrapper">
          <table className="simple-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Department</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.rank}>
                  <td>{person.rank}</td>
                  <td>{person.user.name}</td>
                  <td>{person.user.department}</td>
                  <td>{person.receivedPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
