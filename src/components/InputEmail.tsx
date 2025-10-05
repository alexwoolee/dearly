import React from "react";
import { useState } from "react";

const InputEmail = ({ onEmailSubmit }) => {
  const [email, setEmail] = useState(""); 

  const handleSubmit = (e) => {
    e.preventDefault(); // prevents default behaviour of form (reloading page on submit)
    if (email.trim()) { // if email exists
      console.log("sending to email : ", email);
      onEmailSubmit && onEmailSubmit(email); // submit email
    }
  };

  return (
    <div className="email-container">      
      <form onSubmit={handleSubmit} className="minimal-form">
        <div className="large-input-container">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="large-input"
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
