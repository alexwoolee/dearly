import { useState } from "react";

function Step4({ onNext, onBack }) {
  const [sections, setSections] = useState([{ 
    type: "paragraph", // initially we ask for paragraph
    content: "" 
  }]);
  const [showOptions, setShowOptions] = useState(false); // init., do not show options


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
    setShowOptions(false); // hide menu after choosing
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext && onNext(sections);
  };

  return (
    <div className="step-container">
      <h1 className="question-text">Build Your Mail</h1>

      <form onSubmit={handleSubmit} className="simple-form">
        {sections.map((section, idx) => (
          <div key={idx} className="section-block">
            {section.type === "paragraph" ? (
              <textarea
                className="message-textarea"
                value={section.content}
                onChange={(e) => handleSectionChange(idx, e.target.value)}
                placeholder="Write a paragraph..."
              />
            ) : (
              <div className="input-div">
                <label
                  className="input-text browse"
                  htmlFor={`image-upload-${idx}`}
                >
                  Browse Images
                </label>
                <input
                  id={`image-upload-${idx}`}
                  type="file"
                  accept="image/png, image/jpeg, image/gif, image/svg, image/webp, image/jpg"
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
          </div>
        ))}

        {/* Modern Add Section Button */}
        <div className="add-section">
          {!showOptions ? (
            <button
              type="button"
              className="plus-button"
              onClick={() => setShowOptions(true)}
            >
              +
            </button>
          ) : (
            <div className="option-buttons">
              <button
                type="button"
                className="option-button"
                onClick={() => addSection("paragraph")}
              >
                Paragraph
              </button>
              <button
                type="button"
                className="option-button"
                onClick={() => addSection("image")}
              >
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
