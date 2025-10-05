import { useState } from "react";

function Step1({ onNext, onBack }) {
  const [userName, setUserName] = useState(""); 

  const handleSubmit = (e) => {
    e.preventDefault(); // prevents default behavior of form submission
    if (userName.trim()) { // if user enters "     " for example, if condition will not pass
      console.log("Username:", userName.trim());
      onNext && onNext(userName.trim());
    }
  };

  return (
    <div className="step-container">
      <div className="floating-question">
        <h1 className="question-text">What's your name?</h1>
      </div>
      

      {/* HANDLE INPUT */}
      <form onSubmit={handleSubmit} className="simple-form">
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
        

        <div className="nav-btns">
          <button type="button" onClick={onBack} className="back-btn">← Back</button>
          <button type="submit" className="continue-btn">Continue →</button>
        </div>
      </form>
    </div>
  );
}

export default Step1;
