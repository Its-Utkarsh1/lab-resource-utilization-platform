import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const OAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            toast.error("Google login failed.");
            navigate("/login");
            return;
        }

        const fetchCurrentUser = async () => {
            try {
                localStorage.setItem("jwtToken", token);

                const response = await axios.get(
                    "http://localhost:8080/api/auth/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const user = response.data;

                localStorage.setItem("user", JSON.stringify(user));

                toast.success("Login successful!");

                switch (user.role) {
                    case "SYSTEM_ADMIN":
                        navigate("/dashboard");
                        break;

                    case "INSTITUTION_ADMIN":
                        navigate("/dashboard");
                        break;

                    case "DEPARTMENT_HEAD":
                        navigate("/dashboard");
                        break;

                    case "LAB_MANAGER":
                        navigate("/dashboard");
                        break;

                    case "LAB_TECHNICIAN":
                        navigate("/dashboard");
                        break;

                    case "PROFESSOR":
                    case "ASSOCIATE_PROFESSOR":
                    case "ASSISTANT_PROFESSOR":
                    case "RESEARCHER":
                    case "RESEARCH_ASSOCIATE":
                    case "RESEARCH_SCIENTIST":
                    case "STUDENT":
                        navigate("/dashboard");
                        break;

                    default:
                        navigate("/");
                        break;
                }

            } catch (error) {
                console.error(error);

                localStorage.removeItem("jwtToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");

                toast.error("Unable to login with Google.");

                navigate("/login");
            }
        };

        fetchCurrentUser();

    }, [navigate, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="h-12 w-12 mx-auto border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>

                <h2 className="mt-4 text-xl font-semibold">
                    Signing you in...
                </h2>

                <p className="mt-2 text-gray-500">
                    Please wait while we complete your Google login.
                </p>
            </div>
        </div>
    );
};

export default OAuthSuccess;