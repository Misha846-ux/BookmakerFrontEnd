import { useState } from 'react'
import type { FormEvent } from 'react'
import './Auth.css'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister: () => void
  onContinue: () => void
}

function LoginModal({ isOpen, onClose, onSwitchToRegister, onContinue,}: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (!isOpen) {
    return null
  }

  const isFormComplete = Boolean(email.trim() && password.trim())
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isFormComplete) {
      onContinue()
    }
  }

  return (
    <div className="auth-backdrop" role="presentation">
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
        <button className="auth-close" type="button" onClick={onClose} aria-label="Close sign in">
          <span aria-hidden="true">&times;</span>
        </button>

        <h1 className="auth-title" id="login-modal-title"> Sign In </h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="Email"/>
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="Password"/>
          </div>

          <button className="auth-continue" type="submit" disabled={!isFormComplete}> Continue </button>
        </form>

        <p className="auth-switch">
          Do not have an account?{' '}
          <button type="button" onClick={onSwitchToRegister}> Register </button>
        </p>

        <button className="auth-google" type="button" aria-label="Sign in with Google">
          <svg className="google-mark" aria-hidden="true" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.483h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.616Z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.179l-2.908-2.258c-.806.54-1.834.86-3.048.86-2.347 0-4.337-1.586-5.047-3.72H.947v2.332A9 9 0 0 0 9 18Z" />
            <path fill="#FBBC05" d="M3.953 10.703A5.41 5.41 0 0 1 3.67 9c0-.59.102-1.164.283-1.703V4.965H.947A9 9 0 0 0 0 9c0 1.45.347 2.822.947 4.035l3.006-2.332Z" />
            <path fill="#EA4335" d="M9 3.577c1.323 0 2.51.455 3.444 1.348l2.583-2.583C13.463.893 11.426 0 9 0A9 9 0 0 0 .947 4.965l3.006 2.332C4.663 5.163 6.653 3.577 9 3.577Z" />
          </svg>
          Sign In with Google
        </button>
      </section>
    </div>
  )
}

export default LoginModal
