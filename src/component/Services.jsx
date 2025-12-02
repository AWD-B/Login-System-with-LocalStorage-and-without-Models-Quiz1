// components/Services.jsx - MAIN SERVICES PAGE WITH AUTO-SCROLL
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Services.css";

// Import service images
import age from "../assets/images/age.png";
import checker from "../assets/images/checker.png";
import recipe from "../assets/images/recipe.png";
import chart from "../assets/images/chart.png";
import identifier from "../assets/images/identifier.png";
import name from "../assets/images/name.png";
import guide from "../assets/images/guide.png";

// Import icons
import { 
  ChevronLeft, 
  ChevronRight, 
  Calculator, 
  Scale, 
  Download, 
  ChefHat, 
  BarChart3, 
  Search,
  Heart
} from "lucide-react";

const services = [
  {
    id: "age-calculator",
    title: "🐾 Pet Age Calculator",
    desc: "Easily calculate your pet's age in human years to better understand their life stage.",
    img: age,
    icon: <Calculator size={24} />,
    color: "var(--age-color)",
    route: "/services/age-calculator"
  },
  {
    id: "weight-checker",
    title: "⚖️ Pet Weight/BMI Checker",
    desc: "Check your pet's ideal weight range and keep them healthy with BMI tracking.",
    img: checker,
    icon: <Scale size={24} />,
    color: "var(--weight-color)",
    route: "/services/weight-checker"
  },
  {
    id: "care-guides",
    title: "📘 Downloadable Pet Care Guides",
    desc: "Access free, expert-written PDF guides about grooming, feeding, and training.",
    img: guide,
    icon: <Download size={24} />,
    color: "var(--guide-color)",
    route: "/services/care-guides"
  },
  {
    id: "recipe-generator",
    title: "🍲 Pet Food Recipe Generator",
    desc: "Get personalized homemade food recipes based on your pet's breed and age.",
    img: recipe,
    icon: <ChefHat size={24} />,
    color: "var(--recipe-color)",
    route: "/services/recipe-generator"
  },
  {
    id: "printable-charts",
    title: "📊 Printable Charts",
    desc: "Download feeding schedules, vaccination charts, and more to track your pet's routine.",
    img: chart,
    icon: <BarChart3 size={24} />,
    color: "var(--chart-color)",
    route: "/services/printable-charts"
  },
  {
    id: "breed-identifier",
    title: "🐶 Pet Breed Identifier Tool",
    desc: "Upload a photo and identify your pet's breed instantly using AI technology.",
    img: identifier,
    icon: <Search size={24} />,
    color: "var(--breed-color)",
    route: "/services/breed-identifier"
  },
  {
    id: "name-generator",
    title: "🦴 Pet Name Generator",
    desc: "Find the perfect, creative name for your new furry friend in seconds.",
    img: name,
    icon: <Heart size={24} />,
    color: "var(--name-color)",
    route: "/services/name-generator"
  },
];

const Services = () => {
  const [current, setCurrent] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoScroll) return;

    const interval = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        next();
        setTimeout(() => setIsAnimating(false), 500);
      }
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [autoScroll, isAnimating]);

  // Navigation functions
  const next = () => {
    setIsAnimating(true);
    setCurrent((prev) => (prev + 1) % services.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prev = () => {
    setIsAnimating(true);
    setCurrent((prev) => (prev - 1 + services.length) % services.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (index === current) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleServiceClick = (service) => {
    navigate(service.route);
  };

  // Pause auto-scroll on hover
  const handleMouseEnter = () => setAutoScroll(false);
  const handleMouseLeave = () => setAutoScroll(true);

  return (
    <section 
      className="services-section"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated Background */}
      <div className="services-background">
        <div className="floating-paw">🐾</div>
        <div className="floating-paw">🐕</div>
        <div className="floating-paw">🐈</div>
        <div className="floating-paw">🐠</div>
      </div>

      <div className="services-container">
        {/* Header Section */}
        <div className="services-header">
          <h1 className="services-title">
            Our Pet Care Services
            <span className="title-underline"></span>
          </h1>
          <p className="services-subtitle">
            Discover amazing tools to keep your furry friends happy and healthy! 
            <span className="paw-emoji"> 🐾</span>
          </p>
        </div>

        {/* Main Carousel */}
        <div className="carousel-container" ref={carouselRef}>
          <div 
            className={`carousel-content ${isAnimating ? 'animating' : ''}`}
            style={{ '--service-color': services[current].color }}
          >
            {/* Image Section with Enhanced Styling */}
            <div className="carousel-image-section">
              <div className="image-frame">
                <img
                  src={services[current].img}
                  alt={services[current].title}
                  className="carousel-image"
                  loading="lazy"
                />
                <div className="image-overlay"></div>
                <div className="service-icon-badge">
                  {services[current].icon}
                </div>
              </div>
            </div>

            {/* Text Content Section */}
            <div className="carousel-text-section">
              <div className="text-content">
                <div className="service-indicator">
                  <span className="current-number">0{current + 1}</span>
                  <span className="total-number">/0{services.length}</span>
                </div>
                
                <h2 className="service-title">
                  {services[current].title}
                </h2>
                
                <p className="service-description">
                  {services[current].desc}
                </p>

                {/* Action Button */}
                <button 
                  className="service-action-btn"
                  onClick={() => handleServiceClick(services[current])}
                  style={{ backgroundColor: services[current].color }}
                >
                  Try This Tool
                  <span className="btn-arrow">→</span>
                </button>

                {/* Quick Stats */}
                <div className="service-stats">
                  <div className="stat">
                    <span className="stat-number">1000+</span>
                    <span className="stat-label">Happy Pets</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">99%</span>
                    <span className="stat-label">Accuracy</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">24/7</span>
                    <span className="stat-label">Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prev}
            aria-label="Previous service"
            className="nav-arrow nav-arrow-prev"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            aria-label="Next service"
            className="nav-arrow nav-arrow-next"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Enhanced Navigation Dots */}
        <div className="navigation-dots">
          {services.map((service, index) => (
            <button
              key={service.id}
              onClick={() => goToSlide(index)}
              className={`dot ${current === index ? 'active' : ''}`}
              aria-label={`Go to ${service.title}`}
              style={{ 
                backgroundColor: current === index ? service.color : 'var(--gray-300)'
              }}
            >
              <span className="dot-icon">
                {service.icon}
              </span>
              <span className="dot-label">{service.title.split(' ')[1]}</span>
            </button>
          ))}
        </div>

        {/* All Services Grid Preview */}
        <div className="services-grid-preview">
          <h3 className="preview-title">All Available Tools</h3>
          <div className="preview-grid">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`preview-card ${current === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                style={{ borderColor: service.color }}
              >
                <div 
                  className="preview-icon"
                  style={{ backgroundColor: service.color }}
                >
                  {service.icon}
                </div>
                <span className="preview-name">{service.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;