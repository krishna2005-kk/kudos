function DepartmentFilter({ value, onChange }) {
  return <select className="field w-auto min-w-40 bg-white" value={value} onChange={(event) => onChange(event.target.value)} aria-label="Filter by department"><option>All departments</option><option>Engineering</option><option>Design</option><option>Marketing</option><option>Sales</option></select>
}

export default DepartmentFilter