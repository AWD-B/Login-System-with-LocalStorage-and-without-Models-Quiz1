import React, { useState, useEffect } from 'react';
import './Home.css';

// You'll need: npm install react-icons
import { 
  FaPaw, 
  FaShieldAlt, 
  FaTruck, 
  FaStar, 
  FaPlay,
  FaArrowRight,
  FaHeart,
  FaUserMd,
  FaClock,
  FaMapMarkerAlt
} from 'react-icons/fa';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [stats, setStats] = useState({ pets: 0, experts: 0, families: 0 });

  useEffect(() => {
    // Animate stats counting
    const animateStats = () => {
      setStats({ pets: 15342, experts: 47, families: 8921 });
    };
    animateStats();
  }, []);

  const categories = [
    { icon: "🐕", name: "Dog Essentials", count: "243 products" },
    { icon: "🐱", name: "Cat Luxury", count: "187 products" },
    { icon: "🐦", name: "Small Pets", count: "92 products" },
    { icon: "🌿", name: "Natural Care", count: "156 products" }
  ];

  const services = [
    { 
      icon: <FaUserMd />, 
      title: "Vet Video Consultations", 
      desc: "24/7 access to certified veterinarians",
      color: "#3B82F6"
    },
    { 
      icon: <FaTruck />, 
      title: "Emergency Delivery", 
      desc: "Critical supplies in 30 minutes",
      color: "#10B981"
    },
    { 
      icon: <FaShieldAlt />, 
      title: "Health Guarantee", 
      desc: "100% satisfaction or your money back",
      color: "#F59E0B"
    },
    { 
      icon: <FaHeart />, 
      title: "Personalized Plans", 
      desc: "Custom care for your pet's needs",
      color: "#EF4444"
    }
  ];

  const testimonials = [
    { 
      name: "Sarah & Luna", 
      text: "Luna's allergies disappeared with their personalized nutrition plan!",
      pet: "Golden Retriever, 3 years",
      rating: 5
    },
    { 
      name: "Mike & Whiskers", 
      text: "The 24/7 vet chat saved us during midnight emergency!",
      pet: "Persian Cat, 5 years",
      rating: 5
    }
  ];

  return (
    <div className="home-container">
      
      {/* === HERO SECTION WITH VIDEO BACKGROUND === */}
      <section className="hero-section">
        <div className="video-background">
          {/* VIDEO PLACEHOLDER - Replace with actual video */}
          <div className="video-placeholder">
            <div className="play-button">
              <FaPlay />
            </div>
            <p>Happy Pets Video Background</p>
            {/* Actual video code would be:
            <video autoPlay muted loop playsInline>
              <source src="/videos/hero-pets.mp4" type="video/mp4" />
            </video>
            */}
          </div>
        </div>
        
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="trust-badge">
              <FaShieldAlt className="badge-icon" />
              <span>Veterinarian Approved</span>
            </div>
            
            <h1 className="hero-title">
              Where <span className="text-gradient">Tails Wag</span> 
              <br />& <span className="text-gradient">Purrs Happen</span>
            </h1>
            
            <p className="hero-subtitle">
              Veterinarian-Curated Care for Your Furry Family Members
            </p>

            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">{stats.pets.toLocaleString()}+</div>
                <div className="stat-label">Happy Pets</div>
              </div>
              <div className="stat">
                <div className="stat-number">{stats.experts}+</div>
                <div className="stat-label">Care Experts</div>
              </div>
              <div className="stat">
                <div className="stat-number">{stats.families.toLocaleString()}+</div>
                <div className="stat-label">Trusting Families</div>
              </div>
            </div>

            <div className="hero-actions">
              <button className="btn-primary">
                <FaPaw className="btn-icon" />
                Find Your Pet's Solution
                <FaArrowRight className="btn-icon" />
              </button>
              <button className="btn-secondary">
                <FaUserMd className="btn-icon" />
                Free Pet Consultation
              </button>
            </div>

            <div className="emergency-banner">
              <FaClock className="emergency-icon" />
              <span>24/7 Emergency Vet Chat Available Now</span>
            </div>
          </div>
        </div>
      </section>

      {/* === TRUST & URGENCY BAR === */}
      <section className="trust-bar">
        <div className="trust-item">
          <FaTruck className="trust-icon" />
          <span>Free Delivery Over $49</span>
        </div>
        <div className="trust-item">
          <FaShieldAlt className="trust-icon" />
          <span>100% Satisfaction Guarantee</span>
        </div>
        <div className="trust-item">
          <FaStar className="trust-icon" />
          <span>Rated #1 Pet Store 2024</span>
        </div>
        <div className="trust-item">
          <FaMapMarkerAlt className="trust-icon" />
          <span>Local Stores Nationwide</span>
        </div>
      </section>

      {/* === PROBLEM-SOLUTION MATRIX === */}
      <section className="problem-solution-section">
        <div className="container">
          <div className="section-header">
            <h2>We Understand Your <span className="text-gradient">Pet Parenting Journey</span></h2>
            <p>Common challenges, expert solutions</p>
          </div>
          
          <div className="solution-grid">
            <div className="problem-card">
              <div className="problem-icon">🍽️</div>
              <h3>Picky Eaters</h3>
              <p>Your pet turns away from food</p>
              <div className="solution-arrow">→</div>
              <div className="solution-card">
                <h4>Personalized Nutrition Plans</h4>
                <p>Tailored meals based on breed, age, and preferences</p>
              </div>
            </div>
            
            <div className="problem-card">
              <div className="problem-icon">🏥</div>
              <h3>Health Concerns</h3>
              <p>Worried about allergies or weight</p>
              <div className="solution-arrow">→</div>
              <div className="solution-card">
                <h4>Vet-Curated Products</h4>
                <p>Science-backed solutions for optimal health</p>
              </div>
            </div>
            
            <div className="problem-card">
              <div className="problem-icon">🎯</div>
              <h3>Behavior Issues</h3>
              <p>Training challenges and anxiety</p>
              <div className="solution-arrow">→</div>
              <div className="solution-card">
                <h4>Expert Training Tools</h4>
                <p>Positive reinforcement techniques</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === SERVICE ECOSYSTEM === */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Your Complete <span className="text-gradient">Pet Care Ecosystem</span></h2>
          </div>
          
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card" style={{ '--service-color': service.color }}>
                <div className="service-icon" style={{ color: service.color }}>
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <button className="service-btn">Learn More</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === PRODUCT CATEGORIES === */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Shop <span className="text-gradient">Curated Collections</span></h2>
          </div>
          
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div 
                key={index}
                className={`category-card ${activeCategory === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveCategory(index)}
              >
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.count}</p>
                <div className="category-overlay">
                  <button className="category-btn">Explore</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === INTERACTIVE PROFILER CTA === */}
      <section className="profilier-section">
        <div className="container">
          <div className="profilier-card">
            <div className="profilier-content">
              <h2>Find Your Pet's Perfect Match in 60 Seconds</h2>
              <p>Take our quick quiz and get personalized product recommendations</p>
              <button className="quiz-btn">
                Start Pet Quiz
                <FaArrowRight className="btn-icon" />
              </button>
            </div>
            <div className="profilier-visual">
              <div className="floating-pets">
                <span>🐕</span>
                <span>🐱</span>
                <span>🐦</span>
                <span>🐰</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === TESTIMONIALS === */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Trusted by <span className="text-gradient">Pet Parents</span></h2>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="star-icon" />
                  ))}
                </div>
                <p>"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.pet}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === FINAL CTA === */}
      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Pet's Life?</h2>
            <p>Join thousands of happy pets and their families today</p>
            <div className="cta-buttons">
              <button className="btn-primary large">
                Get Started Now
              </button>
              <button className="btn-secondary large">
                Speak With Expert
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;