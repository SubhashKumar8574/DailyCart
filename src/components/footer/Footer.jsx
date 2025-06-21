import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    const year = new Date().getFullYear();

    return (
        <footer className="text-gray-100 body-font bg-purple-800">
            <div className="container px-4 py-5 mx-auto flex flex-col sm:flex-row items-center justify-between">
                {/* Logo */}
                <div className="flex items-center mb-3 sm:mb-0">
                    <span
                        className="text-xl font-bold cursor-pointer hover:text-pink-400 transition"
                        onClick={() => {
                            navigate("/");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                    >
                        DailyCart
                    </span>
                </div>

                {/* Text */}
                <p className="text-sm text-center sm:text-left mt-2 sm:mt-0 flex flex-col sm:flex-row items-center gap-1">
                    <span>
                        Made with <span className="text-red-400">❤️</span> by{" "}
                        <span className="font-semibold text-pink-400">Subhash Kumar</span>
                    </span>
                    <span className="sm:ml-2">© {year} All rights reserved</span>
                </p>


                {/* Icons */}
                <div className="flex mt-3 sm:mt-0">
                    {/* Facebook */}
                    <a className="text-gray-100 cursor-pointer hover:text-[#1877F2] transition" onClick={() => navigate("/*")}>
                        <svg
                            fill="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                        >
                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                        </svg>
                    </a>

                    {/* Twitter */}
                    <a className="ml-3 text-gray-100 cursor-pointer hover:text-black transition" onClick={() => navigate("/*")}>
                        <svg
                            fill="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                        >
      <path d="M4.75 3h4.43l3.66 5.87L17.66 3h4.43l-6.88 8.89L22 21h-4.43l-4.24-6.29L8.75 21H4.32l7.02-9.16L4.75 3z" />
                        </svg>
                    </a>

                    {/* Instagram */}
                    <a className="ml-3 text-gray-100 cursor-pointer hover:text-[#E1306C] transition" onClick={() => navigate("/*")}>
                        <svg
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                        >
                            <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
                            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
                        </svg>
                    </a>

                    {/* LinkedIn */}
                    <a className="ml-3 text-gray-100 cursor-pointer hover:text-[#0077B5] transition" onClick={() => navigate("/*")}>
                        <svg
                            fill="currentColor"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={0}
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="none"
                                d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                            />
                            <circle cx={4} cy={4} r={2} stroke="none" />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
