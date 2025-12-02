import React, { useState } from 'react';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock,
  FaVideo,
  FaUserMd,
  FaShieldAlt,
  FaArrowRight,
  FaWhatsapp,
  FaCalendarAlt,
  FaStethoscope,
  FaDog,
  FaCat,
  FaHeart
} from 'react-icons/fa';

const Contact = () => {
  const [activeForm, setActiveForm] = useState('general');
  const [isEmergency, setIsEmergency] = useState(false);

  const contactMethods = [
    {
      icon: <FaPhone className="text-red-500" />,
      title: "24/7 Emergency Line",
      description: "Life-threatening situations",
      contact: "(555) PET-HELP",
      response: "Instant",
      color: "red",
      type: "emergency"
    },
    {
      icon: <FaWhatsapp className="text-green-500" />,
      title: "Urgent Vet Chat",
      description: "Quick health questions",
      contact: "Chat Now",
      response: "2-5 minutes",
      color: "green",
      type: "chat"
    },
    {
      icon: <FaVideo className="text-blue-500" />,
      title: "Video Consultation",
      description: "Virtual vet appointments",
      contact: "Schedule Call",
      response: "Within 1 hour",
      color: "blue",
      type: "video"
    },
    {
      icon: <FaEnvelope className="text-purple-500" />,
      title: "Email Support",
      description: "General inquiries",
      contact: "info@pupps.com",
      response: "4-6 hours",
      color: "purple",
      type: "email"
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Emergency Veterinarian",
      status: "Available",
      statusColor: "bg-green-500",
      specialty: "Critical Care",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&q=80"
    },
    {
      name: "Dr. Mike Chen",
      role: "Behavior Specialist",
      status: "In Consultation",
      statusColor: "bg-yellow-500",
      specialty: "Training & Anxiety",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80"
    },
    {
      name: "Emma Rodriguez",
      role: "Nutrition Expert",
      status: "Available",
      statusColor: "bg-green-500",
      specialty: "Diet Planning",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80"
    }
  ];

  const handleEmergencyClick = () => {
    setIsEmergency(true);
    // Scroll to emergency section
    document.getElementById('emergency-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16"> {/* Added pt-16 for navbar spacing */}
      
      {/* === EMERGENCY ALERT BANNER - FIXED === */}
      <div className="bg-red-600 text-white py-3 px-4 sticky top-0 z-40"> {/* Changed to sticky and added z-40 */}
     
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="animate-pulse">
              <FaStethoscope className="text-xl" />
            </div>
            <span className="font-semibold text-lg">24/7 Emergency Vet Line:</span>
            <a href="tel:5557387435" className="text-white hover:text-yellow-200 text-lg font-bold">
              (555) PET-HELP
            </a>
          </div>
          <button 
            onClick={handleEmergencyClick}
            className="bg-white text-red-600 px-6 py-2 rounded-full font-bold hover:bg-yellow-100 transition-all duration-300 flex items-center gap-2"
          >
            <FaStethoscope />
            Emergency Help
          </button>
        </div>
      </div>

      {/* === HERO SECTION === */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                <FaShieldAlt />
                Your Pet's Safety is Our Priority
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                When Every 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Second </span>
                Counts for Your Pet
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Immediate expert care for emergencies, compassionate guidance for concerns, 
                and lifelong support for your furry family member's wellbeing.
              </p>

              {/* Quick Action Grid */}
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-600 rounded-lg group-hover:scale-110 transition-transform">
                      <FaStethoscope className="text-xl" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Emergency Care</div>
                      <div className="text-sm opacity-90">24/7 Available</div>
                    </div>
                  </div>
                </button>

                <button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-600 rounded-lg group-hover:scale-110 transition-transform">
                      <FaWhatsapp className="text-xl" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Urgent Chat</div>
                      <div className="text-sm opacity-90">Live Now</div>
                    </div>
                  </div>
                </button>

                <button className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                      <FaMapMarkerAlt className="text-xl" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Nearest Clinic</div>
                      <div className="text-sm opacity-90">Find Location</div>
                    </div>
                  </div>
                </button>

                <button className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                      <FaCalendarAlt className="text-xl" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Symptom Check</div>
                      <div className="text-sm opacity-90">Quick Assessment</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Right Content - Video/Image Placeholder */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
                <div className="aspect-video bg-black/20 rounded-2xl flex items-center justify-center">
                  {/* VIDEO PLACEHOLDER - Replace with actual video */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaVideo className="text-2xl" />
                    </div>
                    <p className="text-lg font-semibold">Meet Our Emergency Care Team</p>
                    <p className="text-sm opacity-80 mt-2">Video introduction to our 24/7 services</p>
                    {/* Actual video code would be:
                    <video autoPlay muted loop className="rounded-2xl">
                      <source src="/videos/emergency-care-team.mp4" type="video/mp4" />
                    </video>
                    */}
                  </div>
                </div>
                
                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">2.3min</div>
                    <div className="text-xs opacity-80">Avg Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">15K+</div>
                    <div className="text-xs opacity-80">Pets Helped</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-xs opacity-80">Availability</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === CONTACT METHODS GRID === */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Contact Method</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Multiple ways to connect with our expert team based on your needs and urgency
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br from-${method.color}-50 to-white border-2 border-${method.color}-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 bg-${method.color}-100 rounded-xl group-hover:scale-110 transition-transform`}>
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{method.title}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">{method.contact}</span>
                    <span className={`text-xs px-2 py-1 bg-${method.color}-100 text-${method.color}-800 rounded-full`}>
                      {method.response}
                    </span>
                  </div>
                  
                  <button className={`w-full bg-${method.color}-500 hover:bg-${method.color}-600 text-white py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3`}>
                    Connect
                    <FaArrowRight className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === EMERGENCY SECTION === */}
      <section id="emergency-section" className="py-16 px-4 bg-red-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStethoscope className="text-2xl text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Emergency Care Protocol</h2>
              <p className="text-gray-600">Immediate assistance for critical situations</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">🚨 Critical Symptoms</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Difficulty breathing or choking
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Unconsciousness or collapse
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Severe bleeding or trauma
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Seizures that won't stop
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">🆘 Immediate Actions</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Call (555) PET-HELP immediately
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Keep your pet calm and still
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Have medical history ready
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Prepare for transport if needed
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center">
              <a 
                href="tel:5557387435" 
                className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white text-lg font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <FaPhone className="text-xl" />
                Call Emergency Line: (555) PET-HELP
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* === EXPERT AVAILABILITY === */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Expert Availability</span>
            </h2>
            <p className="text-xl text-gray-600">Real-time status of our care team</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 ${member.statusColor} rounded-full`}></div>
                      <span className="text-xs text-gray-500">{member.status}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Specialty: {member.specialty}</div>
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors duration-300">
                    Schedule Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === CONTACT FORM === */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-600">We'll get back to you within hours</p>
            </div>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pet Type</label>
                <div className="flex gap-4">
                  {['Dog', 'Cat', 'Bird', 'Other'].map((pet) => (
                    <label key={pet} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="petType" className="text-blue-600" />
                      <span className="text-gray-700">{pet}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea 
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Tell us about your pet's needs..."
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <FaHeart />
                Send Message
                <FaArrowRight />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;