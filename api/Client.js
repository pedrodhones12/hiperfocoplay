// CADASTRO
// =======================
export const register = (email, password) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const userExists = users.find(user => user.email === email);

  if (userExists) {
    return "Usuário já existe!";
  }

  const newUser = { email, password };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  return "Cadastro realizado!";
};
