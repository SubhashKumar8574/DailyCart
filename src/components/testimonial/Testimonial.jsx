const Testimonial = () => {
    return (
        <div>
            <section className="text-gray-600 body-font mb-10">
                <div className="container px-5 py-10 mx-auto">
                    <h1 className="text-center text-3xl font-bold text-black">Testimonial</h1>
                    <h2 className="text-center text-2xl font-semibold mb-10">
                        What our <span className="text-purple-600">customers</span> are saying
                    </h2>

                    <div className="flex flex-wrap -m-4">

                        {/* Testimonial 1 */}
                        <div className="lg:w-1/3 lg:mb-0 mb-6 p-4">
                            <div className="h-full text-center">
                                <div className="inline-block rounded-full p-1 transition-all duration-300 hover:shadow-[0_0_18px_5px_rgba(168,85,247,0.5)]">
                                    <img
                                        alt="testimonial"
                                        className="w-20 h-20 object-cover object-center rounded-full border-2 border-gray-200 bg-gray-100 cursor-pointer"
                                        src="https://cdn0.iconfinder.com/data/icons/avatars-3/512/avatar_bussiness_man-512.png"
                                    />
                                </div>
                                <p className="leading-relaxed mt-6">
                                    "As a software engineer, I don’t have time to browse stores — DailyCart makes it effortless to stay stylish with fast delivery and trendy fashion options!"
                                </p>
                                <span className="inline-block h-1 w-10 rounded bg-purple-600 mt-6 mb-4" />
                                <h2 className="text-gray-900 font-medium title-font tracking-wider text-sm uppercase">Subhash Kumar</h2>
                                <p className="text-gray-500">Software Engineer</p>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="lg:w-1/3 lg:mb-0 mb-6 p-4">
                            <div className="h-full text-center">
                                <div className="inline-block rounded-full p-1 transition-all duration-300 hover:shadow-[0_0_18px_5px_rgba(168,85,247,0.5)]">
                                    <img
                                        alt="testimonial"
                                        className="w-20 h-20 object-cover object-center rounded-full border-2 border-gray-200 bg-gray-100 cursor-pointer"
                                        src="https://cdn.iconscout.com/icon/premium/png-256-thumb/man-face-48129.png?f=webp"
                                    />
                                </div>
                                <p className="leading-relaxed mt-6">
                                    "I love shopping on DailyCart for my whole family — great deals, fast delivery, and products I can trust every time!"
                                </p>
                                <span className="inline-block h-1 w-10 rounded bg-purple-600 mt-6 mb-4" />
                                <h2 className="text-gray-900 font-medium title-font tracking-wider text-sm uppercase">Anil Verma</h2>
                                <p className="text-gray-500">Family Man</p>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="lg:w-1/3 lg:mb-0 p-4">
                            <div className="h-full text-center">
                                <div className="inline-block rounded-full p-1 transition-all duration-300 hover:shadow-[0_0_18px_5px_rgba(168,85,247,0.5)]">
                                    <img
                                        alt="testimonial"
                                        className="w-20 h-20 object-cover object-center rounded-full border-2 border-gray-200 bg-gray-100 cursor-pointer"
                                        src="https://img.freepik.com/premium-vector/girl-student-female-icon_24877-40504.jpg"
                                    />
                                </div>
                                <p className="leading-relaxed mt-6">
                                    ""As a student on a budget, DailyCart makes online shopping fun and affordable. Plus, their support is top-notch!""
                                </p>
                                <span className="inline-block h-1 w-10 rounded bg-purple-600 mt-6 mb-4" />
                                <h2 className="text-gray-900 font-medium title-font tracking-wider text-sm uppercase">Cora Jade</h2>
                                <p className="text-gray-500">College Student</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default Testimonial;
