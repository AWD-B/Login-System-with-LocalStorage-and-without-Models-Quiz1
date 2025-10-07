import contact from "../assets/images/contact.png"
const Contact = () => {
  return (
    <section className="w-full bg-gradient-to-r from-blue-50 to-blue-100 py-16 px-6">
      <div className="max-w-full mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left Section: Image */}
        <div className="flex justify-center">
          <img
            src={contact}
            alt="Contact Pet Care"
            className="rounded-2xl shadow-2xl w-full max-w-sm md:max-w-md object-cover"
          />
        </div>

        {/* Right Section: Text & Button */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 mb-8 text-base md:text-lg leading-relaxed">
            We’d love to hear from you! Whether it’s about grooming, training,
            or just some friendly advice — get in touch and let’s care for your
            furry friend together 🐾.
          </p>

          <a
            href="mailto:info@pupps.com"
            className="bg-blue-600 text-white text-lg px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
          >
            📧 info@pupps.com
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
