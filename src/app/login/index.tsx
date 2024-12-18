"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false); 
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError(""); 

    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (password === correctPassword) {
      localStorage.setItem("isAuthenticated", "true");
      router.push("/dashboard");
    } else {
      setError("Incorrect password. Please try again.");
    }
    setLoading(false); 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="p-5 bg-white rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-5 text-center">Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="w-full p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Eye size={16} className="text-gray-500" />
              ) : (
                <EyeOff size={16} className="text-gray-500" />
              )}
            </button>
          </div>
          {loading && <p className="text-blue-500 mb-3 text-sm">Signing in...</p>} 
          {error && <p className="text-red-500 mb-3 text-sm">{error}</p>} 
          <button
            type="submit"
            className={`w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
