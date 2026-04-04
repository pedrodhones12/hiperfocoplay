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
