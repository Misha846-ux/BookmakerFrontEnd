import { useState } from 'react'
import type { FormEvent } from 'react'
import './Auth.css'

interface AuthenticationModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
}

function AuthenticationModal({ isOpen, onClose, onContinue }: AuthenticationModalProps) {
  const [code, setCode] = useState('')

  if (!isOpen) {
    return null
  }

  const isCodeEntered = Boolean(code.trim())
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isCodeEntered) {
      onContinue()
    }
  }

  return (
    <div className="auth-backdrop" role="presentation">
      <section className="auth-modal auth-modal--authentication" role="dialog" aria-modal="true" aria-labelledby="authentication-modal-title">
        <button className="auth-close" type="button" onClick={onClose} aria-label="Close authentication">
          <span aria-hidden="true">&times;</span>
        </button>

        <h1 className="auth-title" id="authentication-modal-title">Authentication</h1>

        <form className="auth-form auth-form--authentication" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="authentication-code">Code</label>
            <input id="authentication-code" name="code" type="text" value={code} onChange={(event) => setCode(event.target.value)} placeholder="Code" autoComplete="one-time-code"/>
            <p className="auth-description">
              We have sent you an email with the code.<br />
              Check your mail and enter the code for the authentication
            </p>
          </div>

          <button className="auth-continue" type="submit" disabled={!isCodeEntered}>Continue</button>
        </form>
      </section>
    </div>
  )
}

export default AuthenticationModal