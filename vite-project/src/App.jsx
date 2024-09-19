import React, { useState } from "react";
import AuthTabs from "./Authtab";
import Chat from "./Chat";
import "./styles.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <div className="app-container">
      <h1>Socket.io Chat Application</h1>
      {isAuthenticated ? (
        <div>
          <Chat />
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      ) : (
        <AuthTabs onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;
