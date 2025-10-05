import { useState } from 'react';
import NavBar from '../components/NavBar';
import HomeFront from '../components/HomeFront';
import HomeFeatures from '../components/HomeFeatures';
import InputEmail from '../components/InputEmail';
import Step1 from './StepOne';
import Step2 from './StepTwo';
import Step3 from './StepThree';
import Step4 from './StepFour';
import Step5 from './StepFive';

const Home = () => {
  const [currentStep, setCurrentStep] = useState('email'); // so far we have: email, step1, step2, step3, step4
  const [userEmail, setUserEmail] = useState(''); // e.g., taiwanexplorers276@gmail.com the receiver
  const [userName, setUserName] = useState(''); // e.g., Alex, the name of the sender
  const [receiverName, setReceiverName] = useState(''); // e.g., Anna, the name of the receiver
  const [relationship, setRelationship] = useState(''); // e.g., friend, coworker
  const [message, setMessage] = useState('');
  const [images, setImages] = useState('');

  // ---- handlers ----
  // step 0
  const handleEmailSubmit = (email) => {
    console.log('Email submitted:', email);
    setUserEmail(email);
    setCurrentStep('step1'); // go to step 1
  }

  // step 1 handlers
  const handleStep1Next = (name) => {
    setUserName(name);
    console.log('User name:', name);
    setCurrentStep('step2'); // go to step 2
  }

  const handleStep1Back = () => {
    setCurrentStep('email');
  }

  // step 2 handlers
  const handleStep2Next = (receiver) => {
    setReceiverName(receiver);
    console.log('Receiver name:', receiver);
    setCurrentStep('step3'); // go to step 3
  }

  const handleStep2Back = () => {
    setCurrentStep('step1');
  }

  // step 3 handlers
  const handleStep3Next = (rel) => {
    setRelationship(rel)
    console.log('Relationship:', rel);
    setCurrentStep('step4')
  }

  const handleStep3Back = () => {
    setCurrentStep('step2');
  }

  // step 4 handlers 
  const handleStep4Next = (message, images) => {
    setMessage(message)
    setImages(images);
    console.log("Message user wrote: ", message);
    setCurrentStep('step5');
    console.log('All data:', { userEmail, userName, receiverName, relationship, message, images });
  }

  const handleStep4Back = () => {
    setCurrentStep('step3');
  }

  // step 5 handler
  const handleStep5Back = () => {
    setCurrentStep('step4');
  }

  const handleStep5Home = () => {
    sendEmail();
    setCurrentStep('email');
  }

  const sendEmail = () => {
    const json = {
      "receiver": userEmail,
      "subject": "A Dearly message to you my " + relationship + ", " + receiverName + "!",
      "message": message ? message[0]['content'] : "",
      "files": images,
      "assetsDir": "assets",
      "signoffName": userName,
    }

  fetch('http://localhost:8280/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    return response.text();
  })
  .then(data => {
    console.log('Email sent successfully:', data);
    // Optionally, show a success message or move to a confirmation step
  })
  .catch(error => {
    console.error('Error sending email:', error);
    // Optionally, show an error message to the user
  });
  }

  console.log('Current step:', currentStep)

  return (
    <>
      <div className="home-container">
        <NavBar />

        {/* HOME PAGE */}
        {currentStep === 'email' && (
          <div>
            <HomeFront />
            <InputEmail onEmailSubmit={handleEmailSubmit} />
            <HomeFeatures />
          </div>
        )}
        
        {currentStep === 'step1' && (
          <Step1 onNext={handleStep1Next} onBack={handleStep1Back} />
        )}
        
        {currentStep === 'step2' && (
          <Step2 onNext={handleStep2Next} onBack={handleStep2Back} userName={userName} />
        )}
        
        {currentStep === 'step3' && (
          <Step3 onNext={handleStep3Next} onBack={handleStep3Back} userName={userName} receiverName={receiverName} />
        )}
        
        {currentStep === 'step4' && (
          <Step4 onNext={handleStep4Next} onBack={handleStep4Back} relationship={relationship} msg={message} img={images}></Step4>
        )}

        {/* EMAIL PREVIEW */}
        {currentStep === 'step5' && (
          <Step5
            userEmail={userEmail}
            userName={userName}
            receiverName={receiverName}
            relationship={relationship}
            message={message}
            images={images}
            onBack={handleStep5Back}
            onSend={handleStep5Home}
          />
        )}

      </div>
    </>
  )
}

export default Home
