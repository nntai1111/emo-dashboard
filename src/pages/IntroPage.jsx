import React from "react";
import { motion } from "framer-motion";
import Button from "../components/atoms/Button";

const IntroPage = ({ onSkip }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center text-white">
        {/* Logo/Brand */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8">
          <h1 className="text-4xl font-bold mb-2">EmoSocial</h1>
          <p className="text-lg opacity-90">Connect with your emotions</p>
        </motion.div>

        {/* Intro Content - Bạn có thể custom phần này */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12">
          {/* Placeholder cho content intro của bạn */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-3">
                Welcome to EmoSocial
              </h2>
              <p className="text-white/80">
                A place where you can express your emotions and connect with
                others who understand your feelings.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Share Your Story</h3>
              <p className="text-white/80">
                Create posts, join groups, and build meaningful connections in a
                safe and supportive environment.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Stay Connected</h3>
              <p className="text-white/80">
                Chat with friends, receive notifications, and never miss
                important moments in your community.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Skip Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4">
          <Button
            onClick={onSkip}
            variant="secondary"
            size="lg"
            className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
            Skip Introduction
          </Button>

          <p className="text-sm text-white/60">
            You can always view this intro again in settings
          </p>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></motion.div>
      </div>
    </motion.div>
  );
};

export default IntroPage;
