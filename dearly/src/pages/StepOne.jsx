import React, { useState } from "react";

function Step1({ onNext, onBack }) {
  const [userName, setUserName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      console.log("User name:", userName);
      onNext && onNext(userName);
    }
  };

  return (
    <div className="minimal-step-container">
      <div className="floating-question">
        <h1 className="question-text">What's your name?</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="minimal-form">
        <div className="large-input-container">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
          className="large-input"
            required
          />
        </div>
        
        <div className="navigation-buttons">
          <button type="button" onClick={onBack} className="back-button">
            ← Back
          </button>
          <button type="submit" className="continue-button">
            Continue →
          </button>
        </div>
      </form>
    </div>
  );
}

export default Step1;
