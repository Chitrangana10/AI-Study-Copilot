import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

type Note = {
  id: string
  title: string
  rawText: string
  fileUrl?: string
}

export default function Note() {
  const { id } = useParams()

  const [note, setNote] =
    useState<Note | null>(null)

  const [activeTab, setActiveTab] =
    useState('summary')

  const [summary, setSummary] =
    useState('')

  const [structured, setStructured] =
    useState('')

  const [loadingSummary, setLoadingSummary] =
    useState(false)

  const [loadingStructured, setLoadingStructured] =
    useState(false)

  const [quiz, setQuiz] =
  useState<any[]>([])

  const [loadingQuiz, setLoadingQuiz] =
  useState(false)

  const [selectedAnswers, setSelectedAnswers] =
  useState<Record<number, string>>({})

  const [message, setMessage] =
  useState('')

  const [chatMessages, setChatMessages] =
  useState<
    {
      role: string
      content: string
    }[]
  >([])

  const [loadingChat, setLoadingChat] =
  useState(false)


  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token =
          localStorage.getItem('token')

        const res = await fetch(
          `http://127.0.0.1:8787/notes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await res.json()

        setNote(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchNote()
  }, [id])

  const generateSummary =
    async () => {
      try {
        setLoadingSummary(true)

        const token =
          localStorage.getItem('token')

        const res = await fetch(
          `http://127.0.0.1:8787/ai/summary/${id}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data =
          await res.json()

        setSummary(data.summary)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingSummary(false)
      }
    }

  const generateStructured =
    async () => {
      try {
        setLoadingStructured(true)

        const token =
          localStorage.getItem('token')

        const res = await fetch(
          `http://127.0.0.1:8787/ai/structure/${id}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data =
          await res.json()

        setStructured(data.content)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingStructured(false)
      }
    }

    const generateQuiz =
  async () => {
    try {
      setLoadingQuiz(true)

      const token =
        localStorage.getItem('token')

      const res = await fetch(
        `http://127.0.0.1:8787/ai/quiz/${id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data =
        await res.json()

      setQuiz(data.questions)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingQuiz(false)
    }
  }

  const sendMessage =
  async () => {
    if (!message.trim()) return

    try {
      setLoadingChat(true)

      const token =
        localStorage.getItem('token')

      const res = await fetch(
        `http://127.0.0.1:8787/ai/chat/${id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message,
          }),
        }
      )

      const data =
        await res.json()

      setChatMessages((prev) => [
        ...prev,
        {
          role: 'user',
          content: message,
        },
        {
          role: 'assistant',
          content: data.answer,
        },
      ])

      setMessage('')
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingChat(false)
    }
  }

  if (!note) {
    return (
      <div className="p-10">
        Loading...
      </div>
    )
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">
        {note.title}
      </h1>


{note.fileUrl && (
  <div className="mb-6 p-4 border rounded bg-blue-50">
    <p className="font-semibold">
      Uploaded File
    </p>

    <p>{note.fileUrl}</p>
  </div>
)}

      <div className="flex gap-4 mt-8">
        <button
          onClick={() =>
            setActiveTab('summary')
          }
          className={`px-4 py-2 rounded ${
            activeTab === 'summary'
              ? 'bg-black text-white'
              : 'border'
          }`}
        >
          Summary
        </button>

        <button
          onClick={() =>
            setActiveTab('structured')
          }
          className={`px-4 py-2 rounded ${
            activeTab === 'structured'
              ? 'bg-black text-white'
              : 'border'
          }`}
        >
          Structured
        </button>

        <button
          onClick={() =>
            setActiveTab('quiz')
          }
          className={`px-4 py-2 rounded ${
            activeTab === 'quiz'
              ? 'bg-black text-white'
              : 'border'
          }`}
        >
          Quiz
        </button>

        <button
          onClick={() =>
            setActiveTab('chat')
          }
          className={`px-4 py-2 rounded ${
            activeTab === 'chat'
              ? 'bg-black text-white'
              : 'border'
          }`}
        >
          Chat
        </button>
      </div>

      <div className="mt-8 border rounded p-6 min-h-[300px]">
        {activeTab === 'summary' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Summary
            </h2>

            <button
              onClick={generateSummary}
              disabled={loadingSummary}
              className="bg-black text-white px-4 py-2 rounded"
            >
              {loadingSummary
                ? 'Generating...'
                : 'Generate Summary'}
            </button>

            {summary && (
              <div className="mt-6 p-4 border rounded bg-gray-50">
                {summary}
              </div>
            )}

            <div className="mt-8 whitespace-pre-wrap">
              {note.rawText}
            </div>
          </div>
        )}

        {activeTab === 'structured' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Structured Notes
            </h2>

            <button
              onClick={generateStructured}
              disabled={loadingStructured}
              className="bg-black text-white px-4 py-2 rounded"
            >
              {loadingStructured
                ? 'Generating...'
                : 'Generate Structure'}
            </button>

            {structured && (
              <div className="mt-6 p-4 border rounded bg-gray-50 whitespace-pre-wrap">
                {structured}
              </div>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Quiz
            </h2>

            <button
  onClick={generateQuiz}
  disabled={loadingQuiz}
  className="bg-black text-white px-4 py-2 rounded"
>
  {loadingQuiz
    ? 'Generating...'
    : 'Generate Quiz'}
</button>

<div className="mt-6 space-y-6">
  {quiz.map((q, index) => (
    <div
      key={index}
      className="border rounded p-4"
    >
      <h3 className="font-semibold mb-4">
        {index + 1}. {q.question}
      </h3>

      <div className="space-y-2">
        {q.options.map(
          (
            option: string,
            optionIndex: number
          ) => (
            <button
              key={optionIndex}
              onClick={() =>
                setSelectedAnswers({
                  ...selectedAnswers,
                  [index]: option,
                })
              }
              className={`block w-full text-left border p-2 rounded ${
                selectedAnswers[
                  index
                ] === option
                  ? 'bg-blue-100'
                  : ''
              }`}
            >
              {option}
            </button>
          )
        )}
      </div>

      {selectedAnswers[index] && (
        <p className="mt-4">
          Correct Answer:{' '}
          <strong>
            {q.correct}
          </strong>
        </p>
      )}
    </div>
  ))}
</div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Chat
            </h2>

            <div className="space-y-4">
  <div className="border rounded p-4 h-96 overflow-y-auto">
    {chatMessages.length === 0 ? (
      <p>
        Ask anything about your notes.
      </p>
    ) : (
      chatMessages.map(
        (msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.role === 'user'
                ? 'text-right'
                : 'text-left'
            }`}
          >
            <div className="inline-block border rounded px-4 py-2">
              {msg.content}
            </div>
          </div>
        )
      )
    )}
  </div>

  <div className="flex gap-2">
    <input
      value={message}
      onChange={(e) =>
        setMessage(
          e.target.value
        )
      }
      placeholder="Ask about your notes..."
      className="border p-2 rounded flex-1"
    />

    <button
      onClick={sendMessage}
      disabled={loadingChat}
      className="bg-black text-white px-4 py-2 rounded"
    >
      {loadingChat
        ? 'Sending...'
        : 'Send'}
    </button>
  </div>
</div>
          </div>
        )}
      </div>
    </div>
  )
}