import { useState } from 'react'
import type { FormEvent } from 'react'
import './Auth.css'

interface InformationModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
}

const citiesByCountry: Record<string, string[]> = {
  Poland: ['Warsaw', 'Wroclaw', 'Krakow', 'Gdansk', 'Poznan', 'Lodz'],
  Ukraine: ['Kyiv', 'Lviv', 'Odesa', 'Kharkiv', 'Dnipro', 'Poltava'],
  Germany: ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt', 'Dresden'],
  France: ['Paris', 'Lyon', 'Marseille', 'Nice', 'Toulouse', 'Bordeaux'],
}

function InformationModal({ isOpen, onClose, onContinue }: InformationModalProps) {
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [travelReason, setTravelReason] = useState('')
  const [pet, setPet] = useState('')
  const availableCities = citiesByCountry[country] ?? []

  if (!isOpen) {
    return null
  }

  const isFormComplete = Boolean(country && city && travelReason && pet)
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isFormComplete) {
      onContinue()
    }
  }

  return (
    <div className="auth-backdrop" role="presentation">
      <section className="auth-modal auth-modal--information" role="dialog" aria-modal="true" aria-labelledby="information-modal-title">
        <button className="auth-close" type="button" onClick={onClose} aria-label="Close information">
          <span aria-hidden="true">&times;</span>
        </button>

        <h1 className="auth-title" id="information-modal-title">Information</h1>
        <p className="auth-description auth-description--intro">
          Tell us about yourself so we can better<br />
          choose options for you :)
        </p>

        <form className="auth-form auth-form--information" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="country">Country</label>
            <select className={country ? 'auth-select--selected' : ''} id="country" name="country" value={country} onChange={(event) => { setCountry(event.target.value); setCity('') }}>
              <option value="">Country</option>
              <option value="Poland">Poland</option>
              <option value="Ukraine">Ukraine</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
            </select>
          </div>

          <div className="auth-field">
            <label htmlFor="city">City</label>
            <select className={city ? 'auth-select--selected' : ''} id="city" name="city" value={city} onChange={(event) => setCity(event.target.value)} disabled={!country}>
              <option value="">City</option>
              {availableCities.map((availableCity) => (
                <option key={availableCity} value={availableCity}>{availableCity}</option>
              ))}
            </select>
          </div>

          <div className="auth-field">
            <label htmlFor="travel-reason">Why do you travel?</label>
            <select className={travelReason ? 'auth-select--selected' : ''} id="travel-reason" name="travelReason" value={travelReason} onChange={(event) => setTravelReason(event.target.value)}>
              <option value="">Why do you travel?</option>
              <option value="Leisure">Leisure</option>
              <option value="Business">Business</option>
              <option value="Visiting friends">Visiting friends</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <fieldset className="auth-radio-group">
            <legend>Travelling with a pet?</legend>
            <label>
              <input type="radio" name="pet" value="yes" checked={pet === 'yes'} onChange={(event) => setPet(event.target.value)} />
              Yes
            </label>
            <label>
              <input type="radio" name="pet" value="no" checked={pet === 'no'} onChange={(event) => setPet(event.target.value)} />
              No
            </label>
          </fieldset>

          <div className="auth-actions">
            <button className="auth-continue" type="submit" disabled={!isFormComplete}>Continue</button>
            <button className="auth-secondary" type="button" onClick={onContinue}>Later</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default InformationModal