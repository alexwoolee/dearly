import React from 'react';

const StepFive = ({ userEmail, userName, receiverName, relationship, message, onBack, onSend }) => {
  return (
    <div className="step-container">
      <h1>Email Preview</h1>

      <div className="email-preview">
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ fontWeight: 'bold', padding: '5px' }}>To:</td>
              <td>{userEmail}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', padding: '5px' }}>From:</td>
              <td>{userName}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', padding: '5px' }}>Relationship:</td>
              <td>{relationship}</td>
            </tr>
          </tbody>
        </table>

        <div
          className="message-container"
          style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}
        >
          <p><strong>Dear {receiverName},</strong></p>

          {/* Render paragraphs & images in order */}
          {Array.isArray(message) &&
            message.map((section, idx) => {
              if (section.type === 'paragraph') {
                return <p key={idx}>{section.content}</p>;
              }
              if (section.type === 'image') {
                return (
                  <div key={idx} className="images-container" style={{ marginTop: '10px' }}>
                    {section.content.map((file, i) => (
                      <img
                        key={i}
                        src={URL.createObjectURL(file)}
                        alt={`uploaded-${idx}-${i}`}
                        style={{
                          maxWidth: '200px',
                          marginRight: '10px',
                          marginBottom: '10px',
                        }}
                      />
                    ))}
                  </div>
                );
              }
              return null;
            })}

          <p>Best regards,<br />{userName}</p>
        </div>
      </div>

      <div className="nav-btns" style={{ marginTop: '20px' }}>
        <button type="button" onClick={onSend} className="send-button">
          Send
        </button>
      </div>
      <div className="nav-btns">
        <button type="button" onClick={onBack} className="back-btn">
          ← Back
        </button>
      </div>
    </div>
  );
};

export default StepFive;
