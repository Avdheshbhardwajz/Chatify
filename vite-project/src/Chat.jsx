import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Initialize socket.io client with token
    const socketIo = io(`${import.meta.env.VITE_API_URL}`, {
      query: { token }, // Send token in connection query
      transports: ["websocket"], // Prefer websocket transport
    });

    socketIo.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    setSocket(socketIo);

    return () => socketIo.disconnect();
  }, [token]);

  const handleSendMessage = () => {
    if (socket && message) {
      socket.emit("message", message);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat</h2>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage}>Send</button>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
