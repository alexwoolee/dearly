import React from 'react'
import HomeFeatures from './HomeFeatures'

const HomeHero = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Send Love Through
            <span className="hero-title-accent"> Beautiful Mail</span>
          </h1>
          <p className="hero-subtitle">
            Create heartfelt letters with custom formats and templates. 
            Make every message to your loved ones special and memorable.
          </p>
          
          {/* Placeholder Button */}
          <div style={{ marginBottom: '8rem' }}>
            <button className="cta-button">
              Start Writing Your Letter
            </button>
          </div>

          <HomeFeatures />

        </div>
      </div>
    </div>
  )
}

export default HomeHero
