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

// Import all service components
import AgeCalculator from "./component/services/AgeCalculator";
import WeightChecker from "./component/services/WeightChecker";
import GuideDownloader from "./component/services/GuideDownloader";
import RecipeGenerator from "./component/services/RecipeGenerator";
import ChartGenerator from "./component/services/ChartGenerator";
import BreedIdentifier from "./component/services/BreedIdentifier";
import NameGenerator from "./component/services/NameGenerator";

import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Protected Routes - Require Login */}
            <Route path="/dashing" element={
              <ProtectedRoute>
                <Dashing />
              </ProtectedRoute>
            } />
            
            <Route path="/home" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            
            <Route path="/services" element={
              <ProtectedRoute>
                <ServicesPage />
              </ProtectedRoute>
            } />

            {/* Individual Service Routes - All Protected */}
            <Route path="/services/age-calculator" element={
              <ProtectedRoute>
                <AgeCalculator />
              </ProtectedRoute>
            } />
            
            <Route path="/services/weight-checker" element={
              <ProtectedRoute>
                <WeightChecker />
              </ProtectedRoute>
            } />
            
            <Route path="/services/care-guides" element={
              <ProtectedRoute>
                <GuideDownloader />
              </ProtectedRoute>
            } />
            
            <Route path="/services/recipe-generator" element={
              <ProtectedRoute>
                <RecipeGenerator />
              </ProtectedRoute>
            } />
            
            <Route path="/services/printable-charts" element={
              <ProtectedRoute>
                <ChartGenerator />
              </ProtectedRoute>
            } />
            
            <Route path="/services/breed-identifier" element={
              <ProtectedRoute>
                <BreedIdentifier />
              </ProtectedRoute>
            } />
            
            <Route path="/services/name-generator" element={
              <ProtectedRoute>
                <NameGenerator />
              </ProtectedRoute>
            } />

            {/* Default Route */}
            <Route path="/" element={<Login />} />
            
            {/* Catch-all route for 404 pages */}
            <Route path="*" element={
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>404 - Page Not Found</h2>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;