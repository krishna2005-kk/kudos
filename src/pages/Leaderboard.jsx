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
      <h1>Monthly Leaderboard</h1>

      <div className="card mt-4">
        <DepartmentFilter value={department} onChange={setDepartment} />

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
      </div>
    </div>
  );
}

export default Leaderboard;
