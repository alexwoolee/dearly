import React from 'react';

const StepFive = ({ userEmail, userName, receiverName, relationship, subject, message, onBack, onSend }) => {
  return (
    <div className="step-container" style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '32px' }}>Email Preview</h1>

      <div className="email-preview" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header table */}
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

        {/* Email card */}
        <div
          className="message-container"
          style={{
            marginTop: '20px',
            padding: '24px',
            background: '#fef9f0',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {/* Subject as H1 */}
          {subject && (
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' }}>
              {subject}
            </h1>
          )}

          <p style={{ fontSize: '18px', marginBottom: '16px' }}>
            <strong>Dear {receiverName},</strong>
          </p>

          {/* Render paragraphs & images in order */}
          {Array.isArray(message) &&
            message.map((section, idx) => {
              if (section.type === 'paragraph') {
                return (
                  <p key={idx} style={{ fontSize: '18px', margin: '16px 0', textAlign: 'left' }}>
                    {section.content}
                  </p>
                );
              }
              if (section.type === 'image') {
                return (
                  <div key={idx} className="images-container" style={{ margin: '16px 0' }}>
                    {section.content.map((file, i) => (
                      <img
                        key={i}
                        src={URL.createObjectURL(file)}
                        alt={`uploaded-${idx}-${i}`}
                        style={{
                          width: '100%',
                          maxWidth: '100%',
                          display: 'block',
                          margin: '0 auto 24px',
                          borderRadius: '8px',
                        }}
                      />
                    ))}
                  </div>
                );
              }
              return null;
            })}

          <p style={{ fontSize: '18px', marginTop: '16px', textAlign: 'left' }}>
            Best regards,<br />
            {userName}
          </p>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="nav-btns" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button type="button" onClick={onSend} className="send-button" style={{ padding: '8px 16px' }}>
          Send
        </button>
        <button type="button" onClick={onBack} className="back-btn" style={{ padding: '8px 16px' }}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default StepFive;
