import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup() {
  const navigate = useNavigate()

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const handleSignup =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault()

      try {
        setLoading(true)

        const res = await fetch(
          'http://127.0.0.1:8787/auth/register',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        )

        const data =
          await res.json()

        if (data.token) {
          localStorage.setItem(
            'token',
            data.token
          )

          navigate('/dashboard')
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Create Account
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="border p-3 rounded w-full mb-4"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="border p-3 rounded w-full mb-4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white w-full py-3 rounded"
        >
          {loading
            ? 'Creating...'
            : 'Create Account'}
        </button>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-600"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}