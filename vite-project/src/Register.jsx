import React, { useState } from "react";
import axios from "axios";

const Register = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}`, {
        username,
        password,
      });
      if (response.status === 201) {
        setSuccessMessage("Registration successful. Please log in.");
        setError("");
        setUsername("");
        setPassword("");
        onRegisterSuccess();
      }
    } catch (err) {
      setError("Error registering user");
      setSuccessMessage("");
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button onClick={handleRegister}>Register</button>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
    </div>
  );
};

export default Register;
