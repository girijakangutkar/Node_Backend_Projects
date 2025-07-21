import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { setAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const baseUri = import.meta.env.VITE_BASE_URI;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUri}/api/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data.token;
      localStorage.setItem("authToken", token);
      setAuthenticated(true);
      navigate("/");
      setMsg(response.data.msg);
    } catch (error) {
      console.log(error);
      setMsg(error.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
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
          onSubmit={handleLogin}
          className="flex flex-col border border-[#ccc] rounded-xl w-full max-w-md bg-white p-6 shadow-lg"
        >
          <h2 className="font-semibold text-xl text-center mb-4">
            Please Login
          </h2>

          <label htmlFor="email" className="font-semibold text-lg">
            Email
          </label>
          <input
            value={email}
            type="email"
            placeholder="Enter your email"
            className="border border-[#ccc]  p-2 mt-1 mb-4 rounded-md"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password" className="font-semibold text-lg">
            Password
          </label>
          <input
            value={password}
            type="password"
            placeholder="Enter your password"
            className="border border-[#ccc]  p-2 mt-1 mb-4 rounded-md"
            onChange={(e) => setPassword(e.target.value)}
          />

          {msg && (
            <p className="text-sm text-red-700 text-center mb-2">{msg}</p>
          )}

          <button
            type="submit"
            className="bg-green-600 text-white font-bold py-2 rounded-md hover:bg-green-700 transition"
          >
            Login
          </button>

          <p className="text-center mt-4 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up here
            </Link>
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;
