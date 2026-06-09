import type { ReactNode } from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

type Props = {
  title: string
  children: ReactNode
}

export default function Layout({
  title,
  children,
}: Props) {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-60 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold">
          StudyAI
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <a
            href="/dashboard"
            className="block px-4 py-3 rounded-lg hover:bg-slate-800"
          >
            Dashboard
          </a>

          <a
            href="/dashboard"
            className="block px-4 py-3 rounded-lg hover:bg-slate-800"
          >
            My Notes
          </a>

          <a
            href="/dashboard"
            className="block px-4 py-3 rounded-lg hover:bg-slate-800"
          >
            Upload
          </a>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-600" />

            <span>User</span>
          </div>

          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1">
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {title}
          </h1>

          <Button>
            Upload Notes
          </Button>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}