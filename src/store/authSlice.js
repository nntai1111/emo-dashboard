import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isFirstMount: true,
  aliasStatus: null,
  isCheckingAlias: false,
  isOwner: false,
  onboardingStatus: {
    aliasIssued: null,
    piiCompleted: null,
    patientProfileCompleted: null,
  },
  onboardingCheckCompleted: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      state.isFirstMount = true; // Reset isFirstMount khi đăng nhập
      state.aliasStatus = null; // Reset alias status
      state.isCheckingAlias = false;
      state.onboardingStatus = {
        aliasIssued: null,
        piiCompleted: null,
        patientProfileCompleted: null,
      };
      state.onboardingCheckCompleted = false; // Reset để check lại sau login
      // Decode token để lấy SubscriptionPlanName
      let isOwner = false;
      try {
        const decoded = jwtDecode(action.payload.token);
        isOwner = decoded?.SubscriptionPlanName && decoded.SubscriptionPlanName !== 'Free Plan';
      } catch (e) {
        isOwner = false;
      }
      state.isOwner = isOwner;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
      state.isFirstMount = true; // Reset isFirstMount khi đăng nhập thất bại
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      state.isFirstMount = true; // Reset isFirstMount khi đăng xuất
      state.aliasStatus = null;
      state.isCheckingAlias = false;
      state.onboardingStatus = {
        aliasIssued: null,
        piiCompleted: null,
        patientProfileCompleted: null,
      };
      state.onboardingCheckCompleted = false;
      // Xóa sạch toàn bộ localStorage khi logout
      localStorage.clear();
      // Note: free_trial_invitation_dismissed will also be cleared with localStorage.clear()
    },
    clearError: (state) => {
      state.error = null;
    },
    setFirstMountFalse: (state) => {
      state.isFirstMount = false; // Đặt isFirstMount thành false sau lần mount đầu
    },
    setAliasStatus: (state, action) => {
      state.aliasStatus = action.payload; // true = có alias, false = cần chọn alias
    },
    setCheckingAlias: (state, action) => {
      state.isCheckingAlias = action.payload;
    },
    updateToken: (state, action) => {
      state.token = action.payload.token;
    },
    setIsOwner: (state, action) => {
      state.isOwner = !!action.payload;
    },
    setOnboardingStatus: (state, action) => {
      state.onboardingStatus = action.payload;
    },
    setOnboardingCheckCompleted: (state, action) => {
      state.onboardingCheckCompleted = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  setFirstMountFalse,
  setAliasStatus,
  setCheckingAlias,
  updateToken,
  setIsOwner,
  setOnboardingStatus,
  setOnboardingCheckCompleted,
} = authSlice.actions;

export const selectIsOwner = (state) => state.auth.isOwner;

export default authSlice.reducer;
