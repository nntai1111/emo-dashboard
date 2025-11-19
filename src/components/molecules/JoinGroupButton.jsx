import React, { useState } from "react";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../atoms/Button";

const JoinGroupButton = ({
  initialStatus = "not_requested", // not_requested, pending, joined
  onJoinGroup,
  groupName,
  className = "",
}) => {
  const [joinStatus, setJoinStatus] = useState(initialStatus);

  const handleJoinGroup = async () => {
    if (joinStatus === "pending" || joinStatus === "joined") return;

    try {
      setJoinStatus("pending");

      if (onJoinGroup) {
        await onJoinGroup();
      }

      // Simulate API call
      setTimeout(() => {
        setJoinStatus("joined");
      }, 2000);
    } catch (error) {
      console.error("Failed to join group:", error);
      setJoinStatus("not_requested");
    }
  };

  const getButtonConfig = () => {
    switch (joinStatus) {
      case "pending":
        return {
          text: "Chờ duyệt...",
          variant: "secondary",
          disabled: true,
          loading: false,
        };
      case "joined":
        return {
          text: "Đã tham gia",
          variant: "success",
          disabled: true,
          loading: false,
        };
      default:
        return {
          text: "Tham gia nhóm",
          variant: "primary",
          disabled: false,
          loading: false,
        };
    }
  };

  const config = getButtonConfig();

  return (
    <motion.div whileTap={{ scale: 0.98 }} className={`${className}`}>
      <Button
        variant={config.variant}
        size="sm"
        onClick={handleJoinGroup}
        disabled={config.disabled}
        loading={config.loading}
        className="flex items-center space-x-2">
        <Users className="w-4 h-4" />
        <span>{config.text}</span>
      </Button>

      {groupName && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {groupName}
        </p>
      )}
    </motion.div>
  );
};

export default JoinGroupButton;
