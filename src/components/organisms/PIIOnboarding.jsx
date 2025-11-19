import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { profileService } from '../../services/apiService';
import Input from '../atoms/Input';

// Vietnamese phone number validation
const validateVietnamesePhone = (phone) => {
    if (!phone) {
        return 'Vui lòng nhập số điện thoại';
    }

    // Remove spaces and special characters (keep only digits)
    const cleaned = phone.replace(/\s+/g, '').replace(/[-\+()]/g, '');

    // Vietnamese phone patterns:
    // - 10 digits starting with 0 followed by 3,5,7,8,9: 03xxxxxxxx, 05xxxxxxxx, etc.
    // - 11 digits starting with 84 followed by 3,5,7,8,9: 843xxxxxxxx, 845xxxxxxxx, etc.
    // - 9 digits starting with 3,5,7,8,9 (without leading 0): 3xxxxxxxx, 5xxxxxxxx, etc.

    // Pattern 1: 0[3|5|7|8|9][0-9]{8} (10 digits total, starts with 0)
    // Pattern 2: 84[3|5|7|8|9][0-9]{8} (11 digits total, starts with 84)
    // Pattern 3: [3|5|7|8|9][0-9]{8} (9 digits total, starts with 3,5,7,8,9)
    const vietnamesePhoneRegex = /^(0[35789][0-9]{8}|84[35789][0-9]{8}|[35789][0-9]{8})$/;

    if (!vietnamesePhoneRegex.test(cleaned)) {
        return 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (VD: 0912345678 hoặc 84912345678)';
    }

    return null;
};

const PIIOnboarding = ({ onCompleted, onError }) => {
    const [formData, setFormData] = useState({
        gender: '',
        birthDate: '',
        address: '',
        phoneNumber: ''
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.gender) {
            newErrors.gender = 'Vui lòng chọn giới tính';
        }

        if (!formData.birthDate) {
            newErrors.birthDate = 'Vui lòng nhập ngày sinh';
        } else {
            const date = new Date(formData.birthDate);
            const today = new Date();
            const minDate = new Date('1900-01-01');

            if (isNaN(date.getTime())) {
                newErrors.birthDate = 'Ngày sinh không hợp lệ';
            } else if (date > today) {
                newErrors.birthDate = 'Ngày sinh không thể lớn hơn ngày hiện tại';
            } else if (date < minDate) {
                newErrors.birthDate = 'Ngày sinh không hợp lệ';
            } else {
                // Tính tuổi chính xác
                const age = today.getFullYear() - date.getFullYear();
                const monthDiff = today.getMonth() - date.getMonth();
                const dayDiff = today.getDate() - date.getDate();
                let actualAge = age;
                if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                    actualAge--;
                }
                if (actualAge < 13) {
                    newErrors.birthDate = 'Người dùng phải từ 13 tuổi trở lên.';
                }
            }
        }

        if (!formData.address || formData.address.trim().length < 5) {
            newErrors.address = 'Vui lòng nhập địa chỉ (ít nhất 5 ký tự)';
        }

        const phoneError = validateVietnamesePhone(formData.phoneNumber);
        if (phoneError) {
            newErrors.phoneNumber = phoneError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);

            // Format phone number (remove spaces and special chars)
            const cleanedPhone = formData.phoneNumber.replace(/\s+/g, '').replace(/[-\+()]/g, '');

            // Format date to YYYY-MM-DD
            const formattedDate = formData.birthDate;

            const piiData = {
                gender: formData.gender,
                birthDate: formattedDate,
                address: formData.address.trim(),
                phoneNumber: cleanedPhone
            };

            await profileService.submitPIIOnboarding(piiData);

            onCompleted?.();
        } catch (err) {
            const errorMessage = err.message || 'Không thể lưu thông tin. Vui lòng thử lại.';
            setErrors({ submit: errorMessage });
            onError?.(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.96 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-md rounded-2xl border border-purple-200/60 dark:border-purple-800/40 bg-white dark:bg-neutral-900 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="p-5">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100 mb-2">
                            <span className="text-xl">📝</span>
                            <span className="font-semibold text-lg">Thông tin cá nhân</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Vui lòng điền thông tin để tiếp tục
                        </p>
                    </div>

                    {errors.submit && (
                        <div className="mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                            {errors.submit}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Giới tính <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.gender}
                                onChange={(e) => handleChange('gender', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${errors.gender ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                disabled={submitting}
                            >
                                <option value="">-- Chọn giới tính --</option>
                                <option value="Male">Nam</option>
                                <option value="Female">Nữ</option>
                                <option value="Other">Khác</option>
                            </select>
                            {errors.gender && (
                                <p className="text-xs text-red-500 mt-1">{errors.gender}</p>
                            )}
                        </div>

                        {/* Birth Date */}
                        <Input
                            label="Ngày sinh"
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => handleChange('birthDate', e.target.value)}
                            error={errors.birthDate}
                            disabled={submitting}
                            required
                        />

                        {/* Address */}
                        <Input
                            label="Địa chỉ"
                            type="text"
                            placeholder="Nhập địa chỉ của bạn"
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            error={errors.address}
                            disabled={submitting}
                            required
                        />

                        {/* Phone Number */}
                        <Input
                            label="Số điện thoại"
                            type="tel"
                            placeholder="Nhập số điện thoại (VD: 0912345678)"
                            value={formData.phoneNumber}
                            onChange={(e) => {
                                // Allow only numbers, spaces, and common phone separators
                                const value = e.target.value.replace(/[^\d\s\-+()]/g, '');
                                handleChange('phoneNumber', value);
                            }}
                            error={errors.phoneNumber}
                            disabled={submitting}
                            required
                        />

                        <button
                            type="submit"
                            className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                            disabled={submitting}
                        >
                            {submitting ? 'Đang lưu...' : 'XÁC NHẬN'}
                        </button>
                    </form>
                </div>

                {submitting && (
                    <div className="absolute inset-0 rounded-2xl bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
                        <div className="bg-white dark:bg-neutral-800 border border-purple-200/60 dark:border-purple-800/40 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                            Đang lưu thông tin...
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default PIIOnboarding;

