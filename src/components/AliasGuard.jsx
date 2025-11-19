import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { aliasService, freeTrialService } from "../services/apiService";
import { setAliasStatus, setCheckingAlias, setOnboardingStatus, setOnboardingCheckCompleted } from "../store/authSlice";
import AliasSelection from "./organisms/AliasSelection";
import PIIOnboarding from "./organisms/PIIOnboarding";
import PatientProfileOnboarding from "./organisms/PatientProfileOnboarding";
import FreeTrialInvitation from "./organisms/FreeTrialInvitation";
import LoadingScreen from "./atoms/Loading/LoadingScreen";

/**
 * AliasGuard - Component bảo vệ route khỏi user chưa có alias
 * Nếu user chưa có alias (aliasIssued: false), sẽ hiển thị modal chọn tên
 * Chỉ cho phép truy cập khi user đã có alias (aliasIssued: true)
 */
const AliasGuard = ({ children }) => {
    const dispatch = useDispatch();
    const {
        isAuthenticated,
        aliasStatus,
        isCheckingAlias,
        onboardingStatus,
        onboardingCheckCompleted
    } = useSelector((state) => state.auth);

    // State for free trial invitation
    const [showFreeTrialInvitation, setShowFreeTrialInvitation] = useState(false);
    const [isCheckingFreeTrial, setIsCheckingFreeTrial] = useState(false);
    const [freeTrialChecked, setFreeTrialChecked] = useState(false); // Flag to prevent multiple checks

    // Check free trial status and show invitation if needed
    const checkAndShowFreeTrial = useCallback(async () => {
        // Prevent multiple simultaneous calls
        if (isCheckingFreeTrial) {
            return;
        }

        try {
            setIsCheckingFreeTrial(true);

            // Check if user has already dismissed the free trial invitation
            const dismissedKey = 'free_trial_invitation_dismissed';
            const hasDismissed = localStorage.getItem(dismissedKey) === 'true';

            if (hasDismissed) {
                // User already dismissed, don't show again
                setFreeTrialChecked(true);
                return;
            }

            const freeTrialStatus = await freeTrialService.checkFreeTrialStatus();

            // If free trial is not used (isFreeTrialUsed === false), show invitation
            if (freeTrialStatus.isFreeTrialUsed === false) {
                setShowFreeTrialInvitation(true);
            }

            // Mark as checked after successful API call
            setFreeTrialChecked(true);
        } catch (error) {
            console.error("Error checking free trial status:", error);
            // If check fails, mark as checked to prevent infinite retries
            setFreeTrialChecked(true);
        } finally {
            setIsCheckingFreeTrial(false);
        }
    }, [isCheckingFreeTrial]);

    // Update auth_user in localStorage with alias information
    const updateAuthUserWithAlias = useCallback(async (aliasInfo) => {
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
            localStorage.setItem("auth_user", JSON.stringify(authUserForLocalStorage));
        } catch (error) {
            console.error("Error updating auth_user:", error);
        }
    }, []);

    const checkOnboardingStatus = useCallback(async () => {
        // Prevent multiple calls - check Redux state instead of local state
        if (onboardingCheckCompleted || isCheckingAlias) {
            return;
        }

        try {
            dispatch(setCheckingAlias(true));
            dispatch(setOnboardingCheckCompleted(true));

            const statusResponse = await aliasService.checkAliasStatus();

            // Store all onboarding status in Redux
            dispatch(setOnboardingStatus({
                aliasIssued: statusResponse.aliasIssued || false,
                piiCompleted: statusResponse.piiCompleted || false,
                patientProfileCompleted: statusResponse.patientProfileCompleted || false
            }));

            if (statusResponse.aliasIssued) {
                // User already has an alias, get full alias info and update auth_user
                try {
                    const aliasInfo = await aliasService.getCurrentAlias();
                    await updateAuthUserWithAlias(aliasInfo);
                } catch (err) {
                    console.error("Error getting current alias:", err);
                    // Continue without alias info update
                }
                dispatch(setAliasStatus(true));
            } else {
                // User needs to select an alias
                dispatch(setAliasStatus(false));
            }
        } catch (error) {
            console.error("Error checking onboarding status:", error);
            // If check fails, assume user has completed everything to proceed
            dispatch(setAliasStatus(true));
            dispatch(setOnboardingStatus({
                aliasIssued: true,
                piiCompleted: true,
                patientProfileCompleted: true
            }));
        } finally {
            dispatch(setCheckingAlias(false));
        }
    }, [onboardingCheckCompleted, isCheckingAlias, dispatch, updateAuthUserWithAlias]);

    // Check onboarding status when component mounts
    useEffect(() => {
        if (!isAuthenticated) {
            return; // Don't check if not authenticated
        }

        // If we've already checked onboarding status globally (in Redux), skip
        if (onboardingCheckCompleted) {
            return;
        }

        // If local cache already has alias info, set aliasStatus optimistically
        // But still need to check full onboarding status from API
        try {
            const stored = localStorage.getItem("auth_user");
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed?.aliasId && aliasStatus === null) {
                    dispatch(setAliasStatus(true));
                }
            }
        } catch { }

        // Only one AliasGuard instance will call this (first one to mount)
        checkOnboardingStatus();
    }, [isAuthenticated, onboardingCheckCompleted, checkOnboardingStatus, dispatch, aliasStatus]);

    // Check free trial status when onboarding is already complete (for returning users)
    // Only check once when onboarding is complete
    useEffect(() => {
        if (!isAuthenticated || isCheckingFreeTrial || freeTrialChecked) {
            return;
        }

        // Only check if onboarding is already complete and we haven't checked yet
        if (
            onboardingStatus.aliasIssued === true &&
            onboardingStatus.piiCompleted === true &&
            onboardingStatus.patientProfileCompleted === true &&
            !showFreeTrialInvitation
        ) {
            setFreeTrialChecked(true); // Mark as checked to prevent re-checking
            checkAndShowFreeTrial();
        }
    }, [isAuthenticated, onboardingStatus.aliasIssued, onboardingStatus.piiCompleted, onboardingStatus.patientProfileCompleted, isCheckingFreeTrial, freeTrialChecked, showFreeTrialInvitation, checkAndShowFreeTrial]);

    // Handle successful alias selection
    const handleAliasSelected = async (aliasInfo) => {
        try {
            // localStorage is already updated in AliasSelection component
            // Just update Redux state and close modal
            dispatch(setAliasStatus(true));

            // Show success message
            try {
                // Update auth_user with full alias info
                await updateAuthUserWithAlias(aliasInfo);

                // Verify onboarding status from server
                try {
                    const statusResponse = await aliasService.checkAliasStatus();

                    if (statusResponse.aliasIssued) {
                        // Server confirms alias exists, update status in Redux
                        dispatch(setAliasStatus(true));
                        dispatch(setOnboardingStatus({
                            aliasIssued: true,
                            piiCompleted: statusResponse.piiCompleted || false,
                            patientProfileCompleted: statusResponse.patientProfileCompleted || false
                        }));

                        // Show success message
                        try {
                            window.dispatchEvent(
                                new CustomEvent("app:toast", {
                                    detail: {
                                        type: "success",
                                        message: `Chào mừng ${aliasInfo.label}!`
                                    },
                                })
                            );
                        } catch { }
                    } else {
                        // Server doesn't confirm alias, show error and retry
                        console.error("Server doesn't confirm alias after selection");
                        try {
                            window.dispatchEvent(
                                new CustomEvent("app:toast", {
                                    detail: {
                                        type: "error",
                                        message: "Lỗi xác thực, vui lòng thử lại"
                                    },
                                })
                            );
                        } catch { }
                        // Reset alias status to trigger re-check
                        dispatch(setAliasStatus(null));
                        dispatch(setOnboardingCheckCompleted(false));
                    }
                } catch (verifyError) {
                    console.error("Error verifying onboarding status:", verifyError);
                    // Still proceed but log the error
                    dispatch(setAliasStatus(true));
                    dispatch(setOnboardingStatus({
                        ...onboardingStatus,
                        aliasIssued: true
                    }));
                }
            } catch (error) {
                console.error("Error updating user with alias:", error);
            }
        } catch (error) {
            console.error("Error in handleAliasSelected:", error);
        }
    };

    // Handle PII onboarding completion
    const handlePIICompleted = async () => {
        // Update local state optimistically, no need to re-check API
        dispatch(setOnboardingStatus({
            ...onboardingStatus,
            piiCompleted: true
        }));

        // Check free trial status after PII onboarding completes (only if not already checked)
        if (!freeTrialChecked && !isCheckingFreeTrial) {
            await checkAndShowFreeTrial();
        }
    };

    // Handle patient profile onboarding completion
    const handlePatientProfileCompleted = async () => {
        // Update local state optimistically, no need to re-check API
        dispatch(setOnboardingStatus({
            ...onboardingStatus,
            patientProfileCompleted: true
        }));
    };

    // Handle alias selection error
    const handleAliasError = (error) => {
        console.error("Alias selection error:", error);
        // You can add toast notification here if needed
    };

    // Handle free trial activation
    const handleFreeTrialActivated = () => {
        setShowFreeTrialInvitation(false);
        // Mark as dismissed so it won't show again
        localStorage.setItem('free_trial_invitation_dismissed', 'true');
    };

    // Handle free trial close
    const handleFreeTrialClose = () => {
        setShowFreeTrialInvitation(false);
        // Mark as dismissed so it won't show again
        localStorage.setItem('free_trial_invitation_dismissed', 'true');
    };

    // Show loading while checking onboarding status
    if (isCheckingAlias) {
        return <LoadingScreen />;
    }

    // If onboarding status hasn't been checked yet, show loading
    if (onboardingStatus.aliasIssued === null) {
        return <LoadingScreen />;
    }

    // Show onboarding modals in order: alias -> PII -> patient profile
    // 1. Check alias first - only show if explicitly false (not null)
    if (onboardingStatus.aliasIssued === false || aliasStatus === false) {
        return (
            <AliasSelection
                onAliasSelected={handleAliasSelected}
                onError={handleAliasError}
            />
        );
    }

    // 2. Check PII completion - only show if explicitly false (not null)
    if (onboardingStatus.aliasIssued === true && onboardingStatus.piiCompleted === false) {
        return (
            <PIIOnboarding
                onCompleted={handlePIICompleted}
                onError={handleAliasError}
            />
        );
    }

    // 3. Check patient profile completion - only show if explicitly false (not null)
    if (onboardingStatus.aliasIssued === true && onboardingStatus.piiCompleted === true && onboardingStatus.patientProfileCompleted === false) {
        return (
            <PatientProfileOnboarding
                onCompleted={handlePatientProfileCompleted}
                onError={handleAliasError}
            />
        );
    }

    // If user has completed all onboarding steps, check for free trial invitation
    if (onboardingStatus.aliasIssued === true && onboardingStatus.piiCompleted === true && onboardingStatus.patientProfileCompleted === true) {
        // Show free trial invitation if needed
        if (showFreeTrialInvitation) {
            return (
                <>
                    {children}
                    <FreeTrialInvitation
                        onClose={handleFreeTrialClose}
                        onActivated={handleFreeTrialActivated}
                    />
                </>
            );
        }

        return children;
    }

    // Fallback: show loading if status is unclear
    return <LoadingScreen />;
};

export default AliasGuard;
