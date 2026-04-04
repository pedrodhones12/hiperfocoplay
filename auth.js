export const register = (email, password) => {
  const user = { email, password };
  localStorage.setItem("user", JSON.stringify(user));
};

export const login = (email, password) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.email === email && user.password === password) {
    localStorage.setItem("token", "logado");
    return true;
  }

  return false;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};
