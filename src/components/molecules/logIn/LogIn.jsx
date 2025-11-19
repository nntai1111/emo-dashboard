import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginSuccess,
  loginFailure,
  setAliasStatus,
  setCheckingAlias,
} from "../../../store/authSlice";
import { clearAuth } from "../../../services/authInit";
import { aliasService } from "../../../services/apiService";
import { tokenManager } from "../../../services/tokenManager";
import AliasSelection from "../../organisms/AliasSelection";
// Inline Google icon to avoid external deps
const GoogleIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path
      fill="#EA4335"
      d="M12 10.2v3.9h5.5c-.24 1.25-.98 2.31-2.08 3.02l3.36 2.61C20.46 18.43 21.5 15.93 21.5 13c0-.65-.06-1.28-.17-1.89H12z"
    />
    <path
      fill="#34A853"
      d="M6.64 14.32l-.86.66-2.68 2.08C4.56 19.89 8.03 22 12 22c2.7 0 4.96-.89 6.61-2.39l-3.36-2.61c-.93.63-2.12 1-3.25 1-2.49 0-4.61-1.68-5.36-3.99z"
    />
    <path
      fill="#4A90E2"
      d="M3.1 7.26C2.4 8.78 2 10.35 2 12s.4 3.22 1.1 4.74l3.54-2.42C6.36 13.99 6.2 13.02 6.2 12s.16-1.99.44-2.32L3.1 7.26z"
    />
    <path
      fill="#FBBC05"
      d="M12 4.5c1.47 0 2.79.5 3.83 1.48l2.86-2.86C17 1.85 14.7 1 12 1 8.03 1 4.56 3.11 3.1 7.26l3.54 2.42C7.39 7.37 9.51 5.7 12 5.7c.59 0 1.15.1 1.66.28l2.17-2.17C14.79 5 13.47 4.5 12 4.5z"
    />
  </svg>
);

const Input = ({ label, error, right, ...props }) => (
  <div className="mb-4">
    <label className="block text-slate-600 text-sm font-medium mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        {...props}
        className={
          "w-full rounded-xl border bg-white/95 placeholder-slate-400 px-4 py-3 text-base text-slate-800 outline-none " +
          "focus:border-fuchsia-400/70 focus:ring-2 focus:ring-fuchsia-300/40 transition-colors duration-200 " +
          (error ? "border-rose-300" : "border-slate-200")
        }
        style={{
          fontSize: "16px", // Force 16px to prevent zoom on mobile
          WebkitTextSizeAdjust: "100%",
          WebkitAppearance: "none",
        }}
      />
      {right && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {right}
        </div>
      )}
    </div>
    {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
  </div>
);

const Divider = ({ children = "Hoặc" }) => (
  <div className="my-4 flex items-center gap-3">
    <div className="h-px flex-1 bg-slate-200" />
    <span className="text-xs uppercase tracking-wider text-slate-400">
      {children}
    </span>
    <div className="h-px flex-1 bg-slate-200" />
  </div>
);

const Button = ({
  children,
  variant = "primary", // 'primary' | 'neutral' | 'outline'
  loading = false,
  leftIcon,
  className = "",
  ...props
}) => {
  const base =
    "relative group inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:opacity-60 mobile-touch-target";
  const styles = {
    primary:
      "text-white shadow-md bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 hover:opacity-95",
    neutral:
      "text-slate-700 border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
    outline:
      "text-white/90 border border-white/30 bg-white/20 hover:bg-white/25 hover:border-white/40",
  };
  return (
    <button className={[base, styles[variant], className].join(" ")} {...props}>
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span className={loading ? "opacity-0" : ""}>{children}</span>
      {loading && (
        <span
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          aria-hidden>
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
        </span>
      )}
    </button>
  );
};

const LogIn = () => {
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/AIChatBoxWithEmo";
  const section = location.state?.section || null;
  const dispatch = useDispatch();

  // Redux state
  const { isAuthenticated, aliasStatus } = useSelector((state) => state.auth);

  // UI state
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [googleReady, setGoogleReady] = useState(false);
  const googleBtnRef = useRef(null);

  const initialForm = useMemo(
    () => ({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agree: false,
    }),
    []
  );
  const [form, setForm] = useState(initialForm);
  const apiBase = import.meta.env.VITE_API_AUTH_URL;

  // Authentication flow states
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authCheckCompleted, setAuthCheckCompleted] = useState(false);

  // Alias management states
  const [showAliasSelection, setShowAliasSelection] = useState(false);
  const [aliasCheckCompleted, setAliasCheckCompleted] = useState(false);

  // Axios instance with token attachment (refresh handled by global interceptor)
  const axiosInstance = useMemo(() => {
    const instance = axios.create({ baseURL: apiBase });
    instance.interceptors.request.use(async (config) => {
      try {
        // Sử dụng tokenManager để đảm bảo token hợp lệ
        const token = await tokenManager.ensureValidToken();
        if (token) config.headers["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        console.error("Token validation failed in LogIn:", error);
        // Token invalid, sẽ được xử lý bởi response interceptor
      }
      return config;
    });
    return instance;
  }, [apiBase]);

  // --- Check existing authentication ---
  useEffect(() => {
    // Prevent multiple calls
    if (authCheckCompleted) {
      return;
    }

    // Do not clear persisted auth on page load to preserve login across refreshes

    // If already authenticated via Redux, redirect to dashboard
    if (isAuthenticated) {
      setAuthCheckCompleted(true);
      navigate("/dashboard");
      return;
    }

    // If not authenticated, check localStorage and initialize if valid
    const checkExistingAuth = async () => {
      setAuthCheckCompleted(true);
      try {
        const token = localStorage.getItem("access_token");

        if (token) {
          // Simple token check - just verify it exists
          // Server will validate the token when making API calls
          const userData = {
            id: 1,
            email: "user@example.com",
            fullName: "User",
            avatar: null,
          };

          dispatch(
            loginSuccess({
              user: userData,
              token: token,
            })
          );
          navigate("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Error checking existing auth:", error);
        clearAuth();
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkExistingAuth();
  }, [navigate, isAuthenticated, dispatch]);

  // --- Helper utilities ---
  const getOrCreateDeviceId = () => {
    const key = "device_id";
    let existing = localStorage.getItem(key);
    if (existing) return existing;
    const newId = crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    localStorage.setItem(key, newId);
    return newId;
  };

  const handleAuthSuccess = async (data) => {
    try {
      // Save tokens only
      if (data?.token) localStorage.setItem("access_token", data.token);
      if (data?.refreshToken)
        localStorage.setItem("refresh_token", data.refreshToken);

      // Create simple user object for Redux (do not write to localStorage here)
      const userData = {
        id: 1,
        email: form.email,
        fullName: form.fullName || "User",
        avatar: null,
      };

      // Update Redux store
      dispatch(
        loginSuccess({
          user: userData,
          token: data.token,
        })
      );

      // Don't check alias status here - let AliasGuard handle it
      // This prevents duplicate API calls
    } catch (error) {
      console.error("Error saving auth data:", error);
      dispatch(loginFailure("Lỗi lưu thông tin đăng nhập"));
    }
  };

  // Check alias status and handle accordingly
  const checkAliasStatus = async () => {
    // Prevent multiple calls
    if (aliasCheckCompleted) {
      return;
    }

    try {
      dispatch(setCheckingAlias(true));
      setAliasCheckCompleted(true); // Mark as completed immediately

      const aliasStatusResponse = await aliasService.checkAliasStatus();

      if (aliasStatusResponse.aliasIssued) {
        // User already has an alias, get the current alias info
        const aliasInfo = await aliasService.getCurrentAlias();
        await updateUserWithAlias(aliasInfo);
        dispatch(setAliasStatus(true));
      } else {
        // User needs to select an alias
        dispatch(setAliasStatus(false));
        setShowAliasSelection(true); // Show immediately, no delay
      }
    } catch (error) {
      console.error("Error checking alias status:", error);
      // If alias check fails, proceed without alias
      dispatch(setAliasStatus(true)); // Assume user has alias to proceed
      try {
        window.dispatchEvent(
          new CustomEvent("app:toast", {
            detail: { type: "success", message: "Đăng nhập thành công" },
          })
        );
      } catch { }
      navigate("/dashboard");
    } finally {
      dispatch(setCheckingAlias(false));
    }
  };

  // Update user data with alias information
  const updateUserWithAlias = async (aliasInfo) => {
    try {
      // Always persist strict auth_user schema immediately
      try {
        const authUserForLocalStorage = {
          aliasCreatedAt: aliasInfo.createdAt,
          aliasId: aliasInfo.aliasId,
          aliasLabel: aliasInfo.label,
          avatar: null,
          avatarUrl: aliasInfo.avatarUrl ?? "",
          followers: aliasInfo.followers ?? 0,
          followings: aliasInfo.followings ?? 0,
          postsCount: aliasInfo.postsCount ?? 0,
          reactionGivenCount: aliasInfo.reactionGivenCount ?? 0,
          reactionReceivedCount: aliasInfo.reactionReceivedCount ?? 0,
        };
        localStorage.setItem(
          "auth_user",
          JSON.stringify(authUserForLocalStorage)
        );
      } catch { }

      // Get current user data from Redux state
      const { user: currentUser } = useSelector((state) => state.auth);
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          aliasId: aliasInfo.aliasId,
          aliasLabel: aliasInfo.label,
          avatarUrl: aliasInfo.avatarUrl,
          followers: aliasInfo.followers,
          followings: aliasInfo.followings,
          reactionGivenCount: aliasInfo.reactionGivenCount,
          reactionReceivedCount: aliasInfo.reactionReceivedCount,
          postsCount: aliasInfo.postsCount,
          aliasCreatedAt: aliasInfo.createdAt,
        };

        // Persist strict auth_user schema to localStorage
        try {
          const authUserForLocalStorage = {
            aliasCreatedAt: aliasInfo.createdAt,
            aliasId: aliasInfo.aliasId,
            aliasLabel: aliasInfo.label,
            avatar: null,
            avatarUrl: aliasInfo.avatarUrl ?? "",
            followers: aliasInfo.followers ?? 0,
            followings: aliasInfo.followings ?? 0,
            postsCount: aliasInfo.postsCount ?? 0,
            reactionGivenCount: aliasInfo.reactionGivenCount ?? 0,
            reactionReceivedCount: aliasInfo.reactionReceivedCount ?? 0,
          };
          localStorage.setItem(
            "auth_user",
            JSON.stringify(authUserForLocalStorage)
          );
        } catch { }

        // Update Redux store
        dispatch(
          loginSuccess({
            user: updatedUser,
            token: localStorage.getItem("access_token"),
          })
        );
      }

      // Show success message
      try {
        window.dispatchEvent(
          new CustomEvent("app:toast", {
            detail: { type: "success", message: "Đăng nhập thành công" },
          })
        );
      } catch { }

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating user with alias:", error);
      // Fallback: navigate to dashboard even if alias update fails
      navigate("/dashboard");
    }
  };

  // Handle alias selection completion
  const handleAliasSelected = async (aliasInfo) => {
    setShowAliasSelection(false);
    setAliasCheckCompleted(false); // Reset flag for next login
    dispatch(setAliasStatus(true)); // User now has alias
    await updateUserWithAlias(aliasInfo);
  };

  // Handle alias selection error
  const handleAliasError = (error) => {
    console.error("Alias selection error:", error);
    setShowAliasSelection(false);
    // Proceed without alias
    try {
      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail: { type: "success", message: "Đăng nhập thành công" },
        })
      );
    } catch { }
    navigate("/dashboard");
  };

  // --- Google Identity Services (GIS) setup ---
  useEffect(() => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      setGoogleReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleReady(true);
    script.onerror = () => setGoogleReady(false);
    document.head.appendChild(script);
    return () => {
      // no-op cleanup; GIS manages its own lifecycle
    };
  }, []);

  useEffect(() => {
    if (!googleReady) return;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (credentialResponse) => {
          await handleGoogleLogin(credentialResponse);
        },
        ux_mode: "popup",
        auto_select: false,
      });
      if (googleBtnRef.current) {
        // Render a minimal hidden button we can trigger programmatically
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          logo_alignment: "left",
        });
      }
    } catch (e) {
      // ignore
    }
  }, [googleReady]);

  const validate = () => {
    const e = {};
    if (mode === "register") {
      if (!form.fullName.trim()) e.fullName = "Vui lòng nhập họ và tên";
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        e.email = "Email không hợp lệ";
      if (!form.phone.match(/^\+?\d{9,14}$/))
        e.phone = "Số điện thoại không hợp lệ";
      if (form.password.length < 8) e.password = "Mật khẩu tối thiểu 8 ký tự";
      if (form.confirmPassword !== form.password)
        e.confirmPassword = "Mật khẩu không khớp";
      if (!form.agree) e.agree = "Bạn cần đồng ý điều khoản";
    } else {
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        e.email = "Email không hợp lệ";
      if (!form.password) e.password = "Vui lòng nhập mật khẩu";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      if (!apiBase) {
        setErrors({
          general:
            "Cấu hình API chưa được thiết lập. Vui lòng kiểm tra file .env",
        });
        return;
      }

      if (mode === "login") {
        const resp = await axios.post(
          `${apiBase}/Auth/v2/login`,
          {
            email: form.email,
            password: form.password,
            deviceType: "Web",
            clientDeviceId: getOrCreateDeviceId(),
          },
          { headers: { "Content-Type": "application/json" } }
        );

        await handleAuthSuccess(resp.data);
      } else {
        const resp = await axios.post(
          `${apiBase}/Auth/v2/register`,
          {
            fullName: form.fullName,
            email: form.email,
            phoneNumber: form.phone,
            password: form.password,
            confirmPassword: form.confirmPassword,
            // deviceType: "Web",
            // clientDeviceId: getOrCreateDeviceId(),
          },
          { headers: { "Content-Type": "application/json" } }
        );
        // Auto-login or switch to login depending on backend response
        if (resp.data?.token) {
          await handleAuthSuccess(resp.data);
        } else {
          setMode("login");
          setForm((f) => ({ ...initialForm, email: f.email }));
          try {
            window.dispatchEvent(
              new CustomEvent("app:toast", {
                detail: {
                  type: "success",
                  message: "Đăng ký thành công, vui lòng đăng nhập",
                },
              })
            );
          } catch { }
        }
      }
    } catch (error) {
      console.error("Auth error:", error);

      // Extract error messages from API response
      let errorMessages = {};
      let generalError = "Có lỗi xảy ra. Vui lòng thử lại.";

      if (error?.response?.data) {
        const data = error.response.data;

        // Check for specific field errors from API
        if (data.errors && typeof data.errors === "object") {
          errorMessages = data.errors;
        }

        // Check for general error message
        if (data.message) {
          generalError = data.message;
        } else if (data.error) {
          generalError = data.error;
        } else if (data.errorMessage) {
          generalError = data.errorMessage;
        } else if (data.detail) {
          generalError = data.detail;
        } else {
          generalError = `Lỗi ${error.response.status}: ${error.response.statusText}`;
        }
      } else if (error?.message) {
        generalError = error.message;
      }

      // Set errors for form fields and general error
      setErrors({ ...errorMessages, general: generalError });

      // Show error toast
      try {
        window.dispatchEvent(
          new CustomEvent("app:toast", {
            detail: { type: "error", message: generalError },
          })
        );
      } catch { }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    setErrors({});
    try {
      const idToken = credentialResponse?.credential;
      if (!idToken) throw new Error("No Google credential returned");

      const apiAuth = import.meta.env.VITE_API_AUTH_URL;
      if (!apiAuth) {
        setErrors({
          general:
            "Cấu hình API chưa được thiết lập. Vui lòng kiểm tra file .env",
        });
        return;
      }

      const response = await axios.post(
        `${apiAuth}/Auth/v2/google/login`,
        {
          googleIdToken: idToken,
          deviceType: "Web",
          clientDeviceId: getOrCreateDeviceId(),
          intent: mode, // optional: pass intent if backend differentiates
        },
        { headers: { "Content-Type": "application/json" } }
      );

      await handleAuthSuccess(response.data);
    } catch (error) {
      console.error("Google login error:", error);

      // Extract error messages from API response
      let errorMessages = {};
      let generalError = "Lỗi đăng nhập Google! Vui lòng thử lại.";

      if (error?.response?.data) {
        const data = error.response.data;

        // Check for specific field errors from API
        if (data.errors && typeof data.errors === "object") {
          errorMessages = data.errors;
        }

        // Check for general error message
        if (data.message) {
          generalError = data.message;
        } else if (data.error) {
          generalError = data.error;
        } else if (data.errorMessage) {
          generalError = data.errorMessage;
        } else if (data.detail) {
          generalError = data.detail;
        } else {
          generalError = `Lỗi ${error.response.status}: ${error.response.statusText}`;
        }
      } else if (error?.message) {
        generalError = error.message;
      }

      // Set errors for form fields and general error
      setErrors({ ...errorMessages, general: generalError });

      // Show error toast
      try {
        window.dispatchEvent(
          new CustomEvent("app:toast", {
            detail: { type: "error", message: generalError },
          })
        );
      } catch { }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!googleReady) return;
    try {
      // Prefer showing a popup via rendered button (reliable)
      const btn = googleBtnRef.current?.querySelector("div[role='button']");
      if (btn) btn.click();
      else window.google.accounts.id.prompt();
    } catch {
      window.google?.accounts?.id?.prompt();
    }
  };

  // Public logout: dispatch new CustomEvent("app:logout") anywhere to trigger
  const backendLogout = async () => {
    try {
      if (!apiBase) return;
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) return;
      await axios.post(
        `${apiBase}/Auth/v2/logout`,
        { refreshToken },
        { headers: { "Content-Type": "application/json" } }
      );
    } catch {
      // ignore network errors on logout
    }
  };

  const revokeGoogleAndClearSession = async () => {
    try {
      const email = localStorage.getItem("google_email");
      if (window.google?.accounts?.id && email) {
        await new Promise((resolve) => {
          try {
            window.google.accounts.id.revoke(email, () => resolve());
          } catch {
            resolve();
          }
        });
      }
    } finally {
      try {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      } catch { }
    }
  };

  const clearLocalSession = () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    } catch { }
  };

  useEffect(() => {
    const onLogout = async () => {
      await backendLogout();
      await revokeGoogleAndClearSession();
      clearAuth(); // Use centralized clearAuth function
    };
    window.addEventListener("app:logout", onLogout);
    return () => window.removeEventListener("app:logout", onLogout);
  }, []);

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <section className="relative overflow-hidden w-full min-h-screen py-10 md:py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </section>
    );
  }

  // Show alias selection screen
  if (showAliasSelection || aliasStatus === false) {
    return (
      <AliasSelection
        onAliasSelected={handleAliasSelected}
        onError={handleAliasError}
      />
    );
  }

  return (
    <section className="relative overflow-hidden w-full min-h-dvh py-10 md:py-16 flex items-center justify-center">
      {/* Luxurious purple background */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
        {/* Deep base gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(76,29,149,0.55),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(124,58,237,0.5),transparent_60%),linear-gradient(180deg,rgba(23,15,55,1)_0%,rgba(32,18,74,1)_40%,rgba(17,24,39,1)_100%)]" />
        {/* Soft vignette edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.25))]" />
        {/* Simplified ambient blobs - static for better mobile performance */}
        <div
          className="absolute -top-24 -left-24 w-152 h-152 rounded-full blur-3xl opacity-80"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(168,85,247,0.28), transparent 60%), radial-gradient(circle at 70% 60%, rgba(236,72,153,0.25), transparent 55%)",
          }}
        />
        <div
          className="absolute -bottom-28 -right-20 w-xl h-144 rounded-full blur-3xl opacity-80"
          style={{
            background:
              "radial-gradient(circle at 60% 40%, rgba(129,140,248,0.22), transparent 58%), radial-gradient(circle at 40% 70%, rgba(192,132,252,0.26), transparent 60%)",
          }}
        />
      </div>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl px-4">
        {/* Outer gradient border wrapper */}
        <div className="relative rounded-3xl p-[1.5px] bg-[conic-gradient(from_180deg,rgba(139,92,246,0.55),rgba(168,85,247,0.5),rgba(99,102,241,0.5),rgba(139,92,246,0.55))] shadow-[0_24px_80px_rgba(30,27,75,0.45)]">
          <div className="rounded-3xl bg-white/95 border border-white/40 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left visual panel */}
              <div className="relative px-6 py-8 md:px-10 md:py-12">
                {/* Tabs */}
                <div className="flex items-center gap-2">
                  {[
                    { key: "login", label: "Đăng nhập" },
                    { key: "register", label: "Đăng ký" },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => {
                        setMode(t.key);
                        setErrors({});
                      }}
                      className={
                        "rounded-full px-4 py-2 text-sm font-medium transition " +
                        (mode === t.key
                          ? "bg-slate-900 text-white shadow"
                          : "text-slate-600 hover:bg-slate-100")
                      }>
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Google button */}
                <Button
                  type="button"
                  onClick={handleGoogle}
                  disabled={loading}
                  variant="neutral"
                  leftIcon={<GoogleIcon />}
                  className="mt-6 w-full">
                  {mode === "login"
                    ? "Tiếp tục với Google"
                    : "Đăng ký với Google"}
                </Button>
                {/* Hidden container for the official GIS button */}
                <div ref={googleBtnRef} className="hidden" aria-hidden />

                {/* <Divider>Hoặc dùng email</Divider>

                <form onSubmit={handleSubmit} noValidate>
                  {errors.general && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{errors.general}</p>
                    </div>
                  )}

                  {mode === "register" && (
                    <Input
                      label="Họ và tên"
                      value={form.fullName}
                      onChange={(e) => {
                        setForm({ ...form, fullName: e.target.value });
                        if (errors.fullName) {
                          setErrors((prev) => ({
                            ...prev,
                            fullName: undefined,
                          }));
                        }
                      }}
                      placeholder="Nguyễn Văn A"
                      autoComplete="name"
                      error={errors.fullName}
                    />
                  )}

                  <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      // Clear email error when user starts typing
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    error={errors.email}
                  />

                  {mode === "register" && (
                    <Input
                      label="Số điện thoại"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => {
                        setForm({ ...form, phone: e.target.value });
                        if (errors.phone) {
                          setErrors((prev) => ({ ...prev, phone: undefined }));
                        }
                      }}
                      placeholder="+84 912 345 678"
                      autoComplete="tel"
                      error={errors.phone}
                    />
                  )}

                  <Input
                    label="Mật khẩu"
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => {
                      setForm({ ...form, password: e.target.value });
                      // Clear password error when user starts typing
                      if (errors.password) {
                        setErrors((prev) => ({ ...prev, password: undefined }));
                      }
                    }}
                    placeholder={
                      mode === "login"
                        ? "Mật khẩu của bạn"
                        : "Tối thiểu 8 ký tự"
                    }
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    error={errors.password}
                    right={
                      <button
                        type="button"
                        onClick={() => setShowPw((s) => !s)}
                        className="text-xs text-slate-500 hover:text-slate-700">
                        {showPw ? "Ẩn" : "Hiện"}
                      </button>
                    }
                  />

                  {mode === "register" && (
                    <Input
                      label="Xác nhận mật khẩu"
                      type={showPw2 ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) => {
                        setForm({ ...form, confirmPassword: e.target.value });
                        if (errors.confirmPassword) {
                          setErrors((prev) => ({
                            ...prev,
                            confirmPassword: undefined,
                          }));
                        }
                      }}
                      placeholder="Nhập lại mật khẩu"
                      autoComplete="new-password"
                      error={errors.confirmPassword}
                      right={
                        <button
                          type="button"
                          onClick={() => setShowPw2((s) => !s)}
                          className="text-xs text-slate-500 hover:text-slate-700">
                          {showPw2 ? "Ẩn" : "Hiện"}
                        </button>
                      }
                    />
                  )}

                  {mode === "register" && (
                    <div className="mb-4 flex items-start gap-3">
                      <input
                        id="agree"
                        type="checkbox"
                        checked={form.agree}
                        onChange={(e) =>
                          setForm({ ...form, agree: e.target.checked })
                        }
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-fuchsia-500 focus:ring-fuchsia-300"
                      />
                      <label htmlFor="agree" className="text-sm text-slate-600">
                        Tôi đồng ý với{" "}
                        <span className="underline decoration-slate-300">
                          Điều khoản
                        </span>{" "}
                        và
                        <span className="ml-1 underline decoration-slate-300">
                          Chính sách bảo mật
                        </span>
                        .
                        {errors.agree && (
                          <span className="block text-rose-500 text-xs mt-1">
                            {errors.agree}
                          </span>
                        )}
                      </label>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    loading={loading}
                    variant="primary"
                    className="mt-2 w-full">
                    {mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
                  </Button>
                </form> */}

                <p className="mt-4 text-sm text-slate-600">
                  {mode === "login" ? (
                    <>
                      Chưa có tài khoản?{" "}
                      <button
                        className="text-slate-900 font-semibold underline-offset-4 hover:underline"
                        onClick={() => {
                          setMode("register");
                          setErrors({});
                        }}>
                        Đăng ký ngay
                      </button>
                    </>
                  ) : (
                    <>
                      Đã có tài khoản?{" "}
                      <button
                        className="text-slate-900 font-semibold underline-offset-4 hover:underline"
                        onClick={() => {
                          setMode("login");
                          setErrors({});
                        }}>
                        Đăng nhập
                      </button>
                    </>
                  )}
                </p>
              </div>

              {/* Right form panel */}
              <div className="relative hidden md:flex min-h-[560px] items-center justify-center bg-linear-to-br from-violet-600/10 via-fuchsia-500/10 to-indigo-500/10">
                {/* Background image covers entire panel */}
                <img
                  src="/image/home/bg_HomeCenter.webp"
                  alt="Login Illustration"
                  className="absolute inset-0 z-0 w-full h-full object-cover select-none"
                  draggable={false}
                />
                <div className="absolute inset-0 pointer-events-none z-1">
                  <div className="absolute -top-16 -left-10 w-64 h-64 bg-violet-500/25 blur-3xl rounded-full" />
                  <div className="absolute bottom-0 right-0 w-72 h-72 bg-fuchsia-400/25 blur-3xl rounded-full" />
                </div>
                {/* Optional overlay content can be added here with z-[2] if needed */}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default LogIn;