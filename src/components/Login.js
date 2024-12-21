import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css"; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      // Save user data in local storage
      console.log(data.username);
      localStorage.setItem(
        "user",
        JSON.stringify({ username: data.username, token: data.token })
      );

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
        navigate("/login");
      } else {
        setError("An unexpected error occurred. Please try again later.");
        navigate("/login");
      }
    }
  };

  return (
    <div className="container">
      <h2 class="Logintxt mb-3 fw-normal">Login </h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary pd-3 lp-5 mt-3 mb-3 rp-5"
        >
          Login
        </button>
      </form>
      {error && <p className="text-danger mt-5 pt-5 ">{error}</p>}{" "}
      <p>Don't have an account</p>
      <p>
        <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default Login;
