
"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("✅ Login Successful! Redirecting...");
      setTimeout(() => router.push("/orders"), 500); // Redirect after 1.5 seconds
    } catch (error) {
      setMessage("❌ Incorrect email or password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        
        {/* Display Login Message */}
        {message && <p className="mb-3 text-center text-red-500">{message}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          Login
        </button>
      </form>
    </div>
  );
};

export default SignIn;
