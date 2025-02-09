"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage({ text: "✅ Login Successful! Redirecting...", type: "success" });

      setTimeout(() => {
        router.push("/orders");
      }, 1000);
    } catch (error) {
      let errorMessage = "❌ Incorrect email or password.";
      if (error instanceof Error) {
        errorMessage = `❌ ${error.message}`;
      }
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 shadow-lg rounded-lg w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>

        {/* Display Message */}
        {message && (
          <p className={`mb-3 text-center ${message.type === "success" ? "text-green-500" : "text-red-500"}`}>
            {message.text}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600 transition duration-300"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
