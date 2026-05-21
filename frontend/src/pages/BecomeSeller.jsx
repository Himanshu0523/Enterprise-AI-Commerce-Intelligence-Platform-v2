import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerSeller } from "../services/sellerService";
import { updateUserSession } from "../services/authSlice";

export default function BecomeSeller() {
    const [businessName, setBusinessName] = useState("");
    const [bankAccountNumber, setBankAccountNumber] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    // If already a seller, redirect
    if (user && user.role === 'seller') {
        navigate("/dashboard");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        try {
            const response = await registerSeller({
                businessName,
                bankAccountNumber,
                ifscCode
            });
            
            if (response.data.success) {
                // Update local auth state with new role and seller details
                dispatch(updateUserSession(response.data.data));
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Seller registration failed", error);
            setErrorMsg(error.response?.data?.message || "Failed to register as a seller. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Become a Seller
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Join our marketplace and start selling your products to millions of customers.
                    </p>
                </div>

                <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
                    {errorMsg && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{errorMsg}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Business Name
                            </label>
                            <input
                                type="text"
                                required
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 sm:text-sm transition-colors"
                                placeholder="Enter your registered business name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Bank Account Number
                            </label>
                            <input
                                type="text"
                                required
                                value={bankAccountNumber}
                                onChange={(e) => setBankAccountNumber(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 sm:text-sm transition-colors"
                                placeholder="For your automated payouts"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                IFSC Code
                            </label>
                            <input
                                type="text"
                                required
                                value={ifscCode}
                                onChange={(e) => setIfscCode(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 sm:text-sm transition-colors"
                                placeholder="Bank IFSC Code"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all transform hover:-translate-y-0.5 ${
                                    isLoading ? 'opacity-75 cursor-not-allowed transform-none hover:bg-gray-900' : ''
                                }`}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "Complete Registration"
                                )}
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-8 text-center">
                         <p className="text-sm text-gray-500">
                            By registering, you agree to our <Link to="#" className="font-medium text-gray-900 hover:underline">Seller Terms & Conditions</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
