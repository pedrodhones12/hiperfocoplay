// =======================
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

// =======================
// LOGIN
// =======================
export const login = (email, password) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    user => user.email === email && user.password === password
  );

  if (user) {
    localStorage.setItem("token", "logado");
    localStorage.setItem("currentUser", JSON.stringify(user));
    return true;
  }

  return false;
};

// =======================
// LOGOUT
// =======================
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
};

// =======================
// VERIFICAR LOGIN
// =======================
export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

// =======================
// PEGAR USUÁRIO LOGADO
// =======================
export const getUser = () => {
  return JSON.parse(localStorage.getItem("currentUser"));
};
