import { useState } from 'react'
import Header from './Components/Header/Header'
import LoginModal from './Components/Auth/LoginModal'
import RegisterModal from './Components/Auth/RegisterModal'
import './Main.css'

function App() {
  const [openModal, setOpenModal] = useState<'register' | 'login' | null>(null)

  return (
    <>
      <Header onRegister={() => setOpenModal('register')} onSignIn={() => setOpenModal('login')}/>
      <RegisterModal isOpen={openModal === 'register'} onClose={() => setOpenModal(null)} onSwitchToLogin={() => setOpenModal('login')} onContinue={() => undefined}/>
      <LoginModal isOpen={openModal === 'login'} onClose={() => setOpenModal(null)} onSwitchToRegister={() => setOpenModal('register')} onContinue={() => undefined}/>
    </>
  )
}

export default App