import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, Heart } from "lucide-react";
import { getGiftSmart } from "../../utils/giftHelpers";

const GiftReceivedEffect = ({ isVisible, onComplete, giftId, giftName, giftMediaUrl, actorDisplayName }) => {
    const [showEffect, setShowEffect] = useState(false);
    const [giftInfo, setGiftInfo] = useState(null);

    // Get gift information when giftId changes
    useEffect(() => {
        if (giftId || giftName) {
            // Use smart gift finder to get gift data
            const gift = getGiftSmart(giftId, giftName);
            setGiftInfo(gift);
        } else if (giftMediaUrl) {
            // Use provided giftMediaUrl if available
            const giftData = {
                name: 'Unknown Gift',
                mediaUrl: giftMediaUrl
            };
            setGiftInfo(giftData);
        } else {
            setGiftInfo(null);
        }
    }, [giftId, giftName, giftMediaUrl, actorDisplayName]);

    useEffect(() => {
        if (isVisible) {
            setShowEffect(true);
            // Auto hide after 3 seconds
            const timer = setTimeout(() => {
                setShowEffect(false);
                onComplete?.();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete]);

    return (
        <AnimatePresence>
            {showEffect && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-center justify-center pointer-events-none"
                >
                    {/* Main gift container */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{
                            type: "spring",
                            damping: 10,
                            stiffness: 100,
                            duration: 0.8
                        }}
                        className="relative"
                    >
                        {/* Gift box */}
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden"
                        >
                            {/* Gift image or icon */}
                            <div className="relative w-28 h-28 flex items-center justify-center z-10">
                                {giftInfo?.mediaUrl ? (
                                    <img
                                        src={giftInfo.mediaUrl}
                                        alt={giftInfo.name}
                                        className="w-full h-full object-contain drop-shadow-2xl"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div className={`w-full h-full items-center justify-center ${giftInfo?.mediaUrl ? 'hidden' : 'flex'}`}>
                                    <Gift className="w-20 h-20 text-white drop-shadow-2xl" />
                                </div>

                                {/* Subtle glow effect for gift image */}
                                {giftInfo?.mediaUrl && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 to-purple-400/10 rounded-full blur-lg" />
                                )}
                            </div>

                            {/* Sparkle effects */}
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{
                                        scale: 0,
                                        opacity: 0,
                                        x: 0,
                                        y: 0
                                    }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        opacity: [0, 1, 0],
                                        x: Math.cos(i * 60 * Math.PI / 180) * 80,
                                        y: Math.sin(i * 60 * Math.PI / 180) * 80
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        delay: 0.5 + i * 0.1,
                                        ease: "easeOut"
                                    }}
                                    className="absolute"
                                >
                                    <Sparkles className="w-4 h-4 text-yellow-300" />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Floating hearts */}
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    scale: 0,
                                    opacity: 0,
                                    x: 0,
                                    y: 0,
                                    rotate: 0
                                }}
                                animate={{
                                    scale: [0, Math.random() * 0.8 + 0.4, 0],
                                    opacity: [0, Math.random() * 0.8 + 0.4, 0],
                                    x: (Math.random() - 0.5) * 300,
                                    y: -120 - Math.random() * 150,
                                    rotate: Math.random() * 360
                                }}
                                transition={{
                                    duration: 2.5 + Math.random() * 1,
                                    delay: 0.8 + i * 0.08,
                                    ease: "easeOut"
                                }}
                                className="absolute top-1/2 left-1/2"
                            >
                                <Heart
                                    className={`w-5 h-5 ${Math.random() > 0.5
                                        ? 'text-pink-400'
                                        : Math.random() > 0.5
                                            ? 'text-red-400'
                                            : 'text-rose-300'
                                        }`}
                                    fill="currentColor"
                                />
                            </motion.div>
                        ))}

                        {/* Gift name above the gift box */}
                        {giftInfo?.name && (
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-center"
                            >
                                <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-yellow-400/30 shadow-lg">
                                    <p className="text-base font-bold text-yellow-200 drop-shadow-lg whitespace-nowrap">
                                        {actorDisplayName} tặng bạn: "{giftInfo.name}"
                                    </p>
                                </div>
                            </motion.div>
                        )}


                    </motion.div>

                    {/* Background particles */}
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                scale: 0,
                                opacity: 0,
                                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
                                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600)
                            }}
                            animate={{
                                scale: [0, Math.random() * 0.8 + 0.2, 0],
                                opacity: [0, Math.random() * 0.8 + 0.2, 0],
                                y: [null, -150 - Math.random() * 100]
                            }}
                            transition={{
                                duration: 2 + Math.random() * 2,
                                delay: Math.random() * 2,
                                ease: "easeOut"
                            }}
                            className={`absolute rounded-full ${Math.random() > 0.5
                                ? 'bg-pink-300'
                                : Math.random() > 0.5
                                    ? 'bg-purple-300'
                                    : 'bg-yellow-300'
                                }`}
                            style={{
                                width: Math.random() * 4 + 2,
                                height: Math.random() * 4 + 2
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GiftReceivedEffect;
