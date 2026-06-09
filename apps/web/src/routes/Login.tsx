import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    const res = await fetch(
      'http://127.0.0.1:8787/auth/login',
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

    const data = await res.json()

    if (!res.ok) {
      alert(data.error)
      return
    }

    localStorage.setItem(
      'token',
      data.token
    )

    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="space-y-4 w-80"
      >
        <h1 className="text-2xl font-bold">
          Login
        </h1>

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <Button
          type="submit"
          className="w-full"
        >
          Login
        </Button>
      </form>
    </div>
  )
}