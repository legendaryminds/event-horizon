import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import { AuthContext } from "../context/AuthProvider";

const Auth = () => {
  const { signup, login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isMember, setIsMember] = useState(true);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isMember) {
      await login(credentials);
    } else {
      await signup(credentials);
    }
    navigate("/home"); // Navigate to the home page after login or signup
  };

  return (
    <div>
      <h1>{isMember ? "Login" : "Signup"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button type="submit">{isMember ? "Login" : "Signup"}</button>
      </form>
      <button onClick={() => setIsMember((prev) => !prev)}>
        {isMember ? "Create an account" : "Already have an account?"}
      </button>
    </div>
  );
};

export default Auth;
