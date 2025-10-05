import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home.jsx';
import NavBar from './components/NavBar.jsx';
import Footer from './components/Footer.jsx';
import Step1 from './pages/StepOne.jsx';
import Step2 from './pages/StepTwo.jsx';
import Step3 from './pages/StepThree.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home></Home>}>
            <Route path="/step1" element={<Step1></Step1>}></Route>
            <Route path="/step2" element={<Step2></Step2>}></Route>
            <Route path="/step3" element={<Step3></Step3>}></Route>
          </Route>
        </Routes>      
        {/* <Footer /> */}
      </BrowserRouter>
    </>
  )
}

export default App
