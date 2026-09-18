import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../../Context/AuthContext'
import { getCountries } from '../../Endpoints/CityEndpoints'
import { getCities } from '../../Endpoints/CityEndpoints'
import type { CountryDTO, CityDTO } from '../../Models/dto'
import './Auth.css'

interface InformationModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
}

function InformationModal({ isOpen, onClose, onContinue }: InformationModalProps) {
  const [countries, setCountries] = useState<CountryDTO[]>([])
  const [cities, setCities] = useState<CityDTO[]>([])
  const [selectedCountryId, setSelectedCountryId] = useState<number | ''>('')
  const [selectedCityId, setSelectedCityId] = useState<number | ''>('')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { updateUserProfile } = useAuth()

  useEffect(() => {
    if (!isOpen) return
    getCountries().then(setCountries).catch(() => {})
    getCities().then(setCities).catch(() => {})
  }, [isOpen])

  const filteredCities = selectedCountryId
    ? cities.filter((c) => c.country === selectedCountryId)
    : []

  if (!isOpen) {
    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const profile: Record<string, unknown> = {}
      if (selectedCityId) profile.city = selectedCityId
      if (phone.trim()) profile.phone = phone.trim()
      if (Object.keys(profile).length > 0) {
        await updateUserProfile(profile)
      }
      onContinue()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
      setIsSubmitting(false)
    }
  }

  const handleLater = () => {
    onContinue()
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

        {error && <p className="auth-description" style={{ color: '#e53e3e', textAlign: 'center' }}>{error}</p>}

        <form className="auth-form auth-form--information" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="info-country">Country</label>
            <select className={selectedCountryId ? 'auth-select--selected' : ''} id="info-country" name="country" value={selectedCountryId} onChange={(event) => {
              const val = event.target.value
              setSelectedCountryId(val ? Number(val) : '')
              setSelectedCityId('')
            }}>
              <option value="">Country</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="auth-field">
            <label htmlFor="info-city">City</label>
            <select className={selectedCityId ? 'auth-select--selected' : ''} id="info-city" name="city" value={selectedCityId} onChange={(event) => {
              const val = event.target.value
              setSelectedCityId(val ? Number(val) : '')
            }} disabled={!selectedCountryId}>
              <option value="">City</option>
              {filteredCities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="auth-field">
            <label htmlFor="info-phone">Phone number</label>
            <input className={phone ? 'auth-select--selected' : ''} id="info-phone" name="phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone number"/>
          </div>

          <div className="auth-actions">
            <button className="auth-continue" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : 'Continue'}
            </button>
            <button className="auth-secondary" type="button" onClick={handleLater}>Later</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default InformationModal
