import React, { useState } from "react";

function Step2({ onNext, onBack, userName }) {
  const [receiverName, setReceiverName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (receiverName.trim()) {
      console.log("Receiver name:", receiverName);
      onNext && onNext(receiverName);
    }
  };

  return (
    <div className="step-container">
      <div className="floating-question">
        <h1 className="question-text">Who are you writing to?</h1>
      </div>

      
      <form onSubmit={handleSubmit} className="simple-form">
        <div className="large-input-container">
          <input
            type="text"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            placeholder="Enter their name"
            className="large-input"
            required
          />
        </div>
        
        
        <div className="nav-btns">
          <button type="button" onClick={onBack} className="back-btn">← Back</button>
          <button type="submit" className="continue-btn">Continue →</button>
        </div>
      </form>
    </div>
  );
}

export default Step2;