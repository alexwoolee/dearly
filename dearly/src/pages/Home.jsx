import React from 'react'
// import useNavigate from 'react-router-dom'
import NavBar from '../components/NavBar'
import HomeHero from '../components/HomeHero'
import HomeFeatures from '../components/HomeFeatures'
import InputEmail from '../components/InputEmail'

const Home = () => {


  return (
    <div className="home-container">
      <NavBar />
      <HomeHero />
      <InputEmail />
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 Dearly. Made with ❤️ for meaningful connections.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
