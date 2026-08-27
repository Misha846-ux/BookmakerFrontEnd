import { useState } from 'react'
import Header from './Components/Header/Header'
import LoginModal from './Components/Auth/LoginModal'
import RegisterModal from './Components/Auth/RegisterModal'
import Footer from './Components/Footer/Footer'
import MainPage from './Components/MainPage/MainPage'
import Hero from './Components/Hero/Hero'
import "./Main.css"

function App() {
  const [openModal, setOpenModal] = useState<'register' | 'login' | null>(null)

  return (
    <div className="app_wrapper">
      <Header onRegister={() => setOpenModal('register')} onSignIn={() => setOpenModal('login')}/>
      <RegisterModal isOpen={openModal === 'register'} onClose={() => setOpenModal(null)} onSwitchToLogin={() => setOpenModal('login')} onContinue={() => undefined}/>
      <LoginModal isOpen={openModal === 'login'} onClose={() => setOpenModal(null)} onSwitchToRegister={() => setOpenModal('register')} onContinue={() => undefined}/>
      <main className='main_content'>
        <Hero/>
        <MainPage/>
      </main>
      <Footer/>
    </div>
  )
}

export default App