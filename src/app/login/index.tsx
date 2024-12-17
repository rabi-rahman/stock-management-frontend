"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (password === correctPassword) {
      // Store authentication status in localStorage
      localStorage.setItem("isAuthenticated", "true");
      router.push("/dashboard"); // Navigate to the dashboard
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="p-5 bg-white rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-5 text-center">Admin Login</h1>
        <input
          type="password"
          placeholder="Enter Password"
          className="w-full p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
        <button
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}