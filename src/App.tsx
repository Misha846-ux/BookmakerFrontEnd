import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import MainPage from './Components/MainPage/MainPage'
import Hero from './Components/Hero/Hero'
import "./Main.css"

function App() {
  return (
    <div className="app_wrapper">
      <Header/>
      <main className='main_content'>
        <Hero/>
        <MainPage/>
      </main>
      <Footer/>
    </div>
  )
}

export default App
