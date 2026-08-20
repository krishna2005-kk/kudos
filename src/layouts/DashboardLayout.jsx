import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'

function DashboardLayout() {
  return (
    <div>
      <Navbar />
      <main className="page">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
