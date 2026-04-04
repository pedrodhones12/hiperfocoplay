import React, { useState } from "react";
import { login, register } from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (login(email, password)) {
      alert("Entrou!");
      window.location.href = "/Dashboard";
    } else {
      alert("Erro no login");
    }
  };

  const handleRegister = () => {
    register(email, password);
    alert("Cadastrado!");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Login / Cadastro</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Entrar</button>
      <button onClick={handleRegister}>Cadastrar</button>
    </div>
  );
}
