import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const baseUri = import.meta.env.VITE_BASE_URI;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${baseUri}/api/signup`, {
        name,
        email,
        password,
      });
      setMsg(response.data.msg);
      navigate("/login");
    } catch (error) {
      console.log(error);
      setMsg(error.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(true);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      {loading ? (
        <>
          <p className="flex flex-col border border-[#ccc] rounded-xl w-full max-w-md bg-white p-6 shadow-lg ">
            loading...
          </p>
        </>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col border border-[#ccc] rounded-xl w-full max-w-md bg-white p-6 shadow-lg"
        >
          <h2 className="font-semibold text-xl text-center mb-4">
            Please Signup
          </h2>

          <label htmlFor="name" className="font-semibold text-lg">
            Name
          </label>
          <input
            value={name}
            type="text"
            placeholder="Enter your name"
            className="border border-[#ccc] p-2 mt-1 mb-4 rounded-md"
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="email" className="font-semibold text-lg">
            Email
          </label>
          <input
            value={email}
            type="email"
            placeholder="Enter your email"
            className="border border-[#ccc] p-2 mt-1 mb-4 rounded-md"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password" className="font-semibold text-lg">
            Password
          </label>
          <input
            value={password}
            type="password"
            placeholder="Enter your password"
            className="border border-[#ccc] p-2 mt-1 mb-4 rounded-md"
            onChange={(e) => setPassword(e.target.value)}
          />

          {msg && (
            <p className="text-sm text-red-700 text-center mb-2">{msg}</p>
          )}

          <button
            type="submit"
            className="bg-green-600 text-white font-bold py-2 rounded-md hover:bg-green-700 transition"
          >
            Signup
          </button>

          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      )}
    </div>
  );
};

export default Signup;
