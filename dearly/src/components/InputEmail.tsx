import React from 'react'

const inputEmail = () => {
  return (
    <div>
      <input type="email" placeholder="Enter your email" />
      <button>Submit</button>
      <div style={{ marginBottom: '8rem' }}>
        <button className="cta-button">
              Submit Email
        </button>
      </div>
    </div>
  )
}

export default inputEmail
