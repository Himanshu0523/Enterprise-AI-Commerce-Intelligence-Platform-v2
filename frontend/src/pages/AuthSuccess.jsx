import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function AuthSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = searchParams.get("token");
        const userStr = searchParams.get("user");

        if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));
                
                // Save to localStorage
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

                // Dispatch a manual action to update Redux state
                // We're simulating a successful login here
                dispatch({ 
                    type: 'auth/loginUser/fulfilled', 
                    payload: { token, user } 
                });

                // Navigate to dashboard
                navigate("/dashboard");
            } catch (error) {
                console.error("Failed to parse user data from URL", error);
                navigate("/login?error=invalid_data");
            }
        } else {
            navigate("/login?error=missing_credentials");
        }
    }, [searchParams, navigate, dispatch]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900">Completing login...</h2>
            <p className="text-gray-500">Please wait while we securely log you in.</p>
        </div>
    );
}
