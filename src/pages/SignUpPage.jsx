import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SignUpPage() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const showErrorToast = (title, message) => {
    toast.custom((t) => (
      <div className="bg-red text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-full max-w-[400px] relative animate-in slide-in-from-right-5 font-poppins">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-white/90 text-sm">{message}</p>
        </div>
        <button type="button" onClick={() => toast.dismiss(t)} className="cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>
    ), { duration: 4000 });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please include an '@' in the email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, {
        email: formData.email.trim(),
        password: formData.password,
        username: formData.username.trim(),
        name: formData.name.trim(),
      });
      setIsSuccess(true);
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Registration failed. Please try again.";
      showErrorToast("Registration failed", message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate("/login");
  };

  // --- หน้า Registration Success ---
  if (isSuccess) {
    return (
      <div className="min-h-screen w-full bg-brown-100 flex items-center justify-center p-4 font-poppins">
        <div className="bg-brown-200 w-full max-w-[480px] p-12 rounded-[40px] flex flex-col items-center text-center shadow-sm animate-in fade-in zoom-in duration-300">
          <div className="w-24 h-24 bg-green rounded-full flex items-center justify-center mb-8 shadow-inner">
            <Check className="text-white w-12 h-12" />
          </div>

          <h2 className="text-brown-600 mb-10 text-3xl font-bold">
            Registration success
          </h2>

          <Button
            onClick={handleContinue}
            className="w-full max-w-[240px] h-[56px] bg-brown-600 hover:opacity-90 text-white rounded-full font-bold shadow-lg body-1 cursor-pointer active:scale-95 transition-all"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* --- Spinner Overlay --- */}
      {loading && (
        <div className="fixed inset-0 z-100 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
          <Spinner className="h-12 w-12 text-brown-600" />
          <p className="text-brown-600 font-bold font-poppins animate-pulse">
            Creating your account...
          </p>
        </div>
      )}

      <div className="min-h-[calc(100vh-80px)] w-full bg-brown-100 flex items-center justify-center p-4 font-poppins">
        <div className="bg-brown-200 w-full max-w-[480px] p-10 rounded-[40px] flex flex-col items-center shadow-sm border border-brown-300">
          <h2 className="text-brown-600 mb-10 text-5xl font-bold">Sign up</h2>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-5 text-left"
          >
            {/* Name */}
            <div className="flex flex-col gap-1.5 w-full">
              <Label className="body-2 text-brown-500 ml-1">Name</Label>
              <Input
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
                className={`h-[54px] bg-white border-none rounded-xl px-4 body-1 shadow-sm transition-all focus-visible:ring-1 ${
                  errors.name
                    ? "ring-1 ring-red"
                    : "focus-visible:ring-brown-300"
                }`}
              />
              {errors.name && (
                <span className="text-red body-3 ml-1">{errors.name}</span>
              )}
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5 w-full">
              <Label className="body-2 text-brown-500 ml-1">Username</Label>
              <Input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className={`h-[54px] bg-white border-none rounded-xl px-4 body-1 shadow-sm transition-all focus-visible:ring-1 ${
                  errors.username
                    ? "ring-1 ring-red"
                    : "focus-visible:ring-brown-300"
                }`}
              />
              {errors.username && (
                <span className="text-red body-3 ml-1">{errors.username}</span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5 w-full">
              <Label className="body-2 text-brown-500 ml-1">Email</Label>
              <Input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`h-[54px] bg-white border-none rounded-xl px-4 body-1 shadow-sm transition-all focus-visible:ring-1 ${
                  errors.email
                    ? "ring-1 ring-red"
                    : "focus-visible:ring-brown-300"
                }`}
              />
              {errors.email && (
                <span className="text-red body-3 ml-1">{errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5 w-full">
              <Label className="body-2 text-brown-500 ml-1">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`h-[54px] bg-white border-none rounded-xl px-4 pr-12 body-1 shadow-sm transition-all focus-visible:ring-1 ${
                    errors.password
                      ? "ring-1 ring-red"
                      : "focus-visible:ring-brown-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-red body-3 ml-1">{errors.password}</span>
              )}
            </div>

            <div className="flex justify-center mt-6">
              <Button
                type="submit"
                className="w-[180px] h-[56px] bg-brown-600 hover:bg-brown-500 text-white body-1 rounded-full font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                Sign up
              </Button>
            </div>
          </form>

          <div className="mt-12 body-2 text-brown-400 flex gap-2">
            Already have an account?
            <Link
              to="/login"
              className="text-brown-600 font-bold underline cursor-pointer"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUpPage;
