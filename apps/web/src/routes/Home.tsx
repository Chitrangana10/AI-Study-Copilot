import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-8 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold">
            AI Study Copilot
          </h1>

          <p className="mt-6 text-xl text-gray-600">
            Turn your notes into
            knowledge.
          </p>

          <Link
            to="/signup"
            className="inline-block mt-8 bg-black text-white px-6 py-3 rounded"
          >
            Get Started
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div className="border rounded-lg p-6 bg-white">
            <h2 className="text-2xl font-bold">
              📚 Smart Summaries
            </h2>

            <p className="mt-3 text-gray-600">
              Generate concise study
              notes instantly.
            </p>
          </div>

          <div className="border rounded-lg p-6 bg-white">
            <h2 className="text-2xl font-bold">
              📝 Auto Quizzes
            </h2>

            <p className="mt-3 text-gray-600">
              Test yourself with
              AI-generated questions.
            </p>
          </div>

          <div className="border rounded-lg p-6 bg-white">
            <h2 className="text-2xl font-bold">
              🤖 AI Chat
            </h2>

            <p className="mt-3 text-gray-600">
              Ask questions directly
              from your notes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}