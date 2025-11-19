import { store } from "../store";

export const authService = {
  getToken: () => localStorage.getItem("access_token"),
  isAuthenticated: () => {
    // Check both localStorage and Redux state for consistency
    const hasToken = !!localStorage.getItem("access_token");
    const reduxState = store.getState().auth;
    return hasToken && reduxState.isAuthenticated;
  },
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // Redux state will be cleared by the component that calls logout
  },
};
