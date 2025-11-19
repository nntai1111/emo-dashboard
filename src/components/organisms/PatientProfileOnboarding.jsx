import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { profileService } from '../../services/apiService';

const PatientProfileOnboarding = ({ onCompleted, onError }) => {
    const [industries, setIndustries] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedIndustryId, setSelectedIndustryId] = useState('');
    const [selectedJobId, setSelectedJobId] = useState('');
    const [loadingIndustries, setLoadingIndustries] = useState(true);
    const [loadingJobs, setLoadingJobs] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        loadIndustries();
    }, []);

    useEffect(() => {
        if (selectedIndustryId) {
            loadJobs(selectedIndustryId);
        } else {
            setJobs([]);
            setSelectedJobId('');
        }
    }, [selectedIndustryId]);

    const loadIndustries = async () => {
        try {
            setLoadingIndustries(true);
            setError(null);
            const data = await profileService.getIndustries();
            setIndustries(data || []);
        } catch (err) {
            const errorMessage = err.message || 'Không thể tải danh sách ngành nghề';
            setError(errorMessage);
            onError?.(err);
        } finally {
            setLoadingIndustries(false);
        }
    };

    const loadJobs = async (industryId) => {
        try {
            setLoadingJobs(true);
            setError(null);
            const data = await profileService.getJobsByIndustry(industryId);
            setJobs(data || []);
            setSelectedJobId(''); // Reset job selection when industry changes
        } catch (err) {
            const errorMessage = err.message || 'Không thể tải danh sách công việc';
            setError(errorMessage);
            onError?.(err);
        } finally {
            setLoadingJobs(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedIndustryId) {
            setError('Vui lòng chọn ngành nghề');
            return;
        }

        if (!selectedJobId) {
            setError('Vui lòng chọn công việc');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const patientData = {
                jobId: selectedJobId
            };

            await profileService.submitPatientProfileOnboarding(patientData);

            onCompleted?.();
        } catch (err) {
            const errorMessage = err.message || 'Không thể lưu thông tin. Vui lòng thử lại.';
            setError(errorMessage);
            onError?.(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.96 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-md rounded-2xl border border-purple-200/60 dark:border-purple-800/40 bg-white dark:bg-neutral-900 shadow-2xl"
            >
                <div className="p-5">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100 mb-2">
                            <span className="text-xl">💼</span>
                            <span className="font-semibold text-lg">Thông tin nghề nghiệp</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Vui lòng chọn ngành nghề và công việc của bạn
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Industry Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ngành nghề <span className="text-red-500">*</span>
                            </label>
                            {loadingIndustries ? (
                                <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                    Đang tải danh sách ngành nghề...
                                </div>
                            ) : (
                                <select
                                    value={selectedIndustryId}
                                    onChange={(e) => setSelectedIndustryId(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                    disabled={submitting || loadingIndustries}
                                >
                                    <option value="">-- Chọn ngành nghề --</option>
                                    {industries.map((industry) => (
                                        <option key={industry.id} value={industry.id}>
                                            {industry.industryName}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Job Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Công việc <span className="text-red-500">*</span>
                            </label>
                            {!selectedIndustryId ? (
                                <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                    Vui lòng chọn ngành nghề trước
                                </div>
                            ) : loadingJobs ? (
                                <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                    Đang tải danh sách công việc...
                                </div>
                            ) : jobs.length === 0 ? (
                                <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                    Không có công việc nào trong ngành này
                                </div>
                            ) : (
                                <select
                                    value={selectedJobId}
                                    onChange={(e) => setSelectedJobId(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                    disabled={submitting || loadingJobs}
                                >
                                    <option value="">-- Chọn công việc --</option>
                                    {jobs.map((job) => (
                                        <option key={job.id} value={job.id}>
                                            {job.jobTitle}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                            disabled={submitting || !selectedIndustryId || !selectedJobId || loadingIndustries || loadingJobs}
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

export default PatientProfileOnboarding;

