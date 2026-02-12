import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setTokens } from "../services/auth";
import api from "../services/api";

type Props = {
  setToken: (token: string) => void;
};

export default function Login({ setToken }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/login/", {
        username,
        password,
      });
      setTokens(res.data.access, res.data.refresh);
      setToken(res.data.access);
      navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
