import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../services/authSlice";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");
        try {
            const result = await dispatch(registerUser({ name, email, password }));
            if (result.type === 'auth/registerUser/fulfilled') {
                console.log("Registration successful");
                navigate("/dashboard");
            } else {
                console.error("Registration failed", result.payload);
                setErrorMsg(result.payload?.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            console.error("Registration failed", err);
            setErrorMsg("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-row-reverse">
            {/* Right Image Section */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Premium fashion style"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-16 right-12 left-12 z-20 text-right">
                    <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">Discover Your<br />Signature Style</h2>
                    <p className="text-lg text-white/90 max-w-lg ml-auto">Sign up today and get 15% off your first order plus free shipping on all items.</p>
                </div>
                {/* Logo top right */}
                <Link to="/" className="absolute top-5 right-12 z-20 flex items-center space-x-2">
                    <span className="text-2xl font-bold text-white tracking-wide">HexaShop</span>
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-gray-900 font-bold text-xl">H</span>
                    </div>
                </Link>
            </div>

            {/* Left Form Section */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 xl:px-24 bg-white">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="lg:hidden flex items-center space-x-2 mb-12">
                        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">H</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900 tracking-wide">HexaShop</span>
                    </div>

                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Create an account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-gray-900 hover:text-blue-600 transition underline decoration-2 decoration-gray-300 underline-offset-2">
                                Sign in here
                            </Link>
                        </p>
                    </div>

                    {errorMsg && (
                        <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{errorMsg}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full name</label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm transition"
                                        placeholder="Your Good Name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email address</label>
                                <div className="mt-1">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm transition"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="mt-1">
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm transition"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition transform hover:-translate-y-0.5 ${isLoading ? 'opacity-75 cursor-not-allowed transform-none hover:bg-gray-900' : ''}`}
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        "Sign up"
                                    )}
                                </button>
                            </div>

                            <div className="mt-8">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>

                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        onClick={() => {
                                            window.location.href =
                                                "http://localhost:5000/api/auth/google";
                                        }}
                                        className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M12.0003 11.9998V15.5398H17.8173C17.5683 17.2288 16.5163 18.6798 15.0623 19.6418L15.0453 19.6548V21.6038H18.5303L18.7713 21.5798C20.9413 19.5788 22.2143 16.5148 22.2143 12.9998C22.2143 12.2858 22.1463 11.6028 22.0233 10.9548H12.0003V11.9998Z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M11.9999 22.4998C14.8699 22.4998 17.2799 21.5498 18.9959 19.9498L15.4859 17.9898C14.5599 18.6098 13.3799 18.9998 11.9999 18.9998C9.3339 18.9998 7.0719 17.1898 6.2239 14.7498H2.7639V16.7498C4.5439 20.3798 8.0449 22.4998 11.9999 22.4998Z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M6.2245 14.7502C6.0105 14.1002 5.8885 13.4112 5.8885 12.7002C5.8885 11.9892 6.0105 11.3002 6.2245 10.6502V8.6502H2.7645C2.0745 10.0302 1.6665 11.5602 1.6665 13.2002C1.6665 14.8402 2.0745 16.3702 2.7645 17.7502L6.2245 14.7502Z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12.0004 6.3998C13.5604 6.3998 14.9604 6.9398 16.0604 7.9998L18.6604 5.3998C16.9404 3.7998 14.8704 2.8998 12.0004 2.8998C8.0454 2.8998 4.5444 5.0198 2.7644 8.6498L6.2244 10.6498C7.0724 8.2098 9.3344 6.3998 12.0004 6.3998Z"
                                                fill="#EA4335"
                                            />
                                        </svg>

                                        Continue with Google
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
