import React, { useState } from "react";

function Step4({ onNext, onBack, userName, receiverName, Message }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message) {
      console.log("Message written:", setMessage);
      onNext && onNext(message);
    }
  };

  return (
    <div className="step-container">
      <div className="floating-question">
        <h1 className="question-text">What do you want to tell them?</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="minimal-form">    
          
        <div className="navigation-buttons">
          <button type="button" onClick={onBack} className="back-button">
            ← Back
          </button>
          <button 
            type="submit" 
            className="continue-button"
            disabled={!selectedRelationship}
          >
            Continue →
          </button>
        </div>
      </form>
    </div>
  );
}

export default Step4;
