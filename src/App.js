import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from './components/Sign';
import './App.css';


function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<SignIn />} />
        </Routes>  
  </Router>
</div>
  );
}

export default App;
