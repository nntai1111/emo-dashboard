import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Rocket,
  Copy,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { loginStart, loginSuccess, loginFailure } from "../../store/authSlice";
import { authService } from "../../services/apiService";
import { validateEmail } from "../../utils/helpers";

const LoginForm = ({ onSwitchToRegister }) => {
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();
  // Chuyển hướng sang /home khi đăng nhập thành công
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [copiedField, setCopiedField] = useState(null);

  const demoCredentials = {
    email: "emo@gmail.com",
    password: "emo@123",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email là bắt buộc";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      errors.password = "Mật khẩu là bắt buộc";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(loginStart());

    try {
      const response = await authService.login(
        formData.email,
        formData.password
      );

      // Ensure correct payload structure for loginSuccess
      dispatch(
        loginSuccess({
          user: response.user,
          token: response.token,
        })
      );
    } catch (error) {
      dispatch(
        loginFailure(error.response?.data?.message || "Đăng nhập thất bại")
      );
    }
  };

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const fillDemoCredentials = () => {
    setFormData(demoCredentials);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">👋</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
          Chào mừng trở lại
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Đăng nhập để tiếp tục chia sẻ cảm xúc
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto" />
      </motion.div>

      {/* Enhanced Demo Login Instructions */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 dark:from-purple-600/10 dark:via-pink-600/10 dark:to-blue-600/10 rounded-2xl" />
        <div className="relative backdrop-blur-sm bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200/50 dark:border-purple-700/50 rounded-2xl p-5 shadow-lg">
          {/* Header with Icon */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-purple-800 dark:text-purple-200">
                  Tài khoản Demo
                </h4>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  Trải nghiệm nhanh
                </p>
              </div>
            </div>
            <motion.button
              type="button"
              onClick={fillDemoCredentials}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Điền tự động
            </motion.button>
          </div>

          {/* Credentials */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/70 dark:bg-[#1C1C1E]/70 rounded-xl border border-purple-200/30 dark:border-purple-700/30">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Email
                  </p>
                  <code className="text-sm font-mono text-gray-900 dark:text-gray-100">
                    {demoCredentials.email}
                  </code>
                </div>
              </div>
              <motion.button
                type="button"
                onClick={() => copyToClipboard(demoCredentials.email, "email")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-purple-100 dark:hover:bg-purple-800/50 rounded-lg transition-colors duration-200">
                {copiedField === "email" ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                )}
              </motion.button>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/70 dark:bg-[#1C1C1E]/70 rounded-xl border border-purple-200/30 dark:border-purple-700/30">
              <div className="flex items-center space-x-3">
                <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Mật khẩu
                  </p>
                  <code className="text-sm font-mono text-gray-900 dark:text-gray-100">
                    {demoCredentials.password}
                  </code>
                </div>
              </div>
              <motion.button
                type="button"
                onClick={() =>
                  copyToClipboard(demoCredentials.password, "password")
                }
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-purple-100 dark:hover:bg-purple-800/50 rounded-lg transition-colors duration-200">
                {copiedField === "password" ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-rose-500/5 dark:from-red-600/10 dark:to-rose-600/10 rounded-2xl" />
            <div className="relative backdrop-blur-sm bg-red-50/80 dark:bg-red-900/30 border border-red-200/50 dark:border-red-800/50 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-800/50 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                    {error}
                  </p>
                  <p className="text-red-600 dark:text-red-400 text-xs">
                    Vui lòng thử lại
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Form Fields */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="space-y-5">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-600/20 dark:to-pink-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-400 w-5 h-5 transition-colors duration-300" />
            <Input
              name="email"
              type="email"
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
              className="pl-12 pr-4 py-4 text-base rounded-2xl border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-sm transition-all duration-300"
              required
            />
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-600/20 dark:to-pink-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-400 w-5 h-5 transition-colors duration-300" />
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleInputChange}
              error={formErrors.password}
              className="pl-12 pr-12 py-4 text-base rounded-2xl border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-sm transition-all duration-300"
              required
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-300">
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="relative w-full py-4 text-base font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-[1.02] transition-all duration-300"
          loading={loading}
          disabled={loading}>
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Đang đăng nhập...</span>
            </div>
          ) : (
            <span>Đăng nhập</span>
          )}
        </Button>
      </motion.div>

      {/* Enhanced Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-center">
        <div className="relative">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent flex-1" />
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              hoặc
            </span>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent flex-1" />
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-base">
            Chưa có tài khoản?{" "}
            <motion.button
              type="button"
              onClick={onSwitchToRegister}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 relative">
              Đăng ký ngay
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300" />
            </motion.button>
          </p>
        </div>
      </motion.div>
    </motion.form>
  );
};

export default LoginForm;
