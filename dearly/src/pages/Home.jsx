import React, { useState } from 'react'
import NavBar from '../components/NavBar'
import HomeFront from '../components/HomeFront'
import HomeFeatures from '../components/HomeFeatures'
import InputEmail from '../components/InputEmail'
import Step1 from './StepOne'
import Step2 from './StepTwo'
import Step3 from './StepThree'

const Home = () => {
  const [currentStep, setCurrentStep] = useState('email') // so far we have: email, step1, step2, step3
  const [userEmail, setUserEmail] = useState('') // s
  const [userName, setUserName] = useState('')
  const [receiverName, setReceiverName] = useState('')
  const [relationship, setRelationship] = useState('')

  const handleEmailSubmit = (email) => {
    console.log('Email submitted:', email)
    setUserEmail(email)
    setCurrentStep('step1')
  }

  const handleStep1Next = (name) => {
    setUserName(name)
    console.log('User name:', name)
    setCurrentStep('step2')
  }

  const handleStep1Back = () => {
    setCurrentStep('email')
  }

  const handleStep2Next = (receiver) => {
    setReceiverName(receiver)
    console.log('Receiver name:', receiver)
    setCurrentStep('step3')
  }

  const handleStep2Back = () => {
    setCurrentStep('step1')
  }

  const handleStep3Next = (rel) => {
    setRelationship(rel)
    console.log('Relationship:', rel)
    console.log('All data:', { userEmail, userName, receiverName, relationship })
    // Here you can proceed to the next part of your app
  }

  const handleStep3Back = () => {
    setCurrentStep('step2')
  }

  console.log('Current step:', currentStep)

  return (
    <div className="home-container">
      <NavBar />
    
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
    </div>
  )
}

export default Home
