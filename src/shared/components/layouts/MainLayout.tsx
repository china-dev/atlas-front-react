import { Outlet } from 'react-router-dom'
import { SideBar } from './SideBar'
import { AppHeader } from './AppHeader'

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <SideBar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
