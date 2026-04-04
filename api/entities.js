import axios from "axios";

export const login = async (email, password) => {
  try {
    const response = await axios.post("http://localhost:3000/login", {
      email,
      password
    });

    const data = response.data;

    // salva token e usuário
    localStorage.setItem("token", data.token);
    localStorage.setItem("currentUser", JSON.stringify(data.user));

    return true;

  } catch (error) {
    console.error("Erro no login:", error);
    return false;
  }
};
