import home from "../assets/images/home.png"
const Home = () => {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 px-6 flex flex-col md:flex-row items-center justify-between">
      <div className="md:w-1/2 space-y-6 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 leading-tight">
          Your Pet’s <span className="text-blue-500">Best Friend</span>
        </h1>
        <p className="text-gray-700 text-lg">
          Grooming, training, and nutrition care — everything your pet needs to live happily and healthily.
        </p>
        <div className="flex gap-4 justify-center md:justify-start">
          <a href="/services" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Explore Services
          </a>
          <a href="/contact" className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-100 transition">
            Contact Us
          </a>
        </div>
      </div>

      <div className="md:w-1/2 pr-6 mt-10 md:mt-0 flex justify-center">
        <img
          src={home}
          alt="Happy Dog"
          className="rounded-2xl shadow-2xl w-full max-w-md object-cover"
        />
      </div>
    </section>
  );
};

export default Home;
