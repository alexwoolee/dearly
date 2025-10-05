import React from "react";
import { useState } from "react";

const InputEmail = ({ onEmailSubmit }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      console.log("User email:", email);
      onEmailSubmit && onEmailSubmit(email);
    }
  };

  return (
    <div className="minimal-email-container">
      <div className="floating-question">
        <h2 className="question-text">Ready to start your letter?</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="minimal-form">
        <div className="large-input-container">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="large-underline-input"
            required
          />
        </div>
        
        <button type="submit" className="minimal-button">
          Start Writing Your Letter
        </button>
      </form>
    </div>
  );
};

export default InputEmail;
