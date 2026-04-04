export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");

  // opcional: redirecionar para login
  window.location.href = "/login";
};
