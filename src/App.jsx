import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Dashing from "./component/Dashing";
import Login from "./component/Login";
import Signup from "./component/Signup";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import ServicesPage from "./pages/Services";
import ContactPage from "./pages/Contact";
import ProtectedRoute from "./component/ProtectedRoute";
import './App.css';

import React from 'react'


function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
       <main className="main-content"> {/* Added class */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashing /></ProtectedRoute>
            } />
            <Route path="/home" element={
              <ProtectedRoute><HomePage /></ProtectedRoute>
            } />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;