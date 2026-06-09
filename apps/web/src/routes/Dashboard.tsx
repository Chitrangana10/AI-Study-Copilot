import { useEffect, useState } from 'react'

import Layout from '../components/Layout'
import NoteCard from '../components/NoteCard'
import UploadModal from '../components/UploadModal'

import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

type User = {
  id: string
  email: string
  createdAt: string
}

type Note = {
  id: string
  title: string
  rawText: string
  createdAt: string
}

export default function Dashboard() {
  const [user, setUser] =
    useState<User | null>(null)

  const [notes, setNotes] =
    useState<Note[]>([])

  const [openUpload, setOpenUpload] =
    useState(false)

  const fetchNotes = async () => {
    try {
      const token =
        localStorage.getItem('token')

      const res = await fetch(
        'http://127.0.0.1:8787/notes',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()

      setNotes(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =
          localStorage.getItem('token')

        const userRes = await fetch(
          'http://127.0.0.1:8787/auth/me',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const userData =
          await userRes.json()

        setUser(userData)

        await fetchNotes()
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [])

  return (
    <Layout title="Dashboard">
      <div>
        <h2 className="text-3xl font-bold">
          Welcome back
          {user
            ? `, ${user.email}`
            : ''}
        </h2>

        <Badge className="mt-3">
          Study Smarter 🚀
        </Badge>
      </div>

      <button
        onClick={() =>
          setOpenUpload(true)
        }
        className="bg-black text-white px-4 py-2 rounded mt-6"
      >
        Upload Notes
      </button>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">
              Total Notes
            </p>

            <h3 className="text-3xl font-bold mt-2">
              {notes.length}
            </h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">
              Quizzes Taken
            </p>

            <h3 className="text-3xl font-bold mt-2">
              0
            </h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">
              Study Streak
            </p>

            <h3 className="text-3xl font-bold mt-2">
              1 Day
            </h3>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-5">
          Recent Notes
        </h2>

        {notes.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <h3 className="text-xl font-semibold">
                No Notes Yet
              </h3>

              <p className="text-gray-500 mt-2">
                Upload your first notes
                to start studying.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                title={note.title}
                date={new Date(
                  note.createdAt
                ).toLocaleDateString()}
                summary={note.rawText.slice(
                  0,
                  100
                )}
              />
            ))}
          </div>
        )}
      </div>

      <UploadModal
        open={openUpload}
        onClose={() =>
          setOpenUpload(false)
        }
        onUploadSuccess={fetchNotes}
      />
    </Layout>
  )
}