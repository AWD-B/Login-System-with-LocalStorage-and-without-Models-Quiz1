const About = () => {
  return (
    <section className="w-full bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="max-w-full mx-auto py-20 px-12 grid md:grid-cols-2 gap-10 items-center">
        <img
          src="https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=900&q=80"
          alt="Pet Care"
          className="rounded-2xl shadow-2xl w-full object-cover"
        />
        <div>
          <h2 className="text-3xl font-bold text-blue-700 mb-4">About Us</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            At Pupp’s Pet Care, we treat every pet like family. Our experienced staff ensures top-notch grooming, training, and care for all furry friends.
            We aim to build long-lasting relationships with pets and their owners by offering love, expertise, and compassion.
          </p>
          <p className="text-gray-600">
            We believe that every pet deserves personalized attention, a healthy lifestyle, and endless affection. From regular check-ups to playful activities, we create a safe and joyful environment where pets can thrive.
            Our mission is to make every tail wag with happiness and every owner feel confident that their beloved companion is in the best hands possible.
          </p>
        </div>
      </div>
    </section>
  );
};
export default About;
