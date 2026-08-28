import './Auth.css'

interface AllDoneModalProps {
  isOpen: boolean
  onClose: () => void
  onCheckProfile: () => void
  onContinueBooking: () => void
}

function AllDoneModal({ isOpen, onClose, onCheckProfile, onContinueBooking }: AllDoneModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="auth-backdrop" role="presentation">
      <section className="auth-modal auth-modal--all-done" role="dialog" aria-modal="true" aria-labelledby="all-done-modal-title">
        <button className="auth-close" type="button" onClick={onClose} aria-label="Close all done modal">
          <span aria-hidden="true">&times;</span>
        </button>

        <h1 className="auth-title" id="all-done-modal-title">All done!</h1>

        <div className="success-icon-wrapper" aria-hidden="true">
          <svg className="success-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="4" />
            <path d="M29 51L43 65L72 35" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="auth-actions auth-actions--all-done">
          <button className="auth-continue" type="button" onClick={onCheckProfile}>Check your profile!</button>
          <button className="auth-secondary" type="button" onClick={onContinueBooking}>Continue booking</button>
        </div>
      </section>
    </div>
  )
}

export default AllDoneModal