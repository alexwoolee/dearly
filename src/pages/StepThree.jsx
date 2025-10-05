import { useState } from "react";

function Step3({ onNext, onBack, userName, receiverName }) {
  const [selectedRelationship, setSelectedRelationship] = useState("");

  const relationships = [
    { id: "family", label: "Family Member", icon: "👨‍👩‍👧‍👦", description: "Parent, sibling, grandparent, etc." },
    { id: "friend", label: "Friend", icon: "👫", description: "Close friend, best friend, etc." },
    { id: "partner", label: "Partner", icon: "💕", description: "Boyfriend, girlfriend, spouse, etc." },
    { id: "coworker", label: "Coworker", icon: "👔", description: "Colleague, boss, team member, etc." },
    { id: "mentor", label: "Mentor", icon: "🎓", description: "Teacher, coach, advisor, etc." },
    { id: "other", label: "Other", icon: "💝", description: "Someone special in your life" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRelationship) {
      console.log("Selected relationship:", selectedRelationship);
      onNext && onNext(selectedRelationship);
    }
  };

  return (
    <div className="step-container">
      <div className="floating-question">
        <h1 className="question-text">What's your relationship?</h1>
      </div>

      
      <form onSubmit={handleSubmit} className="paraImg-form">
        <div className="minimal-relationship-grid">
          {relationships.map((relationship) => (
            <button
              key={relationship.id}
              type="button"
              className={`minimal-relationship-card ${selectedRelationship === relationship.id ? 'selected' : ''}`}
              onClick={() => setSelectedRelationship(relationship.id)}
            >
              <div className="relationship-icon">{relationship.icon}</div>
              <div className="relationship-label">{relationship.label}</div>
            </button>
          ))}
        </div>

        
        <div className="nav-btns">
          <button type="button" onClick={onBack} className="back-btn">← Back</button>
          <button 
            type="submit" 
            className="continue-btn"
            disabled={!selectedRelationship}
          >
            Continue →
          </button>
        </div>
      </form>
    </div>
  );
}

export default Step3;
