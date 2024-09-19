import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";

const AuthTabs = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="auth-tabs">
      <button
        onClick={() => setActiveTab("login")}
        className={activeTab === "login" ? "active" : ""}
      >
        Login
      </button>
      <button
        onClick={() => setActiveTab("register")}
        className={activeTab === "register" ? "active" : ""}
      >
        Register
      </button>
      {activeTab === "login" ? (
        <Login onLoginSuccess={onLoginSuccess} />
      ) : (
        <Register onRegisterSuccess={() => setActiveTab("login")} />
      )}
    </div>
  );
};

export default AuthTabs;
