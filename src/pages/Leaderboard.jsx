import { useState } from "react";
import DepartmentFilter from "../components/leaderboard/DepartmentFilter";
import { leaderboard } from "../data/mockData";

function Leaderboard() {
  const [department, setDepartment] = useState("All departments");

  const filteredPeople = leaderboard.filter((person) => {
    if (department === "All departments") {
      return true;
    }

    return person.department === department;
  });

  return (
    <div>
      <div className="page-heading">
        <h1>Monthly Leaderboard</h1>
        <p>See who received the most recognition this month.</p>
      </div>

      <div className="card mt-4">
        <DepartmentFilter value={department} onChange={setDepartment} />

        {filteredPeople.length === 0 ? (
          <p className="empty-text">No employees found for this department.</p>
        ) : (
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
              {filteredPeople.map((person) => (
                <tr key={person.rank}>
                  <td>{person.rank}</td>
                  <td>{person.name}</td>
                  <td>{person.department}</td>
                  <td>{person.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
