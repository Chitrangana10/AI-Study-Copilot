import { useState } from 'react'

const TOKEN_KEY = 'token'

export function useAuth() {
  const [token, setToken] = useState(
    localStorage.getItem(TOKEN_KEY)
  )

  const login = (jwt: string) => {
    localStorage.setItem(
      TOKEN_KEY,
      jwt
    )

    setToken(jwt)
  }

  const logout = () => {
    localStorage.removeItem(
      TOKEN_KEY
    )

    setToken(null)
  }

  return {
    token,
    isAuthenticated: !!token,
    login,
    logout,
  }
}