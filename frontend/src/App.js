import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import "./App.css";
import backgroundImage from "./components/noaa-ieWHXjjAEwY-unsplash (1).jpg";

function App() {
  console.log("Background image path:", backgroundImage);
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
