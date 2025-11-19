import React, { useState } from "react";
import { useSelector } from "react-redux";
import CommentInput from "../atoms/CommentInput";
import Avatar from "../atoms/Avatar";

const CommentForm = ({
  onSubmit,
  isSubmitting = false,
  placeholder = "Viết bình luận...\n(Shift+Enter để xuống dòng)",
  className = "",
}) => {
  const [comment, setComment] = useState("");
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async () => {
    if (!comment.trim() || isSubmitting) return;

    try {
      await onSubmit(comment.trim());
      setComment("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  const userAvatar = (
    <Avatar username={user?.aliasLabel || user?.username || "Anonymous"} size="sm" rounded={false} />
  );

  return (
    <div className={`pt-4 ${className}`}>
      <CommentInput
        value={comment}
        onChange={setComment}
        onSubmit={handleSubmit}
        placeholder={placeholder}
        disabled={isSubmitting}
        loading={isSubmitting}
        avatar={userAvatar}
        autoFocus={false}
        maxLength={500}
      />
    </div>
  );
};

export default CommentForm;
