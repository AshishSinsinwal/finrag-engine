import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, Layers, AlertCircle, Loader2 } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-app-surface border border-app-border rounded-2xl p-8 sm:p-10 shadow-premium relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-app-text rounded-xl flex items-center justify-center shadow-md mb-4">
            <Layers className="w-6 h-6 text-app-surface" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold text-app-text tracking-tight">
            Create Account
          </h1>
          <p className="text-sm text-app-text-secondary mt-1 font-medium text-center">
            Set up your FinWise Intelligence workspace
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-app-text-secondary ml-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-app-border bg-app-bg text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent/50 focus:border-app-accent transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-app-text-secondary ml-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-app-border bg-app-bg text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent/50 focus:border-app-accent transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-app-text-secondary ml-1">
              Secure Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-app-border bg-app-bg text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent/50 focus:border-app-accent transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-app-text text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Setting up workspace...
              </>
            ) : (
              "Complete Registration"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-app-text-secondary border-t border-app-border pt-6">
          Already have an account?
          <Link to="/login" className="ml-1.5 text-app-accent hover:text-blue-700 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}