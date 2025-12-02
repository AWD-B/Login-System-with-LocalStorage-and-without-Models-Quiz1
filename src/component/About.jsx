import React from 'react';
import './About.css';

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Lead Veterinarian",
      expertise: "Animal Nutrition & Wellness",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80"
    },
    {
      name: "Mike Chen",
      role: "Behavior Specialist",
      expertise: "Canine Training & Rehabilitation",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80"
    },
    {
      name: "Emma Rodriguez",
      role: "Pet Nutritionist",
      expertise: "Holistic Diet Planning",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80"
    }
  ];

  const milestones = [
    { year: "2018", event: "Founded with a vision for better pet care", icon: "🎯" },
    { year: "2019", event: "Expanded to full-service pet wellness", icon: "🌱" },
    { year: "2020", event: "Launched virtual consultations", icon: "💡" },
    { year: "2021", event: "Industry Excellence Award", icon: "🏆" },
    { year: "2022", event: "Veterinary school partnerships", icon: "🔬" },
    { year: "2023", event: "Multiple locations & community outreach", icon: "🚀" }
  ];

  const values = [
    { icon: "🎓", title: "Expert-Led", description: "Certified veterinarians and animal specialists" },
    { icon: "🌿", title: "Natural & Safe", description: "Rigorous 7-point quality testing" },
    { icon: "🤝", title: "Personalized", description: "Tailored solutions for every pet" },
    { icon: "💝", title: "Compassionate", description: "5% profits support local rescues" },
    { icon: "🔬", title: "Science-Backed", description: "Research-driven pet care approach" },
    { icon: "🏘️", title: "Community", description: "24/7 support and educational workshops" }
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">
              More Than a Pet Store – 
              <span className="hero-highlight"> A Pet Sanctuary</span>
            </h1>
            <p className="hero-subtitle">
              Where expertise meets compassion, and every pet becomes family
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-content">
              <div className="section-badge">Our Story</div>
              <h2 className="section-title">From Heartbreak to Hope</h2>
              <p className="mission-text">
                After losing our beloved Golden Retriever, Luna, to preventable health issues, 
                we realized the pet care industry lacked genuine expertise and transparency. 
                What started as a mission to prevent other families from experiencing similar heartbreak 
                has grown into a comprehensive pet wellness ecosystem.
              </p>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">15,000+</div>
                  <div className="stat-label">Pets Helped</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">47</div>
                  <div className="stat-label">Care Specialists</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">12</div>
                  <div className="stat-label">Rescue Partners</div>
                </div>
              </div>
            </div>
            <div className="mission-image">
              <img 
                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&q=80" 
                alt="Our pet care team" 
                className="floating-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="text-center mb-16">
            <div className="section-badge">Our Pillars</div>
            <h2 className="section-title">The Foundation of Trust</h2>
            <p className="section-subtitle">
              Six core principles that guide every decision we make
            </p>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <div className="text-center mb-16">
            <div className="section-badge">Our Journey</div>
            <h2 className="section-title">Milestones of Growth</h2>
          </div>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">{milestone.icon}</div>
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <div className="timeline-event">{milestone.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="text-center mb-16">
            <div className="section-badge">Meet Our Experts</div>
            <h2 className="section-title">The Minds Behind the Magic</h2>
            <p className="section-subtitle">
              Certified professionals dedicated to pet wellness
            </p>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image-container">
                  <img src={member.image} alt={member.name} className="team-image" />
                  <div className="team-overlay">
                    <div className="team-expertise">{member.expertise}</div>
                  </div>
                </div>
                <div className="team-info">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Experience the Difference?</h2>
            <p className="cta-text">
              Join thousands of pet parents who trust us with their furry family members
            </p>
            <div className="cta-buttons">
              <button className="btn-primary">Book a Consultation</button>
              <button className="btn-secondary">Meet Our Team</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;