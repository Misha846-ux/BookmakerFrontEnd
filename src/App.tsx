import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './Components/Header/Header'
import LoginModal from './Components/Auth/LoginModal'
import RegisterModal from './Components/Auth/RegisterModal'
import Footer from './Components/Footer/Footer'
import MainPage from './Components/MainPage/MainPage'
import Hotel_Page from './Components/Hotel_Page/Hotel_Page'
import "./Main.css"

function App() {
  const [openModal, setOpenModal] = useState<'register' | 'login' | null>(null)

  return (
    <BrowserRouter>
    <div className="app_wrapper">
      <Header onRegister={() => setOpenModal('register')} onSignIn={() => setOpenModal('login')}/>
      <RegisterModal isOpen={openModal === 'register'} onClose={() => setOpenModal(null)} onSwitchToLogin={() => setOpenModal('login')} onContinue={() => undefined}/>
      <LoginModal isOpen={openModal === 'login'} onClose={() => setOpenModal(null)} onSwitchToRegister={() => setOpenModal('register')} onContinue={() => undefined}/>
      <main className='main_content'>
        <Routes>
          <Route path="/" element={<MainPage/>}></Route>
          <Route path="/hotel/:hotel_id" element={<Hotel_Page/>}></Route>
        </Routes>
      </main>
      <Footer/>
    </div>
    </BrowserRouter>
  )
}

export default App;