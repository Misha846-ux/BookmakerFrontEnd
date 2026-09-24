import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../../Context/AuthContext'
import './Auth.css'

interface AuthenticationModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
  password: string
  onVerified: (hasInfo: boolean) => void
}

function AuthenticationModal({ isOpen, onClose, email, password, onVerified }: AuthenticationModalProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { verifyAccount, login } = useAuth()

  if (!isOpen) {
    return null
  }

  const isCodeEntered = Boolean(code.trim())
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isCodeEntered) return

    setError('')
    setIsSubmitting(true)
    try {
      await verifyAccount(email, code)
      await login(email, password)
      const { getProfileStatus } = await import('../../Endpoints/UserEndpoints')
      const status = await getProfileStatus()
      onVerified(status.has_info)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-backdrop" role="presentation">
      <section className="auth-modal auth-modal--authentication" role="dialog" aria-modal="true" aria-labelledby="authentication-modal-title">
        <button className="auth-close" type="button" onClick={onClose} aria-label="Close authentication">
          <span aria-hidden="true">&times;</span>
        </button>

        <h1 className="auth-title" id="authentication-modal-title">Authentication</h1>

        {error && <p className="auth-description" style={{ color: '#e53e3e', textAlign: 'center' }}>{error}</p>}

        <form className="auth-form auth-form--authentication" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="authentication-code">Code</label>
            <input id="authentication-code" name="code" type="text" value={code} onChange={(event) => setCode(event.target.value)} placeholder="Code" autoComplete="one-time-code"/>
            <p className="auth-description">
              We have sent you an email with the code.<br />
              Check your mail and enter the code for the authentication
            </p>
          </div>

          <button className="auth-continue" type="submit" disabled={!isCodeEntered || isSubmitting}>
            {isSubmitting ? 'Please wait...' : 'Continue'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default AuthenticationModal
