const Track = () => {
  return (
    <section>
      <div className="container mx-auto px-5 py-10 md:py-14">
        <div className="flex flex-wrap -m-4 text-center">

          {/* Track 1: Fashion */}
          <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
            <div className="group h-64 flex flex-col justify-center items-center border-2 border-gray-200 bg-gray-100 shadow-[inset_0_0_2px_rgba(0,0,0,0.6)] px-4 py-6 rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-purple-300">
              <div className="rounded-full p-3  transition-all duration-300 group-hover:shadow-[0_0_18px_5px_rgba(168,85,247,0.5)] mb-5">
                <img
                  src="https://cdn-icons-png.flaticon.com/256/4359/4359963.png"
                  alt="fashion"
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
                />
              </div>
              <h2 className="title-font font-medium text-lg text-gray-900">Fashion</h2>
              <p className="leading-relaxed text-sm text-center">Stay trendy with our premium fashion collection.</p>
            </div>
          </div>

          {/* Track 2: Mobile */}
          <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
            <div className="group h-64 flex flex-col justify-center items-center border-2 border-gray-200 bg-gray-100 shadow-[inset_0_0_2px_rgba(0,0,0,0.6)] px-4 py-6 rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-purple-300">
              <div className="rounded-full p-3  transition-all duration-300 group-hover:shadow-[0_0_18px_5px_rgba(168,85,247,0.5)] mb-5">
                <img
                  src="https://cdn-icons-png.flaticon.com/256/7648/7648246.png"
                  alt="mobile"
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
                />
              </div>
              <h2 className="title-font font-medium text-lg text-gray-900">Mobiles</h2>
              <p className="leading-relaxed text-sm text-center">Explore the latest smartphones with unbeatable deals.</p>
            </div>
          </div>

          {/* Track 3: Books */}
          <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
            <div className="group h-64 flex flex-col justify-center items-center border-2 border-gray-200 bg-gray-100 shadow-[inset_0_0_2px_rgba(0,0,0,0.6)] px-4 py-6 rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-purple-300">
              <div className="rounded-full p-3  transition-all duration-300 group-hover:shadow-[0_0_18px_5px_rgba(168,85,247,0.5)] mb-5">
                <img
                  src="https://cdn-icons-png.flaticon.com/256/11946/11946316.png"
                  alt="books"
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
                />
              </div>
              <h2 className="title-font font-medium text-lg text-gray-900">Books</h2>
              <p className="leading-relaxed text-sm text-center">Feed your mind with a wide range of exciting books.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Track;
