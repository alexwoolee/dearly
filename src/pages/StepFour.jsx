import { useState } from "react";

function Step4({ onNext, onBack }) {
  const [sections, setSections] = useState([{ 
    type: "paragraph",
    content: "" 
  }]);
  const [showOptions, setShowOptions] = useState(false);

  const handleSectionChange = (index, value) => {
    const newSections = [...sections];
    newSections[index].content = value;
    setSections(newSections);
  };

  const handleImageChange = (index, files) => {
    const newSections = [...sections];
    newSections[index].content = Array.from(files);
    setSections(newSections);
  };

  const addSection = (type) => {
    setSections([
      ...sections,
      { type, content: type === "paragraph" ? "" : [] },
    ]);
    setShowOptions(false);
  };

  const removeSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext && onNext(sections);
  };

  return (
    <div className="step-container">
      <div className="floating-question">
        <h1 className="question-text">Build Your Mail</h1>
      </div>

      <form onSubmit={handleSubmit} className="simple-form">
        {sections.map((section, idx) => (
          <div key={idx} className="section-block relative">
            {section.type === "paragraph" ? (
              <textarea
                className="message-textarea"
                value={section.content}
                onChange={(e) => handleSectionChange(idx, e.target.value)}
                placeholder="Write a paragraph..."
              />
            ) : (
              <div className="input-div">
                <label className="input-text browse" htmlFor={`image-upload-${idx}`}>
                  Browse Images
                </label>
                <input
                  id={`image-upload-${idx}`}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => handleImageChange(idx, e.target.files)}
                />
                <div className="image-previews">
                  {section.content.length > 0 &&
                    section.content.map((file, i) => {
                      const src = URL.createObjectURL(file);
                      return (
                        <img
                          key={i}
                          className="image-preview"
                          src={src}
                          alt="preview"
                        />
                      );
                    })}
                </div>
              </div>
            )}

            {/* 🗑️ Trash button (hidden for first section) */}
            {idx > 0 && (
              <button
                type="button"
                className="absolute bottom-2 right-2 text-gray-500 hover:text-red-600"
                onClick={() => removeSection(idx)}
              >
                {/* SVG Trash Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}

        <div className="add-section">
          {!showOptions ? (
            <button type="button" className="plus-button" onClick={() => setShowOptions(true)}>
              +
            </button>
          ) : (
            <div className="option-buttons">
              <button type="button" className="option-button" onClick={() => addSection("paragraph")}>
                Paragraph
              </button>
              <button type="button" className="option-button" onClick={() => addSection("image")}>
                Image
              </button>
            </div>
          )}
        </div>

        <div className="nav-btns">
          <button type="button" onClick={onBack} className="back-btn">← Back</button>
          <button type="submit" className="continue-btn">Continue →</button>
        </div>
      </form>
    </div>
  );
}

export default Step4;
