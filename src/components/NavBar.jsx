import React from 'react'
import logo from '../../public/logo.png'

const NavBar = () => {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-inner">
            <h1 className="logo">
              <img src={logo} alt="web app logo" id="dearly-logo"></img>
              <span id="logo-text">Dearly</span>
            </h1>
            <div className="nav-links">
              <div className="nav-links-inner">
                <a href="#">About</a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default NavBar
