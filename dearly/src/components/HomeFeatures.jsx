import React from 'react'

const HomeFeatures = () => {
  return (
    <div>
      <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon feature-icon-pink">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="feature-title">Custom Formats</h3>
            <p className="feature-description">
              Choose from beautiful letter formats designed to make your words shine and create lasting impressions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon feature-icon-purple">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="feature-title">Beautiful Templates</h3>
            <p className="feature-description">
              Access a curated collection of templates for every occasion - birthdays, anniversaries, holidays, and more.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon feature-icon-green">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="feature-title">Made with Love</h3>
            <p className="feature-description">
              Every template and format is crafted with care to help you express your feelings in the most meaningful way.
            </p>
          </div>
        </div>
    </div>
  )
}

export default HomeFeatures
