import React from 'react'

const NavBar = () => {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-inner">
            <h1 className="logo">Dearly</h1>
            <div className="nav-links">
              <div className="nav-links-inner">
                <a href="#">Features</a>
                <a href="#">Templates</a>
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
