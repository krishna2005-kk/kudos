function DepartmentFilter({ value, onChange }) {
  return (
    <div className="mb-4">
      <label className="label" htmlFor="department-filter">
        Department
      </label>
      <select className="field" id="department-filter" value={value} onChange={(event) => onChange(event.target.value)}>
        <option>All departments</option>
        <option>Engineering</option>
        <option>Design</option>
        <option>Marketing</option>
        <option>Sales</option>
      </select>
    </div>
  )
}

export default DepartmentFilter
