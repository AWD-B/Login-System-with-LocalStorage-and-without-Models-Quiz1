import { useState } from "react";
import age from "../assets/images/age.png"
import checker from "../assets/images/checker.png"
import recipe from "../assets/images/recipe.png"
import chart from "../assets/images/chart.png"
import identifier  from "../assets/images/identifier.png"
import name from "../assets/images/name.png"
import guide from "../assets/images/guide.png"
import { ChevronLeft, ChevronRight } from "lucide-react";

const services = [
  {
    title: "🐾 Pet Age Calculator",
    desc: "Easily calculate your pet’s age in human years to better understand their life stage.",
    img: age,
  },
  {
    title: "⚖️ Pet Weight/BMI Checker",
    desc: "Check your pet’s ideal weight range and keep them healthy with BMI tracking.",
    img: checker,
  },
  {
    title: "📘 Downloadable Pet Care Guides",
    desc: "Access free, expert-written PDF guides about grooming, feeding, and training.",
    img: guide,
  },
  {
    title: "🍲 Pet Food Recipe Generator",
    desc: "Get personalized homemade food recipes based on your pet’s breed and age.",
    img: recipe,
  },
  {
    title: "📊 Printable Charts",
    desc: "Download feeding schedules, vaccination charts, and more to track your pet’s routine.",
    img: chart,
  },
  {
    title: "🐶 Pet Breed Identifier Tool",
    desc: "Upload a photo and identify your pet’s breed instantly using AI technology.",
    img: identifier,
  },
  {
    title: "🦴 Pet Name Generator",
    desc: "Find the perfect, creative name for your new furry friend in seconds.",
    img: name,
  },
];

const Services = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % services.length);
  const prev = () => setCurrent((prev) => (prev - 1 + services.length) % services.length);

  return (
      <section className="w-full bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="max-w-full mx-auto py-20 px-12 grid md:grid-cols-2 gap-10 items-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700 mb-8">
          Our Pet Care Services
        </h2>

        {/* Carousel Container */}
        <div className="relative w-full">
          <div
            className="flex flex-col md:flex-row items-center justify-center bg-white rounded-2xl 
            shadow-xl overflow-hidden transition-all duration-500 border border-blue-100"
          >
            {/* Image Section */}
            <div className="w-full md:w-1/2 h-56 sm:h-64 md:h-80 lg:h-96 flex-shrink-0 px-9">
              <img
                src={services[current].img}
                alt={services[current].title}
                className="w-full h-full object-contain "
                loading="lazy"
              />
            </div>

            {/* Text Section */}
            <div className="w-full md:w-1/2 p-5 sm:p-8 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-700 mb-4">
                {services[current].title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                {services[current].desc}
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prev}
            aria-label="Previous service"
            className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-0.5 bg-blue-600 hover:bg-blue-700 
            text-white text-lg sm:text-2xl p-2 sm:p-2 rounded-full shadow-md transition"
          >
            <ChevronLeft size={15}/>
          </button>
          <button
            onClick={next}
            aria-label="Next service"
            className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-1 bg-blue-600 hover:bg-blue-700 
            text-white text-lg sm:text-2xl p-2 sm:p-2 rounded-full shadow-md transition "
          >
            <ChevronRight size={15}/>
          </button>
        </div>

        {/* Navigation Dots */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {services.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border transition-all duration-300 ${
                current === i
                  ? "bg-blue-600 border-blue-700 scale-110"
                  : "bg-gray-300 hover:bg-blue-300 border-gray-400"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
