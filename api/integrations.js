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
