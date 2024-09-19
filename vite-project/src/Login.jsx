import React, { useState } from "react";
import axios from "axios";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}`, {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setError("");
      onLoginSuccess();
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;
