import { useEffect, useRef, useCallback } from 'react';
import websocketService from '../services/websocketService';

export const useWebSocket = (postId, isConnected = false, onCommentUpdate = null) => {
    const isConnectedRef = useRef(isConnected);

    useEffect(() => {
        isConnectedRef.current = isConnected;
    }, [isConnected]);

    const handleNewComment = useCallback((data) => {
        if (data.postId === postId && onCommentUpdate) {
            onCommentUpdate('newComment', {
                id: data.comment.id,
                content: data.comment.content,
                author: data.comment.author.displayName,
                avatar: data.comment.author.avatarUrl,
                createdAt: data.comment.createdAt,
                reactionCount: data.comment.reactionCount || 0,
                replyCount: data.comment.replyCount || 0,
                isReactedByCurrentUser: data.comment.isReactedByCurrentUser || false,
                replies: [],
            });
        }
    }, [postId, onCommentUpdate]);

    const handleNewReply = useCallback((data) => {
        if (data.postId === postId && onCommentUpdate) {
            onCommentUpdate('newReply', {
                parentId: data.parentCommentId,
                reply: {
                    id: data.reply.id,
                    content: data.reply.content,
                    author: data.reply.author.displayName,
                    avatar: data.reply.author.avatarUrl,
                    createdAt: data.reply.createdAt,
                    reactionCount: data.reply.reactionCount || 0,
                    replyCount: data.reply.replyCount || 0,
                    isReactedByCurrentUser: data.reply.isReactedByCurrentUser || false,
                    replies: [],
                }
            });
        }
    }, [postId, onCommentUpdate]);

    const handleCommentLiked = useCallback((data) => {
        if (data.postId === postId && onCommentUpdate) {
            onCommentUpdate('commentLiked', {
                commentId: data.commentId,
                isLiked: data.isLiked,
                reactionCount: data.reactionCount
            });
        }
    }, [postId, onCommentUpdate]);

    const handleCommentDeleted = useCallback((data) => {
        if (data.postId === postId && onCommentUpdate) {
            onCommentUpdate('commentDeleted', {
                commentId: data.commentId
            });
        }
    }, [postId, onCommentUpdate]);

    const handleReplyDeleted = useCallback((data) => {
        if (data.postId === postId && onCommentUpdate) {
            onCommentUpdate('replyDeleted', {
                replyId: data.replyId
            });
        }
    }, [postId, onCommentUpdate]);

    useEffect(() => {
        if (!postId) return;

        // Subscribe to WebSocket events
        websocketService.subscribe('newComment', handleNewComment);
        websocketService.subscribe('newReply', handleNewReply);
        websocketService.subscribe('commentLiked', handleCommentLiked);
        websocketService.subscribe('commentDeleted', handleCommentDeleted);
        websocketService.subscribe('replyDeleted', handleReplyDeleted);

        // Cleanup on unmount
        return () => {
            websocketService.unsubscribe('newComment', handleNewComment);
            websocketService.unsubscribe('newReply', handleNewReply);
            websocketService.unsubscribe('commentLiked', handleCommentLiked);
            websocketService.unsubscribe('commentDeleted', handleCommentDeleted);
            websocketService.unsubscribe('replyDeleted', handleReplyDeleted);
        };
    }, [postId, handleNewComment, handleNewReply, handleCommentLiked, handleCommentDeleted, handleReplyDeleted]);

    const sendComment = useCallback((postId, content) => {
        websocketService.send({
            type: 'SEND_COMMENT',
            payload: {
                postId,
                content
            }
        });
    }, []);

    const sendReply = useCallback((postId, parentCommentId, content) => {
        websocketService.send({
            type: 'SEND_REPLY',
            payload: {
                postId,
                parentCommentId,
                content
            }
        });
    }, []);

    const sendLike = useCallback((postId, commentId, isLiked) => {
        websocketService.send({
            type: 'LIKE_COMMENT',
            payload: {
                postId,
                commentId,
                isLiked
            }
        });
    }, []);

    return {
        sendComment,
        sendReply,
        sendLike,
        isConnected: websocketService.isConnected()
    };
};
